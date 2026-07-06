// DealPilot AI - UI Controller Module
import { 
  currentParams, 
  currentProviders, 
  currentTimelineData, 
  currentEmails 
} from './dataGenerator.js';
import { initChart, highlightChartPoint } from './chartManager.js';

// DOM Selectors
export const formProduct = document.getElementById("prod-name");
export const formLocation = document.getElementById("prod-loc");
export const formBudget = document.getElementById("prod-budget");
export const formCard = document.getElementById("prod-card");
export const formUrgency = document.getElementById("prod-urgency");
export const runButton = document.getElementById("run-dealpilot");
export const terminalConsole = document.getElementById("terminal-console");
export const commsHub = document.getElementById("comms-hub");
export const mcpBrowser = document.getElementById("mcp-browser");
export const mcpGmail = document.getElementById("mcp-gmail");
export const mcpCalendar = document.getElementById("mcp-calendar");
export const mcpFs = document.getElementById("mcp-fs");
export const dealsTableBody = document.getElementById("deals-table-body");
export const emailThreadContainer = document.getElementById("email-thread-container");
export const timelineSlider = document.getElementById("timeline-slider");
export const timelineLabel = document.getElementById("timeline-label");
export const timelineLog = document.getElementById("timeline-log");
export const valBudget = document.getElementById("val-budget");
export const valBestDeal = document.getElementById("val-best-deal");
export const valStrat = document.getElementById("val-strat");
export const pipelineProgress = document.getElementById("pipeline-progress");

export const agentNodes = {
  req: document.getElementById("agent-req"),
  research: document.getElementById("agent-research"),
  trust: document.getElementById("agent-trust"),
  strat: document.getElementById("agent-strat"),
  comm: document.getElementById("agent-comm"),
  monitor: document.getElementById("agent-monitor")
};

export function logTerminal(message, type = "info") {
  if (terminalConsole.querySelector(".empty-state")) {
    terminalConsole.innerHTML = "";
  }
  
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const line = document.createElement("div");
  line.className = "terminal-line";
  
  let typeClass = "term-info";
  if (type === "success") typeClass = "term-success";
  if (type === "warn") typeClass = "term-warn";
  if (type === "error") typeClass = "term-error";
  if (type === "mcp") typeClass = "term-mcp";
  
  line.innerHTML = `<span class="term-timestamp">[${timestamp}]</span> <span class="${typeClass}">${message}</span>`;
  terminalConsole.appendChild(line);
  terminalConsole.scrollTop = terminalConsole.scrollHeight;
}

export function sendCommBubble(from, to, text, type) {
  if (commsHub.querySelector(".empty-state")) {
    commsHub.innerHTML = "";
  }
  
  const bubble = document.createElement("div");
  bubble.className = `comm-bubble`;
  bubble.style.background = `rgba(${type === 'req' ? '0,240,255' : type === 'research' ? '168,85,247' : type === 'trust' ? '0,255,135' : type === 'strat' ? '255,153,0' : type === 'comm' ? '59,130,246' : '236,72,153'}, 0.06)`;
  bubble.style.borderLeft = `3px solid var(--accent-${type === 'req' ? 'cyan' : type === 'research' ? 'purple' : type === 'trust' ? 'green' : type === 'strat' ? 'orange' : type === 'comm' ? 'blue' : 'pink'})`;
  
  bubble.innerHTML = `
    <div class="comm-sender">
      <span style="color:var(--accent-${type === 'req' ? 'cyan' : type === 'research' ? 'purple' : type === 'trust' ? 'green' : type === 'strat' ? 'orange' : type === 'comm' ? 'blue' : 'pink'})">${from}</span>
      <span class="comm-to">➔ ${to}</span>
    </div>
    <div class="comm-text">${text}</div>
  `;
  
  commsHub.appendChild(bubble);
  commsHub.scrollTop = commsHub.scrollHeight;
}

export function toggleMcpNode(node, active) {
  if (active) {
    node.classList.add("active");
  } else {
    node.classList.remove("active");
  }
}

export function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  const targetBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.innerHTML.includes(tabId === 'email-tab' ? 'Email' : 'Agent'));
  if (targetBtn) targetBtn.classList.add('active');
  
  const content = document.getElementById(tabId);
  if (content) content.classList.add('active');
}

