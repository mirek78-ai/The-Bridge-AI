const storageKey = "the-ai-bridge-state-v1";
const legacyStorageKey = "concord-ai-state-v1";

const defaults = {
  assessment: {
    name: "",
    outcome: "",
    owner: "",
    stakeholders: "",
    impact: 3,
    autonomy: 2,
    reversibility: 4
  },
  matrix: [
    { activity: "Approve high-impact outcomes", mode: "Human-led", owner: "Executive sponsor", control: "Recorded approval" },
    { activity: "Generate decision recommendation", mode: "Shared", owner: "Domain lead", control: "Source citations" },
    { activity: "Monitor model performance", mode: "AI-led", owner: "Model risk owner", control: "Alert thresholds" },
    { activity: "Handle exceptions and appeals", mode: "Human-led", owner: "Operations lead", control: "Appeal workflow" },
    { activity: "Detect data quality anomalies", mode: "AI-led", owner: "Data steward", control: "Quality dashboard" },
    { activity: "Change operating policy", mode: "Human-led", owner: "Governance council", control: "Formal review" }
  ],
  guardrails: [
    { category: "Accountability", title: "Named outcome owner", description: "A person or governance body is explicitly answerable for system outcomes.", owner: "Executive sponsor", status: "Implemented" },
    { category: "Transparency", title: "Decision traceability", description: "Material recommendations retain their inputs, rationale, and model version.", owner: "Architecture lead", status: "In progress" },
    { category: "Human agency", title: "Override and appeal", description: "People can contest outcomes and qualified operators can intervene.", owner: "Operations lead", status: "Open" },
    { category: "Risk", title: "Autonomy thresholds", description: "The system pauses or escalates when confidence or impact thresholds are crossed.", owner: "Model risk owner", status: "Open" },
    { category: "Data", title: "Purpose-bound data use", description: "Data use is limited to approved purposes with lineage and access controls.", owner: "Data steward", status: "Open" },
    { category: "Resilience", title: "Fallback operating mode", description: "A tested human-operated fallback exists when AI services are unavailable.", owner: "Service owner", status: "Open" },
    { category: "Infrastructure", title: "Secure configuration baseline", description: "Infrastructure and AI platforms continuously conform to approved hardened configurations.", owner: "Infrastructure security", status: "Open" },
    { category: "Resilience", title: "Recovery objectives and testing", description: "Critical services have approved recovery objectives validated through recurring exercises.", owner: "Resilience lead", status: "Open" }
  ],
  controls: {},
  inventory: [
    { id: "outcome-trust", name: "Trusted customer decisions", type: "Business outcome", owner: "Chief Customer Officer", criticality: "Critical", lifecycle: "Strategic", dependsOn: ["service-decision"] },
    { id: "service-decision", name: "AI-assisted decision service", type: "Critical service", owner: "Service Owner", criticality: "Critical", lifecycle: "Production", dependsOn: ["app-workbench", "model-decision", "data-customer"] },
    { id: "app-workbench", name: "Decision workbench", type: "Application", owner: "Product Lead", criticality: "High", lifecycle: "Production", dependsOn: ["platform-cloud"] },
    { id: "model-decision", name: "Decision recommendation model", type: "AI model", owner: "Model Risk Owner", criticality: "Critical", lifecycle: "Production", dependsOn: ["data-customer", "supplier-model"] },
    { id: "data-customer", name: "Governed customer data product", type: "Data product", owner: "Data Steward", criticality: "Critical", lifecycle: "Production", dependsOn: ["platform-cloud"] },
    { id: "platform-cloud", name: "Secure cloud platform", type: "Infrastructure", owner: "Platform Engineering", criticality: "Critical", lifecycle: "Strategic", dependsOn: ["supplier-cloud"] },
    { id: "supplier-model", name: "Foundation model provider", type: "Supplier", owner: "Supplier Risk", criticality: "High", lifecycle: "Active", dependsOn: [] },
    { id: "supplier-cloud", name: "Cloud service provider", type: "Supplier", owner: "Supplier Risk", criticality: "Critical", lifecycle: "Active", dependsOn: [] }
  ],
  decisions: [
    { id: "ADR-003", title: "Require human approval for high-impact outcomes", rationale: "Preserve meaningful human judgment where decisions may materially affect customers.", owner: "AI Governance Council", review: "2026-12-15", status: "Approved", ai: "Advised" },
    { id: "ADR-002", title: "Adopt isolated recovery environment", rationale: "Reduce correlated failure and cyber recovery risk for the critical decision service.", owner: "Architecture Review Board", review: "2026-09-30", status: "Approved", ai: "None" },
    { id: "ADR-001", title: "Use external foundation model with abstraction layer", rationale: "Enable provider portability while preserving access controls and observability.", owner: "Chief Architect", review: "2026-08-01", status: "Review due", ai: "Co-created" }
  ],
  evidence: {
    "ev-recovery": { reference: "Recovery exercise Q1", reviewed: "2026-03-18", expiry: "2026-09-18" },
    "ev-model": { reference: "Model evaluation pack v3", reviewed: "2026-05-20", expiry: "2026-08-20" }
  },
  readiness: {}
};

