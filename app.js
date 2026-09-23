const demoBrief = {
  snapshot: "Thrive Causemetics is a beauty and cosmetics brand with a strong focus on customer experience, product innovation, and community impact. The details below are based on public customer context and are intended as a sample starting point for a CSM conversation.",
  priorities: [
    "Deliver a strong customer experience across the buying journey",
    "Understand how customers are engaging with products and where there is room to improve",
    "Support continued growth while maintaining customer trust and loyalty"
  ],
  challenges: [
    "Customer expectations can change quickly as product preferences and buying behavior evolve",
    "A customer issue or point of friction can affect both satisfaction and long term loyalty",
    "Teams need clear visibility into customer feedback, adoption, and areas where the experience could improve"
  ],
  questions: [
    "What outcomes matter most to the customer right now?",
    "How are they currently using the product or service, and where are they experiencing friction?",
    "What would make this conversation successful from the customer's perspective?"
  ],
  opportunities: [
    "Connect the customer's priorities to specific ways the product or service can provide value",
    "Identify gaps in adoption, workflow, or customer experience that the CSM can help address",
    "Agree on clear next steps and measures of success"
  ],
  risks: [
    "The customer may have access to the product or service without fully incorporating it into their regular workflows",
    "Customer priorities, stakeholders, or expectations may have changed since the last conversation"
  ]
};

const $ = (id) => document.getElementById(id);

$("generate").addEventListener("click", async () => {
  await generateBrief();
});

$("demoSample").addEventListener("click", () => {
  $("company").value = "Thrive Causemetics";
  $("website").value = "https://thrivecausemetics.com/";
  $("industry").value = "Beauty and cosmetics";
  $("conversationType").value = "Account review";
  $("notes").value = "Direct to consumer beauty brand with a strong focus on customer experience, product innovation, and community impact. Use this as a sample customer context.";
  renderBrief("Thrive Causemetics", demoBrief);
});

async function generateBrief() {
  const button = $("generate");
  const result = $("result");

  button.disabled = true;
  button.textContent = "Generating...";
  result.classList.remove("hidden");
  result.innerHTML = '<div class="loading">Building your customer brief...</div>';

  const payload = {
    company: $("company").value.trim(),
    website: $("website").value.trim(),
    industry: $("industry").value.trim(),
    conversationType: $("conversationType").value.trim(),
    notes: $("notes").value.trim()
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const raw = await response.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error(
        response.ok
          ? "The server returned an unexpected response."
          : `Server error (${response.status}): ${raw.slice(0, 500)}`
      );
    }

    if (!response.ok) {
      throw new Error(data.error || "Unable to generate the brief.");
    }

    renderBrief(payload.company || "This customer", data.brief);
  } catch (error) {
    if (error.name === "AbortError") {
      error = new Error("The request took longer than expected. Please try again.");
    }
    result.innerHTML = `<div class="error"><strong>AI generation is not available right now.</strong><p>${escapeHtml(error.message)}</p><p>You can still preview the sample brief below.</p><button id="demo">View Thrive Causemetics sample</button></div>`;
    $("demo").addEventListener("click", () => renderBrief("Thrive Causemetics", demoBrief));
  } finally {
    button.disabled = false;
    button.textContent = "Generate customer brief";
  }
}

function renderBrief(company, brief) {
  $("result").innerHTML = `
    <div class="result-header">
      <div>
        <h2>${escapeHtml(company)}</h2>
        <p>Customer conversation brief</p>
      </div>
    </div>
    <div class="brief-grid">
      ${section("Customer snapshot", brief.snapshot)}
      ${listSection("What matters to them", brief.priorities)}
      ${listSection("Potential challenges", brief.challenges)}
      ${listSection("Questions I’d ask", brief.questions)}
      ${listSection("Potential value opportunities", brief.opportunities)}
      ${listSection("Risks to watch", brief.risks)}
    </div>
  `;
}

function section(title, text) {
  return `<div class="brief-section"><h3>${title}</h3><p>${escapeHtml(text)}</p></div>`;
}

function listSection(title, items) {
  return `<div class="brief-section"><h3>${title}</h3><ul>${(items || []).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}