export function displayEmailNegotiations(emails) {
  emailThreadContainer.innerHTML = "";
  const thread = document.createElement("div");
  thread.className = "email-thread";
  
  emails.forEach(email => {
    const msg = document.createElement("div");
    msg.className = `email-msg email-msg-${email.type}`;
    
    msg.innerHTML = `
      <div class="email-header">
        <span><strong>From:</strong> ${email.sender}</span>
        <span>${email.time}</span>
      </div>
      <div class="email-header" style="border:none; padding:0; margin-top:-0.25rem;">
        <span><strong>To:</strong> ${email.recipient}</span>
      </div>
      <div class="email-header" style="border:none; padding:0; margin-top:-0.25rem; font-weight:700;">
        <span>Subject: ${email.subject}</span>
      </div>
      <div class="email-body">${email.body}</div>
      ${email.actionable ? `
        <div class="email-actions">
          <button class="btn-sm-primary" id="btn-accept-quote" onclick="acceptQuote('${email.sender}')">${email.actionText}</button>
        </div>
      ` : ''}
    `;
    thread.appendChild(msg);
  });
  
  emailThreadContainer.appendChild(thread);
}

export function updateDealsTable(day) {
  const currentPrices = currentTimelineData[day] || currentTimelineData[0];
  dealsTableBody.innerHTML = "";
  
  const listings = currentProviders.map(p => {
    let price = currentPrices[p.id] || p.base;
    return { ...p, currentPrice: price };
  });
  
  if (day >= 2) {
    const isIphone = currentParams.product.toLowerCase().includes("iphone");
    const isLaptop = currentParams.product.toLowerCase().includes("laptop") || currentParams.product.toLowerCase().includes("rog") || currentParams.product.toLowerCase().includes("zephyrus");
    const isHeadphones = currentParams.product.toLowerCase().includes("headphones") || currentParams.product.toLowerCase().includes("sony") || currentParams.product.toLowerCase().includes("xm");

    if (isIphone) {
      listings.push({
        id: "croma-local",
        name: "Croma Retail (Local Match)",
        currentPrice: 109999,
        trust: "9.9/10",
        tag: "In-Store Match + Charger",
        highlight: true
      });
    } else if (isLaptop) {
      listings.push({
        id: "laptopworld-local",
        name: "Laptop World (Local RFQ)",
        currentPrice: day >= 4 ? 87999 : 91999,
        trust: "9.8/10",
        tag: day >= 4 ? "ICICI Offer + Mouse" : "Free Gaming Mouse",
        highlight: true
      });
    } else if (isHeadphones) {
      listings.push({
        id: "sony-local",
        name: "Sony Center (Indiranagar)",
        currentPrice: day >= 12 ? 20999 : 23499,
        trust: "9.9/10",
        tag: day >= 12 ? "Exchange Applied" : "Sony Center Match",
        highlight: true
      });
    } else {
      const middleDay = Math.round(currentParams.urgency / 2);
      const replyPrice = Math.round(currentParams.budget * 1.02);
      const finalPrice = Math.round(currentParams.budget * 0.97);
      listings.push({
        id: "custom-local",
        name: `${currentParams.location} Digital Hub (Local RFQ)`,
        currentPrice: day >= middleDay ? finalPrice : replyPrice,
        trust: "9.8/10",
        tag: day >= middleDay ? "Best Bid Price" : "Free Accessory Pack",
        highlight: true
      });
    }
  }
  
  listings.sort((a, b) => a.currentPrice - b.currentPrice);
  
  const bestPrice = listings[0].currentPrice;
  valBestDeal.innerText = "₹" + bestPrice.toLocaleString();
  
  const budgetMet = bestPrice <= currentParams.budget;
  if (budgetMet) {
    valStrat.innerText = "BUY NOW - Budget Met!";
    valStrat.style.color = "var(--accent-green)";
  } else {
    valStrat.innerText = "Watch... Wait for drops";
    valStrat.style.color = "var(--accent-orange)";
  }
  
  listings.forEach((p, idx) => {
    const tr = document.createElement("tr");
    if (idx === 0) tr.className = "highlight";
    
    const isBudgetMet = p.currentPrice <= currentParams.budget;
    const badgeClass = isBudgetMet ? "badge-green" : "badge-orange";
    const badgeText = isBudgetMet ? "Budget Met" : "Above Budget";
    
    tr.innerHTML = `
      <td>
        <div class="store-name">
          <span style="color:${idx === 0 ? 'var(--accent-green)' : 'var(--text-primary)'}">${p.name}</span>
          ${p.highlight ? `<span class="badge badge-green">RFQ Match</span>` : ''}
        </div>
      </td>
      <td>₹${p.currentPrice.toLocaleString()}</td>
      <td>${p.tag || 'Standard Vendor'}</td>
      <td><span class="badge ${badgeClass}">${badgeText}</span></td>
      <td><span style="color:var(--text-secondary)">${p.trust}</span></td>
    `;
    dealsTableBody.appendChild(tr);
  });
}