const scenarios = [
  { id: "model-outage", category: "Technology", name: "AI model provider outage", description: "The external foundation model becomes unavailable during peak operations.", score: 76, assets: ["AI-assisted decision service", "Decision recommendation model", "Foundation model provider"], outcomes: ["Customer decisions delayed", "Manual review queues increase"], controls: ["Provider abstraction layer", "Human fallback procedure", "Capacity plan for manual review"], response: ["Detect provider failure", "Disable automated recommendations", "Activate human fallback", "Communicate service impact", "Review provider resilience"] },
  { id: "cloud-region", category: "Technology", name: "Primary cloud region failure", description: "The cloud region hosting the decision workbench and governed data product is unavailable.", score: 88, assets: ["Decision workbench", "Governed customer data product", "Secure cloud platform", "Cloud service provider"], outcomes: ["Critical service unavailable", "Recovery objectives at risk"], controls: ["Multi-region recovery pattern", "Isolated backups", "Recurring recovery exercise"], response: ["Declare major incident", "Validate impact tolerance", "Fail over critical workloads", "Reconcile data", "Capture recovery evidence"] },
  { id: "harmful-output", category: "Process", name: "Harmful AI recommendation passes controls", description: "The model produces a plausible but harmful recommendation and the business process fails to intercept it.", score: 92, assets: ["AI-assisted decision service", "Decision recommendation model", "Governed customer data product"], outcomes: ["Customer harm", "Regulatory and reputation impact"], controls: ["Human approval threshold", "Decision traceability", "Appeal and remediation workflow"], response: ["Pause affected decisions", "Notify accountable owner", "Review trace and cohort", "Remediate affected outcomes", "Update model controls"] },
  { id: "privileged-compromise", category: "Technology", name: "Privileged infrastructure compromise", description: "A privileged platform identity is compromised and used to modify production configuration.", score: 95, assets: ["Secure cloud platform", "Decision workbench", "Governed customer data product"], outcomes: ["Integrity of critical service uncertain", "Potential data exposure"], controls: ["Just-in-time privilege", "Configuration baseline as code", "Immutable audit telemetry"], response: ["Revoke privileged access", "Contain affected platform", "Verify configuration integrity", "Recover trusted state", "Complete incident review"] },
  { id: "automation-bias", category: "People", name: "People stop challenging AI", description: "Operators over-trust AI recommendations and stop applying meaningful professional judgment.", score: 91, assets: ["AI-assisted decision service", "Decision workbench", "Decision recommendation model"], outcomes: ["Systematic harmful decisions", "Human accountability becomes nominal"], controls: ["Mandatory challenge points", "AI literacy and calibration", "Quality sampling by independent reviewers"], response: ["Pause high-impact automation", "Assess affected decisions", "Restore mandatory review", "Coach and recalibrate teams", "Redesign decision workflow"] },
  { id: "skills-gap", category: "People", name: "Critical skills unavailable during incident", description: "The few people able to operate or override the AI-enabled service are unavailable during a major incident.", score: 84, assets: ["AI-assisted decision service", "Secure cloud platform"], outcomes: ["Recovery delayed", "Unsafe decisions continue or services stop"], controls: ["Role redundancy", "Cross-training and exercises", "Clear emergency authority"], response: ["Activate incident leadership", "Invoke human fallback", "Bring in trained alternates", "Stabilize critical outcomes", "Remediate skills concentration"] },
  { id: "broken-handoff", category: "Process", name: "Human–AI handoff breaks at scale", description: "Exception volumes exceed human capacity and cases remain unresolved or are handled inconsistently.", score: 87, assets: ["AI-assisted decision service", "Decision workbench"], outcomes: ["Backlogs and customer harm", "Controls bypassed to maintain throughput"], controls: ["Exception capacity thresholds", "Prioritization rules", "Safe degradation procedure"], response: ["Reduce AI autonomy", "Prioritize highest-impact cases", "Add surge capacity", "Communicate delays", "Redesign exception process"] },
  { id: "shadow-ai", category: "Process", name: "Unapproved AI becomes embedded in work", description: "Teams use unsanctioned AI tools and sensitive information outside governed enterprise processes.", score: 89, assets: ["Governed customer data product", "Decision workbench"], outcomes: ["Data leakage", "Untraceable decisions and regulatory exposure"], controls: ["Approved AI service catalog", "Data loss prevention", "Practical intake and exception process"], response: ["Contain exposed data", "Identify affected work", "Provide approved alternative", "Educate teams", "Improve governance usability"] }
];

const readinessLifecycle = [
  { day: "Day 0", title: "Design for responsible adoption", description: "Before production: align intent, people, process, architecture, risk, and exit criteria.", items: ["Business outcome and accountable owner defined", "People and roles impact assessed", "Process and decision rights redesigned", "Architecture, data, security, and resilience assessed", "Worst-case scenarios exercised", "Go/no-go criteria approved"] },
  { day: "Day 1", title: "Launch with control and support", description: "At production launch: verify safe operation, support, visibility, and intervention.", items: ["Production authority and access verified", "Human support and escalation staffed", "Monitoring and decision traceability active", "Fallback and rollback immediately available", "Users trained on limitations and challenge", "Launch assurance evidence captured"] },
  { day: "Day 2", title: "Operate, learn, and adapt", description: "After launch: continuously govern value, harm, drift, resilience, and change.", items: ["Business and human outcomes measured", "Model, process, and control drift monitored", "Incidents and near misses reviewed", "Evidence and decisions renewed before expiry", "Roles and skills adapted using feedback", "Retirement and replacement readiness maintained"] }
];

const assuranceItems = [
  { id: "ev-recovery", title: "Critical service recovery exercise", description: "Evidence that recovery objectives and human fallback work under disruption.", owner: "Resilience Lead" },
  { id: "ev-model", title: "AI model evaluation and approval", description: "Current performance, safety, bias, and human-impact evaluation evidence.", owner: "Model Risk Owner" },
  { id: "ev-security", title: "Infrastructure security baseline", description: "Current conformance and exception evidence for critical infrastructure.", owner: "Infrastructure Security" },
  { id: "ev-threat", title: "Threat model and response test", description: "Validated threat model and exercised response for AI-enabled services.", owner: "Security Operations" },
  { id: "ev-supplier", title: "Critical supplier assurance", description: "Current resilience, security, concentration, and exit evidence.", owner: "Supplier Risk" },
  { id: "ev-human", title: "Human accountability and appeal test", description: "Evidence that human oversight, override, and appeal mechanisms work.", owner: "AI Governance Council" }
];

