export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({ error: "OPENAI_API_KEY is not configured." });
  }

  try {
    const body = request.body || {};
    const company = String(body.company || "").trim();
    const website = String(body.website || "").trim();
    const industry = String(body.industry || "").trim();
    const conversationType = String(body.conversationType || "First conversation").trim();
    const notes = String(body.notes || "").trim();

    if (!company) {
      return response.status(400).json({ error: "Company name is required." });
    }

    const prompt = `Company: ${company}
Website: ${website || "Not provided"}
Industry: ${industry || "Not provided"}
Conversation type: ${conversationType}
Customer notes: ${notes || "Not provided"}

Create a concise Customer Success account brief for a CSM preparing for the specified conversation type.

Return ONLY valid JSON with these keys:
snapshot: string
priorities: string[]
challenges: string[]
questions: string[]
opportunities: string[]
risks: string[]

Rules:
- Do not invent facts.
- Clearly frame reasonable inferences as hypotheses.
- Use the supplied notes as facts, but do not treat assumptions as verified facts.
- Keep the brief company and industry agnostic.
- Tailor the questions, opportunities, and risks to the conversation type.
- Make the questions CSM focused: goals, outcomes, adoption, stakeholders, friction, satisfaction, value, next steps, or renewal and expansion considerations when relevant.
- Avoid questions that are overly specific to the customer's industry unless the supplied context makes them clearly relevant.
- Keep each list to 3 items.
- Keep the output practical and concise.`;

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        input: [
          {
            role: "developer",
            content: "You are a Customer Success research assistant. Help CSMs prepare for customer conversations quickly while being explicit about uncertainty."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_output_tokens: 1200
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return response.status(openaiResponse.status).json({
        error: data.error?.message || "The AI request failed."
      });
    }

    const outputItems = Array.isArray(data.output) ? data.output : [];
    const textParts = [];

    for (const item of outputItems) {
      if (!Array.isArray(item.content)) continue;
      for (const part of item.content) {
        if (typeof part.text === "string") {
          textParts.push(part.text);
        }
      }
    }

    const text = textParts.join("").trim()
      .replace(/^\`\`\`json\s*/i, "")
      .replace(/\s*\`\`\`$/i, "")
      .trim();

    if (!text) {
      return response.status(502).json({
        error: "The AI response did not contain usable text. Please try again."
      });
    }

    let brief;
    try {
      brief = JSON.parse(text);
    } catch {
      return response.status(502).json({
        error: "The AI returned an unexpected format. Please try again."
      });
    }

    return response.status(200).json({ brief });
  } catch (error) {
    console.error("generate error:", error);
    return response.status(500).json({
      error: error?.message || "Something went wrong while generating the brief."
    });
  }
}