export function updateTimelineDay(day) {
  timelineLabel.innerText = `Day ${day}`;
  timelineLog.innerHTML = "";
  let eventFound = false;
  
  Object.keys(currentTimelineData).forEach(d => {
    const intD = parseInt(d);
    if (intD <= day) {
      const events = currentTimelineData[d].events || [];
      events.forEach(ev => {
        eventFound = true;
        const evDiv = document.createElement("div");
        evDiv.className = "timeline-event";
        evDiv.innerHTML = `
          <div>
            <span class="timeline-event-title" style="font-weight:700;">${ev.title}</span>
            <span style="color:var(--text-secondary); margin-left: 0.5rem; font-size:0.7rem;">${ev.desc}</span>
          </div>
          <span class="timeline-event-day" style="font-size:0.65rem;">Day ${intD}</span>
        `;
        timelineLog.appendChild(evDiv);
      });
    }
  });
  
  if (!eventFound) {
    timelineLog.innerHTML = `<div class="empty-state" style="padding:0; justify-content:center;"><span style="font-size:0.7rem; color:var(--text-muted);">Waiting for timeline events... Drag slider further.</span></div>`;
  } else {
    timelineLog.scrollTop = timelineLog.scrollHeight;
  }
  
  updateDealsTable(day);
  
  const isIphone = currentParams.product.toLowerCase().includes("iphone");
  const isLaptop = currentParams.product.toLowerCase().includes("laptop") || currentParams.product.toLowerCase().includes("rog") || currentParams.product.toLowerCase().includes("zephyrus");
  const isHeadphones = currentParams.product.toLowerCase().includes("headphones") || currentParams.product.toLowerCase().includes("sony") || currentParams.product.toLowerCase().includes("xm");

  if (isIphone) {
    if (day === 2) logTerminal("Monitoring Alert: Incoming email response detected from Croma Retail Store.", "warn");
    if (day === 4) logTerminal("Monitoring Alert: Reliance Digital price drop tracked. Flash Sale started! Price dropped to ₹1,09,999.", "warn");
    if (day === 6) {
      logTerminal("Monitoring Alert: New HDFC bank promotional credit card offer verified. Extra ₹6,000 savings added.", "success");
      logTerminal("Final pricing reaches ₹1,03,999! Budget target of ₹1,10,000 unlocked.", "success");
    }
  } else if (isLaptop) {
    if (day === 2) logTerminal("Monitoring Alert: Quotation reply received from Laptop World local shop. Price matched to ₹91,999 + Free Mouse.", "warn");
    if (day === 4) logTerminal("Monitoring Alert: ICICI Card promotion triggered. Savings of ₹4,000 applied to Laptop World quote. Final effective: ₹87,999.", "success");
  } else if (isHeadphones) {
    if (day === 3) logTerminal("Monitoring Alert: Detected live ₹1,500 coupon code on Amazon listing page.", "info");
    if (day === 6) logTerminal("Monitoring Alert: Sony Center Indiranagar responds with match of ₹23,499.", "info");
    if (day === 12) logTerminal("Monitoring Alert: Trade-in trade-up validation confirmed. Old headphones exchange credit of ₹2,500 applied. Final: ₹20,999.", "success");
  } else {
    const middleDay = Math.round(currentParams.urgency / 2);
    const triggerDay = Math.round(currentParams.urgency * 0.7);
    
    if (day === 2) {
      logTerminal(`Monitoring Alert: Incoming RFQ email response detected from ${currentParams.location} Digital Hub.`, "warn");
    }
    if (day === middleDay) {
      logTerminal(`Monitoring Alert: Flash Sale started! Price of ${currentParams.product} dropped to ₹${Math.round(currentParams.budget * 0.99).toLocaleString()}.`, "success");
    }
    if (day === triggerDay) {
      logTerminal(`Monitoring Alert: Promotion verified. Savings applied. Final effective price: ₹${Math.round(currentParams.budget * 0.94).toLocaleString()}.`, "success");
    }
  }
  
  try {
    highlightChartPoint(day);
  } catch (e) {
    console.warn("Chart highlighting bypassed:", e);
  }
}