const futureSignals = [
  { level: "Act now", title: "AI agents become operating actors", detail: "Agents will initiate transactions, coordinate tools, and change operational state.", domain: "Decision rights · Identity · Observability" },
  { level: "Prepare", title: "Human roles shift from execution to assurance", detail: "Work design will increasingly emphasize judgment, escalation, verification, and exception handling.", domain: "People · Business architecture · Accountability" },
  { level: "Prepare", title: "Model and supplier concentration grows", detail: "A small number of providers may become embedded across many critical business services.", domain: "Resilience · Supplier risk · Platform architecture" },
  { level: "Watch", title: "Continuous AI regulation and assurance", detail: "Point-in-time approvals will give way to ongoing evidence, monitoring, and adaptive controls.", domain: "Governance · Evidence · Model lifecycle" },
  { level: "Act now", title: "Machine identity becomes a control boundary", detail: "Every AI agent, model, and automated workload will require governed identity and authority.", domain: "Security · Infrastructure · AI governance" },
  { level: "Watch", title: "Synthetic data changes information trust", detail: "Organizations will need stronger provenance to distinguish generated, transformed, and authoritative data.", domain: "Data · Security · Transparency" },
  { level: "Prepare", title: "AI incidents become business continuity events", detail: "Unsafe or unavailable AI will disrupt business processes, not merely technology components.", domain: "Resilience · Operations · Human fallback" },
  { level: "Watch", title: "Value moves to human-AI operating models", detail: "Competitive advantage will depend less on model access and more on redesigning decisions and work.", domain: "Strategy · People · Business architecture" }
];

const adviceModels = {
  autonomy: { title: "Govern autonomy as earned authority", summary: "Increase AI autonomy only when the organization can prove bounded authority, observable behavior, effective intervention, and named human accountability.", actions: ["Define autonomy tiers and prohibited actions", "Issue governed identities to agents and models", "Require escalation at impact thresholds"], assumptions: ["AI agents will act across multiple systems", "Accountability remains legally and ethically human"], evidence: ["Decision traceability", "Intervention test results", "Authority and access reviews"] },
  workforce: { title: "Design the human-AI operating model first", summary: "Treat AI adoption as organizational redesign. Protect meaningful human agency while shifting work toward judgment, assurance, relationships, and exception handling.", actions: ["Map roles and decisions affected by AI", "Define new assurance and escalation responsibilities", "Measure workforce and customer outcomes"], assumptions: ["Roles change before jobs fully disappear", "AI literacy becomes a core leadership capability"], evidence: ["Role transition plans", "Human override exercises", "Adoption and outcome measures"] },
  platform: { title: "Invest in control-rich AI platforms", summary: "Prioritize reusable foundations for identity, provenance, evaluation, observability, portability, and recovery instead of isolated AI deployments.", actions: ["Build a governed AI platform reference architecture", "Reduce model-provider lock-in", "Integrate evidence collection into delivery"], assumptions: ["Model capabilities and providers will change rapidly", "Shared controls reduce adoption friction"], evidence: ["Platform conformance", "Provider exit test", "Control telemetry"] },
  resilience: { title: "Prepare for AI as a critical service dependency", summary: "Design safe degradation and human fallback for AI-enabled processes, while testing supplier, model, data, and privileged-access failures.", actions: ["Map AI dependencies into critical services", "Exercise harmful-output and provider-outage scenarios", "Fund fallback capacity and recovery engineering"], assumptions: ["AI failures can propagate into business outcomes", "Supplier concentration remains material"], evidence: ["Scenario exercise results", "Recovery objective attainment", "Fallback capacity test"] }
};

const eaDomains = [
  { name: "Strategy & Governance", outcome: "Value, accountability, and risk appetite align.", capabilities: ["Portfolio governance", "Principles & standards", "Decision rights"] },
  { name: "Business Architecture", outcome: "Human and AI work supports critical outcomes.", capabilities: ["Capability mapping", "Value streams", "Operating model"] },
  { name: "Data & AI", outcome: "Trusted data and governed AI enable decisions.", capabilities: ["Data products", "Model lifecycle", "AI assurance"] },
  { name: "Application Architecture", outcome: "Composable services support controlled change.", capabilities: ["Service boundaries", "Integration", "Lifecycle management"] },
  { name: "Technology Infrastructure", outcome: "Platforms are scalable, observable, and recoverable.", capabilities: ["Cloud & platform", "Network", "Compute & storage"] },
  { name: "Infrastructure Security", outcome: "Every identity, workload, and connection is verified.", capabilities: ["Zero trust", "Workload protection", "Secure configuration"] },
  { name: "Digital Resilience", outcome: "Critical outcomes continue through disruption.", capabilities: ["Impact tolerance", "Continuity & recovery", "Operational resilience"] },
  { name: "People & Change", outcome: "People can direct, challenge, and improve AI.", capabilities: ["AI literacy", "Role design", "Adoption & feedback"] }
];

