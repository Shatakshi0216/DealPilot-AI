// DealPilot AI - Algorithmic Simulation Data Generator
import { templates } from './config.js';

// Export state variables (read-only by external modules, but can be updated here)
export let currentParams = {
  product: "",
  location: "",
  budget: 0,
  card: "",
  urgency: 10
};
export let currentProviders = [];
export let currentTimelineData = {};
export let currentEmails = [];

export function loadTemplateData(tempId) {
  const temp = templates[tempId];
  if (!temp) return;
  
  currentParams = {
    product: temp.product,
    location: temp.location,
    budget: parseInt(temp.budget),
    card: temp.card,
    urgency: parseInt(temp.urgency)
  };
  
  // Algorithmic default base prices
  const baseAmazon = Math.round(currentParams.budget * 1.08);
  const baseFlipkart = Math.round(currentParams.budget * 1.06);
  const baseReliance = Math.round(currentParams.budget * 1.04);
  const baseCroma = Math.round(currentParams.budget * 1.05);

  currentProviders = [
    { id: "amazon", name: "Amazon India", base: baseAmazon, discount: 0, cardOffer: 0, trust: "9.7/10", tag: "Trusted" },
    { id: "flipkart", name: "Flipkart", base: baseFlipkart, discount: 0, cardOffer: 0, trust: "9.5/10", tag: "Trusted" },
    { id: "reliance", name: "Reliance Digital", base: baseReliance, discount: 0, cardOffer: 0, trust: "9.4/10", tag: "Official Store" },
    { id: "croma", name: "Croma", base: baseCroma, discount: 0, cardOffer: 0, trust: "9.4/10", tag: "Official Store" }
  ];
}

export function generateDynamicData(product, location, budget, card, urgency) {
  currentParams = { product, location, budget, card, urgency };
  
  const baseAmazon = Math.round(budget * 1.08);
  const baseFlipkart = Math.round(budget * 1.06);
  const baseReliance = Math.round(budget * 1.04);
  const baseCroma = Math.round(budget * 1.05);

  currentProviders = [
    { id: "amazon", name: "Amazon India", base: baseAmazon, discount: 0, cardOffer: 0, trust: "9.7/10", tag: "Trusted" },
    { id: "flipkart", name: "Flipkart", base: baseFlipkart, discount: 0, cardOffer: 0, trust: "9.5/10", tag: "Trusted" },
    { id: "reliance", name: "Reliance Digital", base: baseReliance, discount: 0, cardOffer: 0, trust: "9.4/10", tag: "Official Store" },
    { id: "croma", name: "Croma", base: baseCroma, discount: 0, cardOffer: 0, trust: "9.4/10", tag: "Official Store" }
  ];

  currentTimelineData = {};
  const middleDay = Math.round(urgency * 0.4);
  const triggerDay = Math.round(urgency * 0.7);
  const endDay = urgency;

  const hasCard = card && card.toLowerCase() !== "none" && card.trim() !== "";

  for (let d = 0; d <= urgency; d++) {
    let reliancePrice = baseReliance;
    let cromaPrice = baseCroma;
    let amazonPrice = baseAmazon;
    let flipkartPrice = baseFlipkart;
    let events = [];

    if (d >= middleDay) {
      reliancePrice = Math.round(budget * 0.99);
      if (d === middleDay) {
        events.push({
          title: "Flash Sale Started",
          desc: `${product} price dropped on Reliance Digital to ₹${reliancePrice.toLocaleString()}`
        });
      }
    }

    if (d >= triggerDay) {
      if (hasCard) {
        const cardDiscount = Math.round(budget * 0.05);
        reliancePrice = reliancePrice - cardDiscount;
        if (d === triggerDay) {
          events.push({
            title: `${card} Offer Applied`,
            desc: `Extra ₹${cardDiscount.toLocaleString()} instant discount added. Price drops to ₹${reliancePrice.toLocaleString()}`
          });
        }
      } else {
        const promoDiscount = Math.round(budget * 0.03);
        reliancePrice = reliancePrice - promoDiscount;
        if (d === triggerDay) {
          events.push({
            title: "Store Coupon Applied",
            desc: `Extra ₹${promoDiscount.toLocaleString()} store coupon applied. Price drops to ₹${reliancePrice.toLocaleString()}`
          });
        }
      }
    }

    if (d === endDay) {
      events.push({
        title: "Optimal Buy Window",
        desc: `Recommended buy: Reliance Digital for ₹${reliancePrice.toLocaleString()} (Saved ₹${(baseReliance - reliancePrice).toLocaleString()})`
      });
    }

    currentTimelineData[d] = {
      reliance: reliancePrice,
      croma: cromaPrice,
      amazon: amazonPrice,
      flipkart: flipkartPrice,
      events: events
    };
  }

  let accessoryBundle = "premium accessory pack and store voucher";
  const prodLower = product.toLowerCase();
  if (prodLower.includes("iphone") || prodLower.includes("phone") || prodLower.includes("pixel") || prodLower.includes("galaxy")) {
    accessoryBundle = "free Apple 20W Power Adapter (worth ₹1,900) and extended 6-month store warranty";
  } else if (prodLower.includes("laptop") || prodLower.includes("rog") || prodLower.includes("zephyrus") || prodLower.includes("macbook")) {
    accessoryBundle = "free ASUS ROG Impact Gaming Mouse (worth ₹3,499) and keyboard sleeve protective bundle";
  } else if (prodLower.includes("headphones") || prodLower.includes("sony") || prodLower.includes("xm")) {
    accessoryBundle = "free premium hard-shell carrying case and auxiliary audio extension cables";
  }

  const replyPrice = Math.round(budget * 1.02);
  const finalPrice = Math.round(budget * 0.97);

  const cardText = hasCard ? `I have a ${card}.` : "I am looking for the best cash or card outright purchase price.";
  const emailCardTerms = hasCard ? `using your ${card}` : "for outright purchase";

  currentEmails = [
    {
      id: 1,
      sender: "DealPilot AI (on behalf of you)",
      recipient: `local_dealer@${location.toLowerCase()}sales.com, store@croma.com`,
      subject: `RFQ / Price Match Request - ${product}`,
      body: `Hi,

I am looking to buy a ${product} in ${location} within the next ${urgency} days.
The best online price is ₹${baseReliance.toLocaleString()}. ${cardText}
Can you offer a competitive price match or package deal at your retail store?

Regards,
DealPilot AI`,
      type: "sent",
      time: "10:15 AM"
    },
    {
      id: 2,
      sender: `${location} Authorized Retailer`,
      recipient: "DealPilot AI",
      subject: `Re: RFQ / Price Match Request - ${product}`,
      body: `Hello,

We are authorized distributors in ${location}. We can match the online base price of ₹${baseReliance.toLocaleString()} and give you a further retail markdown, offering it at ₹${replyPrice.toLocaleString()} net.
If you purchase before the weekend ${emailCardTerms}, we will include a ${accessoryBundle} at no extra charge, bringing your net effective value to ₹${finalPrice.toLocaleString()}.

Let us know if you want us to hold a unit.

Best regards,
Store Manager, ${location} Outlet`,
      type: "received",
      time: "11:45 AM",
      actionable: true,
      actionText: `Accept ${location} Dealer Quote`
    }
  ];
}
