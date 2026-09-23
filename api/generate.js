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
    const notes = String(body.notes || "").trim();

    if (!company) {
      return response.status(400).json({ error: "Company name is required." });
    }

    const prompt = `Company: ${company}
Website: ${website || "Not provided"}
Industry: ${industry || "Not provided"}
Customer notes: ${notes || "Not provided"}

Create a concise Customer Success account brief. Return ONLY valid JSON with these keys:
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
- Focus on helping a CSM prepare for a useful customer conversation.
- Keep each list to 3 items.
- Make the questions specific to this customer's likely operations.
- Do not mention Tive unless the user explicitly provides Tive as a product or customer context.
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
            content: "You are a Customer Success research assistant. Help CSMs understand customers quickly while being explicit about uncertainty."
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

    const text = String(data.output_text || "")
      .replace(/^\`\`\`json\s*/i, "")
      .replace(/\s*\`\`\`$/i, "")
      .trim();

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