const resilienceCapabilities = [
  { id: "res-critical", title: "Critical service mapping", description: "Connect critical business outcomes to processes, people, applications, data, infrastructure, and third parties.", owner: "Business resilience", metric: "% critical services mapped", controls: ["Critical services identified", "Dependencies mapped", "Impact tolerances approved"] },
  { id: "res-recovery", title: "Recovery engineering", description: "Design and validate recovery patterns based on business impact, not only technology availability.", owner: "Platform engineering", metric: "Recovery objective attainment", controls: ["RTO and RPO approved", "Backups isolated and tested", "Recovery exercises completed"] },
  { id: "res-continuity", title: "Continuity and human fallback", description: "Maintain safe operating modes when AI, cloud, data, or automation services are unavailable.", owner: "Operations", metric: "Fallback exercise success", controls: ["Manual fallback documented", "Minimum staffing defined", "AI failure mode rehearsed"] },
  { id: "res-observability", title: "Operational observability", description: "Detect service degradation and emerging concentration risk before critical outcomes are affected.", owner: "Service reliability", metric: "Mean time to detect", controls: ["End-to-end service telemetry", "Impact-based alerting", "Dependency health monitored"] },
  { id: "res-suppliers", title: "Third-party resilience", description: "Manage cloud, model, data, and technology supplier dependencies within impact tolerances.", owner: "Supplier risk", metric: "% critical suppliers assured", controls: ["Exit strategy documented", "Concentration risk assessed", "Supplier recovery evidence reviewed"] },
  { id: "res-learning", title: "Incident learning and adaptation", description: "Turn incidents, near misses, and exercises into architecture improvements and investment decisions.", owner: "Resilience forum", metric: "Actions closed on time", controls: ["Blameless reviews completed", "Architecture actions tracked", "Risk scenarios refreshed"] }
];

const securityCapabilities = [
  { id: "sec-identity", title: "Identity and privileged access", description: "Verify every human and machine identity and strictly govern privileged activity.", owner: "Identity security", metric: "% privileged access time-bound", controls: ["MFA enforced", "Machine identities inventoried", "Privileged access just-in-time"] },
  { id: "sec-platform", title: "Secure platform configuration", description: "Continuously enforce hardened baselines across cloud, on-premises, endpoints, and AI platforms.", owner: "Infrastructure security", metric: "% assets conforming", controls: ["Baseline as code", "Drift continuously detected", "Exceptions expire automatically"] },
  { id: "sec-network", title: "Network and workload protection", description: "Segment critical services and inspect communication between users, workloads, models, and data.", owner: "Network security", metric: "% critical flows verified", controls: ["Trust zones defined", "East-west traffic protected", "AI endpoints access-controlled"] },
  { id: "sec-vulnerability", title: "Exposure and vulnerability management", description: "Prioritize remediation using exploitability, business criticality, and active exposure.", owner: "Security operations", metric: "Critical exposure age", controls: ["Asset inventory reconciled", "Internet exposure monitored", "Critical findings remediated"] },
  { id: "sec-supply", title: "Software and AI supply chain", description: "Assure software, models, datasets, images, and dependencies before they enter production.", owner: "Product security", metric: "% releases with provenance", controls: ["Artifacts signed", "Dependencies scanned", "Model and dataset provenance recorded"] },
  { id: "sec-detect", title: "Detection and response", description: "Detect and contain malicious behavior across infrastructure and AI-enabled services.", owner: "Security operations", metric: "Mean time to contain", controls: ["Telemetry centrally correlated", "Response playbooks tested", "AI-specific threats monitored"] }
];

const principles = [
  ["01", "Accountability cannot be automated.", "AI may recommend or act, but a named person or body remains answerable for its outcomes."],
  ["02", "Autonomy must be earned.", "Greater autonomy follows demonstrated reliability, effective controls, and an explicit operating boundary."],
  ["03", "People need meaningful agency.", "Those affected by AI decisions should have understandable choices, routes to appeal, and access to human judgment."],
  ["04", "Learning flows both ways.", "AI improves through governed feedback, while people build the literacy needed to challenge and direct it."],
  ["05", "Architecture makes values real.", "Principles only matter when they become observable controls, ownership, workflows, and system boundaries."],
  ["06", "Impact determines oversight.", "The greater the consequence and irreversibility of an action, the stronger the required human oversight."]
];

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey));
    if (!saved) return structuredClone(defaults);
    const savedGuardrailTitles = new Set((saved.guardrails || []).map(item => item.title));
    const addedGuardrails = defaults.guardrails.filter(item => !savedGuardrailTitles.has(item.title));
    return {
      ...defaults,
      ...saved,
      assessment: { ...defaults.assessment, ...saved.assessment },
      guardrails: [...(saved.guardrails || []), ...addedGuardrails],
      controls: saved.controls || {},
      readiness: saved.readiness || {}
    };
  } catch {
    return structuredClone(defaults);
  }
}