export function resetUI() {
  terminalConsole.innerHTML = `<div class="empty-state"><i class="fas fa-terminal"></i><span>Ready. Choose a template or modify criteria, then click "Run DealPilot" to start the multi-agent search.</span></div>`;
  commsHub.innerHTML = `<div class="empty-state"><i class="fas fa-comments"></i><span>Communications offline. Agents communicate here during execution.</span></div>`;
  emailThreadContainer.innerHTML = `<div class="empty-state"><i class="fas fa-envelope-open-text"></i><span>No active email negotiations yet.</span></div>`;
  timelineLog.innerHTML = `<div class="empty-state" style="padding:0; justify-content:center;"><span style="font-size:0.7rem; color:var(--text-muted);">Tracker Offline. Run simulator to watch timeline drops.</span></div>`;
  dealsTableBody.innerHTML = `<tr><td colspan="5" class="empty-state"><i class="fas fa-search-dollar"></i><span>No search results loaded.</span></td></tr>`;
  
  Object.keys(agentNodes).forEach(key => {
    agentNodes[key].className = `pipeline-node pipeline-${key} idle`;
  });
  
  document.querySelectorAll(".mcp-node-pill").forEach(c => c.classList.remove("active"));
  
  valBudget.innerText = "₹" + currentParams.budget.toLocaleString();
  valBestDeal.innerText = "₹" + (currentProviders[0] ? currentProviders[0].base.toLocaleString() : "0");
  valStrat.innerText = "Standby";
  pipelineProgress.style.width = "0%";
  
  timelineSlider.disabled = true;
  runButton.disabled = false;
  
  try {
    initChart();
  } catch (e) {
    console.warn("Chart initialization bypassed:", e);
  }
  switchTab('email-tab');
}

export function resetUIStateOnly() {
  terminalConsole.innerHTML = `<div class="empty-state"><i class="fas fa-terminal"></i><span>Searching...</span></div>`;
  commsHub.innerHTML = `<div class="empty-state"><i class="fas fa-comments"></i><span>Offline. Run search to intercept dialogue.</span></div>`;
  emailThreadContainer.innerHTML = `<div class="empty-state"><i class="fas fa-envelope-open-text"></i><span>No active email negotiations yet.</span></div>`;
  timelineLog.innerHTML = `<div class="empty-state" style="padding:0; justify-content:center;"><span style="font-size:0.7rem; color:var(--text-muted);">Tracker Offline.</span></div>`;
  dealsTableBody.innerHTML = `<tr><td colspan="5" class="empty-state"><i class="fas fa-search-dollar"></i><span>Searching...</span></td></tr>`;
  
  Object.keys(agentNodes).forEach(key => {
    agentNodes[key].className = `pipeline-node pipeline-${key} idle`;
  });
  
  document.querySelectorAll(".mcp-node-pill").forEach(c => c.classList.remove("active"));
  
  valBudget.innerText = "₹" + currentParams.budget.toLocaleString();
  valBestDeal.innerText = "Scanning...";
  valStrat.innerText = "Running Agents...";
  pipelineProgress.style.width = "0%";
  
  timelineSlider.disabled = true;
  try {
    initChart();
  } catch (e) {
    console.warn("Chart initialization bypassed:", e);
  }
  switchTab('log-tab');
}
