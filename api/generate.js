export default async function handler(request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
  }

  try {
    const body = await request.json();
    const company = String(body.company || "").trim();
    const website = String(body.website || "").trim();
    const industry = String(body.industry || "").trim();
    const notes = String(body.notes || "").trim();

    if (!company) {
      return Response.json({ error: "Company name is required." }, { status: 400 });
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

    const response = await fetch("https://api.openai.com/v1/responses", {
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
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || "The AI request failed." },
        { status: response.status }
      );
    }

    let text = data.output_text || "";
    text = text.replace(/^\`\`\`json\s*/i, "").replace(/\s*\`\`\`$/i, "").trim();

    let brief;
    try {
      brief = JSON.parse(text);
    } catch {
      return Response.json({ error: "The AI returned an unexpected format. Please try again." }, { status: 502 });
    }

    return Response.json({ brief });
  } catch (error) {
    return Response.json({ error: "Something went wrong while generating the brief." }, { status: 500 });
  }
}