function saveState(message) {
  localStorage.setItem(storageKey, JSON.stringify(state));
  updateMetrics();
  if (message) showToast(message);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function navigate(sectionId) {
  document.querySelectorAll(".page-section").forEach(section => section.classList.toggle("active", section.id === sectionId));
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.section === sectionId));
  const titles = {
    overview: "Human + AI Governance",
    assessment: "Impact Assessment",
    accountability: "Accountability Matrix",
    guardrails: "Guardrail Register",
    framework: "Enterprise Architecture Framework",
    resilience: "Digital Resilience",
    security: "Infrastructure Security",
    architecture: "Connected Architecture",
    scenarios: "Scenario Lab",
    decisions: "Decision Records",
    assurance: "Evidence Assurance",
    advisor: "AI EA Advisor",
    principles: "Shared Principles"
  };
  document.querySelector("#page-title").textContent = titles[sectionId];
  history.replaceState(null, "", `#${sectionId}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderFramework() {
  document.querySelector("#domain-strip").innerHTML = eaDomains.map((domain, index) => `
    <article class="domain-chip"><span>${String(index + 1).padStart(2, "0")}</span><strong>${domain.name}</strong></article>
  `).join("");
  document.querySelector("#framework-grid").innerHTML = eaDomains.map((domain, index) => `
    <article class="framework-card">
      <div class="framework-card-top"><span class="framework-card-number">${String(index + 1).padStart(2, "0")}</span><span class="category">EA domain</span></div>
      <h3>${domain.name}</h3>
      <p>${domain.outcome}</p>
      <ul>${domain.capabilities.map(capability => `<li>• ${capability}</li>`).join("")}</ul>
    </article>
  `).join("");
}

function renderCapabilities(containerId, capabilities) {
  document.querySelector(`#${containerId}`).innerHTML = capabilities.map(item => `
    <article class="capability-card">
      <div class="capability-card-top"><span class="category">Capability</span><span class="principle-number">${item.controls.filter((_, index) => state.controls[`${item.id}-${index}`]).length}/${item.controls.length}</span></div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="control-list">
        ${item.controls.map((control, index) => `
          <label class="control-check"><input type="checkbox" data-control-id="${item.id}-${index}" ${state.controls[`${item.id}-${index}`] ? "checked" : ""}> ${control}</label>
        `).join("")}
      </div>
      <div class="capability-meta"><span>Owner: <strong>${item.owner}</strong></span><span>Metric: <strong>${item.metric}</strong></span></div>
    </article>
  `).join("");
}

function updateDomainScores() {
  const scoreFor = capabilities => {
    const keys = capabilities.flatMap(item => item.controls.map((_, index) => `${item.id}-${index}`));
    return Math.round((keys.filter(key => state.controls[key]).length / keys.length) * 100);
  };
  document.querySelector("#resilience-score").textContent = `${scoreFor(resilienceCapabilities)}%`;
  document.querySelector("#security-score").textContent = `${scoreFor(securityCapabilities)}%`;
}

function renderArchitecture(filter = "All", selectedId = "service-decision") {
  const layers = ["Business outcome", "Critical service", "Application", "AI model", "Data product", "Infrastructure", "Supplier"];
  document.querySelector("#architecture-map").innerHTML = `<div class="architecture-chain">${layers.map(layer => `
    <div class="architecture-layer">
      <span class="layer-label">${layer}</span>
      <div class="layer-assets">${state.inventory.filter(item => item.type === layer).map(item => `
        <button class="asset-node ${item.criticality === "Critical" ? "critical" : ""} ${item.id === selectedId ? "active" : ""}" data-asset-id="${item.id}">
          ${escapeHtml(item.name)}<small>${item.criticality}</small>
        </button>`).join("")}</div>
    </div>`).join("")}</div>`;

  const types = ["All", ...new Set(state.inventory.map(item => item.type))];
  document.querySelector("#inventory-filters").innerHTML = types.map(type => `<button class="filter-button ${type === filter ? "active" : ""}" data-inventory-filter="${type}">${type}</button>`).join("");
  const items = filter === "All" ? state.inventory : state.inventory.filter(item => item.type === filter);
  document.querySelector("#inventory-table").innerHTML = `
    <div class="inventory-row header"><span>Asset</span><span>Type</span><span>Owner</span><span>Criticality</span><span>Dependencies</span></div>
    ${items.map(item => `<div class="inventory-row"><strong>${escapeHtml(item.name)}</strong><span>${item.type}</span><span>${item.owner}</span><span class="criticality ${item.criticality.toLowerCase()}">${item.criticality}</span><span>${item.dependsOn.length}</span></div>`).join("")}`;
  renderAssetDetail(selectedId);
}

function renderAssetDetail(assetId) {
  const asset = state.inventory.find(item => item.id === assetId) || state.inventory[0];
  const dependencies = asset.dependsOn.map(id => state.inventory.find(item => item.id === id)?.name).filter(Boolean);
  const dependents = state.inventory.filter(item => item.dependsOn.includes(asset.id)).map(item => item.name);
  document.querySelector("#asset-detail").innerHTML = `
    <span class="category">${asset.type}</span>
    <h3>${escapeHtml(asset.name)}</h3>
    <p>This asset is part of the connected enterprise architecture and should be governed according to its impact and dependencies.</p>
    <div class="detail-list">
      <span>Accountable owner<strong>${escapeHtml(asset.owner)}</strong></span>
      <span>Criticality<strong>${asset.criticality}</strong></span>
      <span>Lifecycle<strong>${asset.lifecycle}</strong></span>
      <span>Depends on<strong>${dependencies.join(", ") || "No recorded dependencies"}</strong></span>
      <span>Supports<strong>${dependents.join(", ") || "No recorded dependents"}</strong></span>
    </div>`;
}

function renderScenarioPicker() {
  const select = document.querySelector("#scenario-select");
  select.innerHTML = ["Technology", "People", "Process"].map(category => `
    <optgroup label="${category}">${scenarios.filter(item => item.category === category).map(item => `<option value="${item.id}">${item.name}</option>`).join("")}</optgroup>`).join("");
  updateScenarioSummary();
  document.querySelector("#scenario-result").innerHTML = `<div class="scenario-empty"><div><strong>Choose a scenario and run the simulation.</strong><br><br>The AI Bridge will trace likely impacts and required responses.</div></div>`;
}

function updateScenarioSummary() {
  const scenario = scenarios.find(item => item.id === document.querySelector("#scenario-select").value) || scenarios[0];
  document.querySelector("#scenario-summary").innerHTML = `<span class="category">${scenario.category} worst case</span><p>${scenario.description}</p><div class="detail-list"><span>Potential impact score<strong>${scenario.score}/100</strong></span><span>Connected assets<strong>${scenario.assets.length}</strong></span></div>`;
}

function runScenario() {
  const scenario = scenarios.find(item => item.id === document.querySelector("#scenario-select").value);
  document.querySelector("#scenario-result").innerHTML = `
    <div class="scenario-impact-head"><div><p class="eyebrow">${scenario.category} worst-case simulation</p><h3>${scenario.name}</h3><p class="panel-note">${scenario.description}</p></div><span class="impact-score">${scenario.score}</span></div>
    <div class="impact-columns">
      <div class="impact-column"><strong>Assets affected</strong><ul>${scenario.assets.map(item => `<li>${item}</li>`).join("")}</ul></div>
      <div class="impact-column"><strong>Business outcomes</strong><ul>${scenario.outcomes.map(item => `<li>${item}</li>`).join("")}</ul></div>
      <div class="impact-column"><strong>Required controls</strong><ul>${scenario.controls.map(item => `<li>${item}</li>`).join("")}</ul></div>
    </div>
    <div class="response-path"><strong>Recommended response path</strong><div class="response-steps">${scenario.response.map((item, index) => `<span>${index + 1}. ${item}</span>`).join("")}</div></div>`;
  showToast("Scenario simulation completed");
}

function renderReadinessLifecycle() {
  const allKeys = [];
  document.querySelector("#lifecycle-grid").innerHTML = readinessLifecycle.map(stage => {
    const stageKeys = stage.items.map((_, index) => `${stage.day}-${index}`);
    allKeys.push(...stageKeys);
    const complete = stageKeys.filter(key => state.readiness[key]).length;
    return `<article class="lifecycle-card">
      <div class="lifecycle-card-top"><span class="day-badge">${stage.day}</span><span class="principle-number">${complete}/${stage.items.length}</span></div>
      <h3>${stage.title}</h3><p>${stage.description}</p>
      <div class="readiness-list">${stage.items.map((item, index) => `<label class="readiness-check"><input type="checkbox" data-readiness-id="${stage.day}-${index}" ${state.readiness[`${stage.day}-${index}`] ? "checked" : ""}> ${item}</label>`).join("")}</div>
      <div class="readiness-progress">${complete === stage.items.length ? "Exit criteria satisfied" : `${stage.items.length - complete} exit criteria remaining`}</div>
    </article>`;
  }).join("");
  const complete = allKeys.filter(key => state.readiness[key]).length;
  const score = Math.round((complete / allKeys.length) * 100);
  document.querySelector("#lifecycle-score").textContent = `${score}%`;
  document.querySelector("#readiness-posture").textContent = score >= 90 ? "Ready to scale responsibly" : score >= 60 ? "Controlled readiness in progress" : score >= 30 ? "Foundation gaps remain" : "Design foundations first";
}

function renderDecisions() {
  document.querySelector("#decision-list").innerHTML = state.decisions.map(item => `
    <article class="decision-card">
      <div class="decision-card-top"><span class="category">${item.id}</span><span class="evidence-state ${item.status === "Approved" ? "current" : ""}">${item.status}</span></div>
      <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.rationale)}</p>
      <div class="decision-meta"><span>Approver: <strong>${escapeHtml(item.owner)}</strong></span><span>AI: <strong>${item.ai}</strong></span><span>Review: <strong>${formatDate(item.review)}</strong></span></div>
    </article>`).join("");
}

function evidenceIsCurrent(item) {
  return item?.reference && item?.expiry && new Date(`${item.expiry}T23:59:59`) >= new Date();
}

function renderAssurance() {
  document.querySelector("#assurance-grid").innerHTML = assuranceItems.map(item => {
    const evidence = state.evidence[item.id] || {};
    const current = evidenceIsCurrent(evidence);
    return `<article class="evidence-card" data-evidence-id="${item.id}">
      <div class="evidence-card-top"><span class="category">Evidence</span><span class="evidence-state ${current ? "current" : ""}">${current ? "Current" : evidence.reference ? "Expired" : "Missing"}</span></div>
      <h3>${item.title}</h3><p>${item.description}</p>
      <div class="evidence-fields">
        <label>Evidence reference<input type="text" data-evidence-field="reference" value="${escapeHtml(evidence.reference || "")}" placeholder="Document, test, or report"></label>
        <label>Expiry date<input type="date" data-evidence-field="expiry" value="${evidence.expiry || ""}"></label>
      </div>
      <div class="guardrail-owner">Accountable: <strong>${item.owner}</strong></div>
    </article>`;
  }).join("");
  updateAssuranceInsights();
}

function renderAdvisor() {
  document.querySelector("#radar-grid").innerHTML = futureSignals.map(item => `
    <article class="radar-card"><div class="radar-card-top"><span class="category">Signal</span><span class="radar-level">${item.level}</span></div>
    <h3>${item.title}</h3><p>${item.detail}</p><div class="radar-meta">${item.domain}</div></article>`).join("");
  generateAdvice();
}

function generateAdvice() {
  const model = adviceModels[document.querySelector("#advisor-focus").value] || adviceModels.autonomy;
  const horizon = document.querySelector("#advisor-horizon").value;
  document.querySelector("#advisor-output").innerHTML = `
    <p class="eyebrow">Recommendation · ${horizon}</p><h3>${model.title}</h3><p>${model.summary}</p>
    <div class="advice-grid">
      <div class="advice-block"><strong>Governance moves</strong><ul>${model.actions.map(item => `<li>${item}</li>`).join("")}</ul></div>
      <div class="advice-block"><strong>Key assumptions</strong><ul>${model.assumptions.map(item => `<li>${item}</li>`).join("")}</ul></div>
      <div class="advice-block"><strong>Evidence required</strong><ul>${model.evidence.map(item => `<li>${item}</li>`).join("")}</ul></div>
    </div>
    <div class="response-path"><strong>Accountable challenge</strong><div class="response-steps"><span>What must remain human?</span><span>What would change this advice?</span><span>Who accepts residual risk?</span></div></div>`;
}

function updateAssuranceInsights() {
  const current = assuranceItems.filter(item => evidenceIsCurrent(state.evidence[item.id])).length;
  const score = Math.round((current / assuranceItems.length) * 100);
  const posture = score >= 80 ? "Evidence-backed confidence" : score >= 50 ? "Partial assurance" : "Evidence gap";
  const detail = `${current} of ${assuranceItems.length} critical evidence records are current.`;
  document.querySelector("#assurance-page-score").textContent = `${score}%`;
  document.querySelector("#assurance-score").textContent = `${score}%`;
  document.querySelector("#assurance-posture").textContent = posture;
  document.querySelector("#assurance-posture-detail").textContent = detail;
  document.querySelector("#executive-signal").textContent = posture;
  document.querySelector("#executive-detail").textContent = detail;
}

function formatDate(value) {
  if (!value) return "Not set";
  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function renderMatrix() {
  const container = document.querySelector("#matrix-rows");
  container.innerHTML = state.matrix.map((item, index) => `
    <div class="matrix-row" data-index="${index}">
      <input type="text" aria-label="Activity" data-field="activity" value="${escapeHtml(item.activity)}">
      <select class="mode-pill" aria-label="Mode" data-field="mode">
        ${["Human-led", "Shared", "AI-led"].map(mode => `<option ${mode === item.mode ? "selected" : ""}>${mode}</option>`).join("")}
      </select>
      <input type="text" aria-label="Human owner" data-field="owner" value="${escapeHtml(item.owner)}">
      <input type="text" aria-label="Control" data-field="control" value="${escapeHtml(item.control)}">
      <button class="delete-button" type="button" aria-label="Delete accountability item">×</button>
    </div>
  `).join("");
}

function renderGuardrails(filter = "all") {
  const items = state.guardrails
    .map((item, index) => ({ ...item, index }))
    .filter(item => filter === "all" || item.status === filter);
  document.querySelector("#guardrail-grid").innerHTML = items.map(item => `
    <article class="guardrail-card" data-index="${item.index}">
      <div class="guardrail-card-top">
        <span class="category">${escapeHtml(item.category)}</span>
        <select class="status-select" aria-label="Guardrail status">
          ${["Open", "In progress", "Implemented"].map(status => `<option ${status === item.status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <div class="guardrail-owner">Accountable: <strong>${escapeHtml(item.owner)}</strong></div>
    </article>
  `).join("");
}

