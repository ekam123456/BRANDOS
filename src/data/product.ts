export type BusinessCategory = "restaurant" | "saas" | "ecommerce" | "local-service" | "idea";

export type ProductQuestion = {
  id: string;
  label: string;
  prompt: string;
  hint?: string;
  optional?: boolean;
  placeholder?: string;
};

export const businessCategories: Array<{ id: BusinessCategory; label: string; description: string }> = [
  { id: "restaurant", label: "Restaurant or food business", description: "Dine-in, takeaway, delivery, or food product." },
  { id: "saas", label: "SaaS or software", description: "A software product sold to people or businesses." },
  { id: "ecommerce", label: "E-commerce", description: "Products sold through an online store or marketplace." },
  { id: "local-service", label: "Local service business", description: "A service delivered in a defined area." },
  { id: "idea", label: "New business or idea", description: "You are shaping something that has not launched yet." },
];

export const questionPacks: Record<BusinessCategory, ProductQuestion[]> = {
  restaurant: [
    { id: "offer", label: "What do you offer?", prompt: "What kind of food or experience do you provide?", placeholder: "For example, a neighbourhood bakery and coffee counter" },
    { id: "operations", label: "How do you operate?", prompt: "How do customers buy from you?", placeholder: "Dine-in, takeaway, delivery, catering…" },
    { id: "challenge", label: "What feels hardest right now?", prompt: "What would you most like to understand or improve?", optional: true, placeholder: "Skip if you are not sure yet" },
  ],
  saas: [
    { id: "offer", label: "What do you offer?", prompt: "What does your software help people or businesses do?", placeholder: "Describe the problem your product helps solve" },
    { id: "customer", label: "Who is it for?", prompt: "Who is the product designed to serve?", placeholder: "For example, small finance teams" },
    { id: "challenge", label: "What feels hardest right now?", prompt: "Where would better understanding help most?", optional: true, placeholder: "Skip if you are not sure yet" },
  ],
  ecommerce: [
    { id: "offer", label: "What do you sell?", prompt: "What products or product category do you sell?", placeholder: "For example, refillable home essentials" },
    { id: "operations", label: "Where do you sell?", prompt: "Which channels do you use or plan to use?", placeholder: "Your store, marketplaces, social commerce…" },
    { id: "challenge", label: "What feels hardest right now?", prompt: "What would you most like to understand or improve?", optional: true, placeholder: "Skip if you are not sure yet" },
  ],
  "local-service": [
    { id: "offer", label: "What do you provide?", prompt: "What service do customers come to you for?", placeholder: "For example, residential electrical work" },
    { id: "operations", label: "Where do you operate?", prompt: "What area do you serve?", placeholder: "City, region, or service radius" },
    { id: "challenge", label: "What feels hardest right now?", prompt: "What would you most like to understand or improve?", optional: true, placeholder: "Skip if you are not sure yet" },
  ],
  idea: [
    { id: "idea", label: "The idea", prompt: "What are you thinking of building?", placeholder: "Describe the idea in your own words" },
    { id: "customer", label: "The customer", prompt: "Who might this be for?", optional: true, placeholder: "It is okay if this is still a hypothesis" },
    { id: "problem", label: "The problem", prompt: "What problem do you want to solve?", placeholder: "What would be better for this customer?" },
    { id: "assumption", label: "Open question", prompt: "What are you least certain about?", optional: true, placeholder: "This will remain an open question, not a fact" },
  ],
};

export const goalOptions = ["Get more customers", "Increase revenue", "Launch the business", "Improve profitability", "Grow audience", "Improve operations"];
