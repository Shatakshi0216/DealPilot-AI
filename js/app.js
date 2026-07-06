// DealPilot AI - Main Coordinator & State Machine
import { 
  currentParams, 
  currentProviders, 
  currentTimelineData, 
  currentEmails,
  loadTemplateData,
  generateDynamicData
} from './dataGenerator.js';

import { initChart } from './chartManager.js';

import {
  formProduct,
  formLocation,
  formBudget,
  formCard,
  formUrgency,
  runButton,
  timelineSlider,
  pipelineProgress,
  valStrat,
  valBestDeal,
  agentNodes,
  mcpBrowser,
  mcpGmail,
  mcpCalendar,
  mcpFs,
  logTerminal,
  sendCommBubble,
  toggleMcpNode,
  switchTab,
  displayEmailNegotiations,
  updateDealsTable,
  updateTimelineDay,
  resetUI,
  resetUIStateOnly
} from './uiController.js';

let activeStage = 0;
let simulationRunning = false;

// Initialize
function init() {
  selectTemplate("iphone");
  setupEventListeners();
}

function setupEventListeners() {
  document.querySelectorAll(".template-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".template-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const tempId = card.getAttribute("data-template");
      selectTemplate(tempId);
    });
  });

  runButton.addEventListener("click", startSimulation);

  timelineSlider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    updateTimelineDay(val);
  });
}

function selectTemplate(tempId) {
  loadTemplateData(tempId);
  resetUI();
}

function startSimulation() {
  if (simulationRunning) return;
  
  const prod = formProduct.value.trim() || "iPhone 17 Pro";
  const loc = formLocation.value.trim() || "Mumbai";
  const budgetVal = parseInt(formBudget.value) || 110000;
  const cardVal = formCard.value.trim() || "None";
  const urgencyVal = parseInt(formUrgency.value) || 10;

  generateDynamicData(prod, loc, budgetVal, cardVal, urgencyVal);

  resetUIStateOnly();
  simulationRunning = true;
  runButton.disabled = true;
  
  if (window.innerWidth <= 1024) {
    document.querySelector(".main-content").scrollIntoView({ behavior: "smooth" });
  }
  
  setTimeout(() => {
    executeRequirementStage();
  }, 500);
}

function executeRequirementStage() {
  activeStage = 1;
  const temp = currentParams;
  
  agentNodes.req.className = "pipeline-node pipeline-req active";
  pipelineProgress.style.width = "8.3%";
  valStrat.innerText = "Analyzing Query";
  
  logTerminal("Requirement Agent initiated...", "info");
  logTerminal(`Extracting parameters: product="${temp.product}", location="${temp.location}", budget="₹${temp.budget.toLocaleString()}", card="${temp.card}"`, "success");
  
  sendCommBubble(
    "Requirement Agent", 
    "Market Research Agent", 
    `User wants ${temp.product} in ${temp.location}. Budget cap is ₹${temp.budget.toLocaleString()}. Card is ${temp.card}. Requesting store scan and credit-card schemes.`, 
    "req"
  );
  
  setTimeout(() => {
    agentNodes.req.className = "pipeline-node pipeline-req done";
    executeResearchStage();
  }, 2000);
}

function executeResearchStage() {
  activeStage = 2;
  const temp = currentParams;
  agentNodes.research.className = "pipeline-node pipeline-research active";
  pipelineProgress.style.width = "25%";
  valStrat.innerText = "Scanning Stores";
  toggleMcpNode(mcpBrowser, true);
  
  logTerminal(`Market Research Agent crawling online stores for ${temp.product} via Browser MCP...`, "info");
  logTerminal("MCP: browser.search_products() invoked for Amazon, Flipkart, Croma, Reliance Digital.", "mcp");
  
  setTimeout(() => {
    logTerminal("Online crawler completed. Initial offers located:", "success");
    currentProviders.forEach(p => {
      logTerminal(`- ${p.name}: Base price ₹${p.base.toLocaleString()}`, "info");
    });
    
    sendCommBubble(
      "Market Research Agent",
      "Trust Agent",
      `Found 4 listings for ${temp.product}. Forwarding base prices and merchant credentials for scam/trust vetting.`,
      "research"
    );
    
    setTimeout(() => {
      agentNodes.research.className = "pipeline-node pipeline-research done";
      toggleMcpNode(mcpBrowser, false);
      executeTrustStage();
    }, 1500);
  }, 2000);
}

function executeTrustStage() {
  activeStage = 3;
  const temp = currentParams;
  agentNodes.trust.className = "pipeline-node pipeline-trust active";
  pipelineProgress.style.width = "41.6%";
  valStrat.innerText = "Vetting Sellers";
  
  logTerminal("Trust Agent evaluating merchant authenticity & feedback ratings...", "info");
  
  setTimeout(() => {
    logTerminal("Merchant reputation scan finished:", "success");
    logTerminal(`- Amazon: Verified Trusted`, "info");
    logTerminal(`- Flipkart: Verified Trusted`, "info");
    logTerminal(`- Reliance Digital Store: Verified Trusted`, "info");
    logTerminal(`- Croma Retail Store: Verified Trusted`, "info");
    logTerminal(`- Screened and rejected 2 suspicious retail links without SSL certs.`, "warn");
    
    sendCommBubble(
      "Trust Agent",
      "Negotiation Strategy Agent",
      `4 merchant channels cleared of scam risk. Safe to plan purchase routes for ${temp.product}.`,
      "trust"
    );
    
    setTimeout(() => {
      agentNodes.trust.className = "pipeline-node pipeline-trust done";
      executeStrategyStage();
    }, 1500);
  }, 2000);
}