function renderPrinciples() {
  document.querySelector("#principles-grid").innerHTML = principles.map(([number, title, text]) => `
    <article class="principle-card">
      <span class="principle-number">${number}</span>
      <h3>${title}</h3>
      <p>${text}</p>
    </article>
  `).join("");
}

function bindAssessment() {
  const fields = {
    "use-case-name": "name",
    "intended-outcome": "outcome",
    "accountable-owner": "owner",
    stakeholders: "stakeholders"
  };
  Object.entries(fields).forEach(([id, key]) => {
    const element = document.querySelector(`#${id}`);
    element.value = state.assessment[key];
    element.addEventListener("input", () => state.assessment[key] = element.value);
  });

  const ranges = [
    ["impact-level", "impact", "impact-output", ["Minimal", "Limited", "Significant", "Major", "Critical"]],
    ["autonomy-level", "autonomy", "autonomy-output", ["Assists", "Recommends", "Co-decides", "Acts with review", "Acts independently"]],
    ["reversibility-level", "reversibility", "reversibility-output", ["Easy", "Manageable", "Moderate", "Difficult", "Irreversible"]]
  ];
  ranges.forEach(([id, key, outputId, labels]) => {
    const input = document.querySelector(`#${id}`);
    input.value = state.assessment[key];
    const update = () => {
      state.assessment[key] = Number(input.value);
      document.querySelector(`#${outputId}`).textContent = `${input.value} — ${labels[input.value - 1]}`;
      updateRisk();
    };
    input.addEventListener("input", update);
    update();
  });

  document.querySelector("#assessment-form").addEventListener("submit", event => {
    event.preventDefault();
    saveState("Assessment saved");
  });
}

