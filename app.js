const demoBrief = {
  snapshot: "Apapacho Wines is presented here as a wine and beverage business shipping temperature sensitive products. The details below are a working hypothesis based on the information entered, not verified company research.",
  priorities: [
    "Protect product quality during transit",
    "Reduce late or disrupted deliveries",
    "Create a more proactive view of shipment issues"
  ],
  challenges: [
    "Limited visibility into conditions while products are in transit",
    "A delay or temperature issue may only become visible after the shipment is already at risk",
    "Operational teams may have data without a consistent workflow for acting on it"
  ],
  questions: [
    "When a shipment is delayed today, how quickly does your team know there is a problem?",
    "What conditions create the biggest risk for your products while they are in transit?",
    "Who owns the response when a shipment starts moving outside the expected range?"
  ],
  opportunities: [
    "Use shipment and condition data to identify issues earlier",
    "Build a repeatable workflow for responding to at risk shipments",
    "Connect shipment visibility to the team's existing customer and operational processes"
  ],
  risks: [
    "The customer may have access to shipment data without incorporating it into daily workflows",
    "If the value of proactive monitoring is not clear, adoption may remain passive"
  ]
};

const $ = (id) => document.getElementById(id);

$("generate").addEventListener("click", async () => {
  const button = $("generate");
  const result = $("result");

  button.disabled = true;
  button.textContent = "Generating...";
  result.classList.remove("hidden");
  result.innerHTML = '<div class="loading">Building your customer brief...</div>';

  await new Promise(resolve => setTimeout(resolve, 650));

  const company = $("company").value.trim() || "This customer";
  renderBrief(company, demoBrief);

  button.disabled = false;
  button.textContent = "Generate customer brief";
});

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
  return `<div class="brief-section"><h3>${title}</h3><ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}