function executeStrategyStage() {
  activeStage = 4;
  const temp = currentParams;
  agentNodes.strat.className = "pipeline-node pipeline-strat active";
  pipelineProgress.style.width = "58.3%";
  valStrat.innerText = "Formulating Plan";
  
  logTerminal("Negotiation Strategy Agent analyzing optimization strategies...", "info");
  
  setTimeout(() => {
    logTerminal("Strategy determined:", "success");
    if (temp.card && temp.card !== "None") {
      logTerminal(`- Promo schemes: ${temp.card} instant discount identified.`, "info");
    }
    logTerminal(`- RFQ Competition: Initiate multi-seller competition among local authorized brick-and-mortar dealers in ${temp.location} to beat online rates.`, "warn");
    
    sendCommBubble(
      "Negotiation Strategy Agent",
      "Communication Agent",
      `Draft negotiation email requesting competitive quotes from local retail managers in ${temp.location} for ${temp.product}.`,
      "strat"
    );
    
    setTimeout(() => {
      agentNodes.strat.className = "pipeline-node pipeline-strat done";
      executeCommunicationStage();
    }, 1500);
  }, 2000);
}

function executeCommunicationStage() {
  activeStage = 5;
  const temp = currentParams;
  agentNodes.comm.className = "pipeline-node pipeline-comm active";
  pipelineProgress.style.width = "75%";
  valStrat.innerText = "Dispatching RFQs";
  toggleMcpNode(mcpGmail, true);
  toggleMcpNode(mcpFs, true);
  
  logTerminal(`Communication Agent drafting RFQ competition letters for ${temp.product} via Gmail MCP...`, "info");
  logTerminal(`MCP: gmail.create_draft() generated for local authorized retail accounts in ${temp.location}.`, "mcp");
  logTerminal("MCP: filesystem.write_file() saved comparison and RFQ details in local workspace.", "mcp");
  
  setTimeout(() => {
    logTerminal(`RFQs sent successfully via Gmail MCP to local dealers in ${temp.location}. Waiting for quotes...`, "success");
    
    displayEmailNegotiations(currentEmails);
    
    // Switch tab to Emails
    switchTab('email-tab');
    
    sendCommBubble(
      "Communication Agent",
      "Monitoring Agent",
      `Emails dispatched to local dealers. Track online prices and watch for incoming replies.`,
      "comm"
    );
    
    setTimeout(() => {
      agentNodes.comm.className = "pipeline-node pipeline-comm done";
      toggleMcpNode(mcpGmail, false);
      toggleMcpNode(mcpFs, false);
      executeMonitoringStage();
    }, 1500);
  }, 2000);
}

function executeMonitoringStage() {
  activeStage = 6;
  const temp = currentParams;
  agentNodes.monitor.className = "pipeline-node pipeline-monitor active";
  pipelineProgress.style.width = "100%";
  valStrat.innerText = "Price Watch Active";
  toggleMcpNode(mcpCalendar, true);
  
  logTerminal("Monitoring Agent initializing continuous price tracker...", "info");
  logTerminal(`MCP: calendar.create_event() added daily price checks & sale monitoring deadlines.`, "mcp");
  
  setTimeout(() => {
    logTerminal(`Continuous Monitoring Online. Price-watch timeline activated.`, "success");
    
    timelineSlider.disabled = false;
    simulationRunning = false;
    
    updateDealsTable(0);
    
    timelineLog.innerHTML = `<div class="timeline-event"><span class="timeline-event-title">DealPilot Tracking Active</span><span class="timeline-event-day">Day 0</span></div>`;
    
    logTerminal(`DealPilot AI Setup Complete. Drag the timeline slider to simulate the passage of time (${temp.urgency} days) and see negotiation replies & price drops!`, "success");
    
    const alertDiv = document.createElement("div");
    alertDiv.style.background = "rgba(0, 240, 255, 0.1)";
    alertDiv.style.border = "1px solid var(--accent-cyan)";
    alertDiv.style.padding = "0.5rem 0.75rem";
    alertDiv.style.borderRadius = "6px";
    alertDiv.style.marginTop = "0.5rem";
    alertDiv.style.fontSize = "0.75rem";
    alertDiv.innerHTML = `<strong>💡 Demo Step:</strong> Drag the "Continuous Watch Simulator" slider at the bottom to watch the price drops and dealer quotes apply over the next ${temp.urgency} days.`;
    
    if (terminalConsole.querySelector(".empty-state")) {
      terminalConsole.innerHTML = "";
    }
    terminalConsole.appendChild(alertDiv);
    terminalConsole.scrollTop = terminalConsole.scrollHeight;
    
  }, 1500);
}

// Global Exports to Window to support HTML inline events
window.resetUI = resetUI;
window.switchTab = switchTab;
window.selectTemplate = selectTemplate;

window.acceptQuote = function(sender) {
  logTerminal(`User approved quote from ${sender}!`, "success");
  logTerminal("MCP: gmail.send_message() sent acceptance confirmation. Transaction registered.", "mcp");
  logTerminal("MCP: calendar.create_event() added pickup reservation details.", "mcp");
  
  alert(`Deal Locked In! DealPilot has booked your pickup/order with ${sender}. Check your simulated Gmail and Calendar for pickup vouchers.`);
};

// Bootstrap
window.addEventListener("DOMContentLoaded", init);