function updateRisk() {
  const { impact, autonomy, reversibility } = state.assessment;
  const score = Math.round(((impact * .4 + autonomy * .3 + reversibility * .3) / 5) * 100);
  const posture = score >= 80 ? "Strict human oversight" : score >= 55 ? "Heightened oversight" : score >= 35 ? "Managed collaboration" : "Standard controls";
  document.querySelector("#risk-score").textContent = score;
  document.querySelector("#risk-posture").textContent = posture;
}

function updateMetrics() {
  const human = state.matrix.filter(item => item.mode === "Human-led").length;
  const ai = state.matrix.filter(item => item.mode === "AI-led" || item.mode === "Shared").length;
  const open = state.guardrails.filter(item => item.status !== "Implemented").length;
  const controlKeys = [...resilienceCapabilities, ...securityCapabilities].flatMap(item => item.controls.map((_, index) => `${item.id}-${index}`));
  const controlMaturity = Math.round((controlKeys.filter(key => state.controls[key]).length / controlKeys.length) * 100);
  const completedFields = Object.values(state.assessment).filter(value => typeof value === "number" || String(value).trim()).length;
  const readiness = Math.min(100, Math.round((completedFields / 7) * 45 + ((state.guardrails.length - open) / state.guardrails.length) * 40 + (state.matrix.length ? 15 : 0)));
  document.querySelector("#human-count").textContent = human;
  document.querySelector("#ai-count").textContent = ai;
  document.querySelector("#control-maturity").textContent = `${controlMaturity}%`;
  document.querySelector("#readiness-score").textContent = `${readiness}%`;
  document.querySelector("#readiness-progress").style.width = `${readiness}%`;
  document.querySelector("#asset-count").textContent = state.inventory.length;
  document.querySelector("#critical-count").textContent = state.inventory.filter(item => item.criticality === "Critical").length;
  document.querySelector("#decision-count").textContent = state.decisions.length;
}

function exportBrief() {
  const { assessment } = state;
  const brief = [
    "THE AI BRIDGE — GOVERNANCE BRIEF",
    `Generated: ${new Date().toLocaleDateString()}`,
    "",
    `USE CASE: ${assessment.name || "Not yet named"}`,
    `INTENDED OUTCOME: ${assessment.outcome || "Not yet defined"}`,
    `ACCOUNTABLE OWNER: ${assessment.owner || "Not yet assigned"}`,
    `AFFECTED STAKEHOLDERS: ${assessment.stakeholders || "Not yet identified"}`,
    `IMPACT / AUTONOMY / REVERSIBILITY: ${assessment.impact} / ${assessment.autonomy} / ${assessment.reversibility}`,
    "",
    "ACCOUNTABILITY MATRIX",
    ...state.matrix.map(item => `- ${item.activity} | ${item.mode} | Owner: ${item.owner} | Control: ${item.control}`),
    "",
    "GUARDRAILS",
    ...state.guardrails.map(item => `- [${item.status}] ${item.title} | Owner: ${item.owner}`),
    "",
    "DIGITAL RESILIENCE & INFRASTRUCTURE SECURITY",
    ...[...resilienceCapabilities, ...securityCapabilities].map(item => `- ${item.title} | Owner: ${item.owner} | Metric: ${item.metric}`),
    "",
    "ARCHITECTURE DECISIONS",
    ...state.decisions.map(item => `- ${item.id}: ${item.title} | ${item.status} | Approver: ${item.owner}`),
    "",
    "ASSURANCE EVIDENCE",
    ...assuranceItems.map(item => `- ${item.title} | ${evidenceIsCurrent(state.evidence[item.id]) ? "Current" : "Attention required"} | Owner: ${item.owner}`),
    "",
    "CORE COMMITMENT",
    "AI can act. Humans remain accountable."
  ].join("\n");
  const blob = new Blob([brief], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "the-ai-bridge-governance-brief.txt";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Governance brief exported");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

document.querySelectorAll("[data-jump]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.jump)));
document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", event => {
  event.preventDefault();
  navigate(link.dataset.section);
}));
document.querySelector("#add-matrix-row").addEventListener("click", () => {
  state.matrix.push({ activity: "New activity or decision", mode: "Shared", owner: "Assign owner", control: "Define control" });
  saveState("Accountability item added");
  renderMatrix();
});
document.querySelector("#matrix-rows").addEventListener("input", event => {
  const row = event.target.closest(".matrix-row");
  if (!row || !event.target.dataset.field) return;
  state.matrix[Number(row.dataset.index)][event.target.dataset.field] = event.target.value;
  saveState();
});
document.querySelector("#matrix-rows").addEventListener("click", event => {
  if (!event.target.matches(".delete-button")) return;
  const row = event.target.closest(".matrix-row");
  state.matrix.splice(Number(row.dataset.index), 1);
  saveState("Accountability item removed");
  renderMatrix();
});
document.querySelector("#guardrail-grid").addEventListener("change", event => {
  if (!event.target.matches(".status-select")) return;
  const card = event.target.closest(".guardrail-card");
  state.guardrails[Number(card.dataset.index)].status = event.target.value;
  saveState("Guardrail status updated");
});
document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".filter-button").forEach(item => item.classList.toggle("active", item === button));
  renderGuardrails(button.dataset.filter);
}));
document.querySelector("#export-button").addEventListener("click", exportBrief);
document.querySelector("#architecture-map").addEventListener("click", event => {
  const node = event.target.closest("[data-asset-id]");
  if (!node) return;
  renderArchitecture("All", node.dataset.assetId);
});
document.querySelector("#inventory-filters").addEventListener("click", event => {
  const button = event.target.closest("[data-inventory-filter]");
  if (!button) return;
  renderArchitecture(button.dataset.inventoryFilter);
});
document.querySelector("#scenario-select").addEventListener("change", updateScenarioSummary);
document.querySelector("#run-scenario").addEventListener("click", runScenario);
document.querySelector("#lifecycle-grid").addEventListener("change", event => {
  if (!event.target.matches("[data-readiness-id]")) return;
  state.readiness[event.target.dataset.readinessId] = event.target.checked;
  saveState("Technology readiness updated");
  renderReadinessLifecycle();
});
document.querySelector("#decision-form").addEventListener("submit", event => {
  event.preventDefault();
  state.decisions.unshift({
    id: `ADR-${String(state.decisions.length + 1).padStart(3, "0")}`,
    title: document.querySelector("#decision-title").value,
    rationale: document.querySelector("#decision-rationale").value,
    owner: document.querySelector("#decision-owner").value,
    review: document.querySelector("#decision-review").value,
    status: document.querySelector("#decision-status").value,
    ai: document.querySelector("#decision-ai").value
  });
  event.target.reset();
  saveState("Architecture decision recorded");
  renderDecisions();
});
document.querySelector("#assurance-grid").addEventListener("change", event => {
  if (!event.target.matches("[data-evidence-field]")) return;
  const card = event.target.closest("[data-evidence-id]");
  state.evidence[card.dataset.evidenceId] = state.evidence[card.dataset.evidenceId] || {};
  state.evidence[card.dataset.evidenceId][event.target.dataset.evidenceField] = event.target.value;
  saveState("Assurance evidence updated");
  renderAssurance();
});
document.querySelector("#generate-advice").addEventListener("click", generateAdvice);
document.querySelectorAll(".capability-grid").forEach(grid => grid.addEventListener("change", event => {
  if (!event.target.matches("[data-control-id]")) return;
  state.controls[event.target.dataset.controlId] = event.target.checked;
  saveState("Control evidence updated");
  renderCapabilities("resilience-grid", resilienceCapabilities);
  renderCapabilities("security-grid", securityCapabilities);
  updateDomainScores();
}));

renderMatrix();
renderGuardrails();
renderPrinciples();
renderFramework();
renderCapabilities("resilience-grid", resilienceCapabilities);
renderCapabilities("security-grid", securityCapabilities);
renderArchitecture();
renderScenarioPicker();
renderReadinessLifecycle();
renderDecisions();
renderAssurance();
renderAdvisor();
bindAssessment();
updateMetrics();
updateDomainScores();
navigate(location.hash.slice(1) || "overview");
