import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Waring: GEMINI_API_KEY environment variable is not defined. Using smart local fallbacks.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Check if Gemini API is configured/ready
function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return !!key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "";
}

// Preseeded Pakistan Statistics to load immediately or fallback
const PK_STATS = [
  { id: "gdp", label: "GDP Estimate (FY2025/26)", value: "$340.6 Billion", trend: "down", change: "-0.5% YoY", lastUpdated: "June 2026", source: "State Bank of Pakistan", description: "Pakistan's economic output facing stabilization challenges, with services and agriculture showing minor recovery." },
  { id: "inflation", label: "Inflation Rate (CPI)", value: "11.8%", trend: "down", change: "-2.4% MoM", lastUpdated: "May 2026", source: "Pakistan Bureau of Statistics", description: "Consumer price index eased into double digits from record-high 38% peaks in 2023-2024." },
  { id: "poverty", label: "Poverty Rate (World Bank)", value: "37.5%", trend: "up", change: "+1.2% YoY", lastUpdated: "May 2026", source: "World Bank", description: "Percentage of population living below lower-middle-income poverty line ($3.65/day), impacted by high food costs." },
  { id: "unemployment", label: "Unemployment Rate", value: "6.3%", trend: "flat", change: "0.0% YoY", lastUpdated: "April 2026", source: "PBS / ILO estimate", description: "Measured unemployment rate remains steady, though high underemployment in informal/agricultural sectors persist." },
  { id: "climate", label: "Climate Risk Index", value: "Rank 5th", trend: "up", change: "+0.1 vulnerability score", lastUpdated: "June 2026", source: "Germanwatch Global Climate Risk Index", description: "Pakistan remains among top 5 nations most vulnerable to climate catastrophes, stemming from glacier melt and monsoon intensity." },
  { id: "literacy", label: "National Literacy Rate", value: "58.9%", trend: "up", change: "+0.4% YoY", lastUpdated: "March 2026", source: "Pakistan Economic Survey", description: "Literacy rate varies greatly between urban centers (76%) and rural districts (52%), with an ongoing gender gap." }
];

// Preseeded Pakistan News headlines with fallbacks
const PK_NEWS = [
  {
    id: "news-1",
    title: "State Bank of Pakistan Eases Interest Rates to 16.5% as Inflation Cools Down",
    category: "Economy",
    source: "Dawn News",
    date: "June 10, 2026",
    summary: "SBP cuts policy rate by another 100 basis points citing consistent reduction in consumer price index and stable foreign currency reserves.",
    whatItMeans: "Borrowing costs will drop slightly for local companies, which might stimulate business expansion and increase jobs. However, depositors will earn fewer returns on their savings."
  },
  {
    id: "news-2",
    title: "Federal Government Announces Green Pakistan Afforestation Drive in Budget 2026-27",
    category: "Climate",
    source: "The Express Tribune",
    date: "June 08, 2026",
    summary: "A new environmental protection framework allocates Rs 15 billion for mangrove restoration and electric public transport subsidies across Sindh and Punjab.",
    whatItMeans: "This creates new job opportunities in green infrastructure and signals Pakistan's effort to address international climate commitments to unlock concessional climate financing."
  },
  {
    id: "news-3",
    title: "National Digital Literacy Initiative Launched with Global tech giants",
    category: "Education",
    source: "Business Recorder",
    date: "May 28, 2026",
    summary: "Ministry of IT collaborates with Google and tech consortiums to provide certifications for 150,000 public high school teachers and upgrade computer labs.",
    whatItMeans: "The program bridges rural tech education gaps, equipping students with basic cloud and coding skills to increase Pakistan's competitive freelance potential."
  },
  {
    id: "news-4",
    title: "Primary Healthcare Centers in Southern Districts to Receive Solar Power Grids",
    category: "Health",
    source: "The News International",
    date: "May 24, 2026",
    summary: "WHO and Ministry of National Health Services announce a joint project powering 140 remote rural clinics with independent solar grids to safeguard vital medicines.",
    whatItMeans: "Rural patients gain access to robust, overnight clinical consultations and refrigerated vaccines that were previously impossible due to power brownouts."
  }
];

// --- API Router Handlers ---

// PAGE 1: DATA TODAY
app.get("/api/stats", (req, res) => {
  res.json({ stats: PK_STATS });
});

// PAGE 2: AI CHECKER (FACT CHECK)
app.post("/api/fact-check", async (req, res) => {
  const { claim } = req.body;
  if (!claim || claim.trim().length < 5) {
    return res.status(400).json({ error: "Please enter a valid claim about Pakistan (minimum 5 characters)." });
  }

  // Fallback defaults if Gemini encounters errors
  const mockChecks: { [key: string]: any } = {
    "90%": {
      status: "False",
      correctData: "Pakistan's literacy rate is approximately 58.9% as of the latest Pakistan Economic Survey.",
      explanation: "While some major urban municipal centers have literacy close to 75-80%, the national average rests around 58.9%, with deep disparities between provinces (e.g. Punjab approx 62%, Balochistan approx 45%).",
      source: "Pakistan Economic Survey / Pakistan Bureau of Statistics"
    },
    "5%": {
      status: "Partially True",
      correctData: "Inflation was around 11% recently, but has touched single digits in some month-on-month intervals.",
      explanation: "Inflation peaked heavily at nearly 38% in early 2024, but has successfully cooled down toward 11-12% as of early 2026 following rigorous monetary tightening from the SBP.",
      source: "State Bank of Pakistan (SBP) CPI reports"
    },
    "gdp": {
      status: "True",
      correctData: "Pakistan's nominal GDP is estimated around $340-350 Billion USD.",
      explanation: "The country's economic size rests in this window, with agriculture contributing about 23% and services accounting for 58% of the economic output.",
      source: "World Bank / State Bank of Pakistan Database"
    }
  };

  let fallback = {
    status: "Partially True",
    correctData: "According to standard public registers (PBS, World Bank, UN), data is variable.",
    explanation: `Your claim: "${claim}" was assessed. There is variable corroboration. Generally, Pakistan's social indexes are heavily tiered across urban centers (Lahore, Karachi, Islamabad) compared to rural parts.`,
    source: "Pakistan Bureau of Statistics (PBS) / Ministry of Planning & Development"
  };

  // Match keyword in claim for a highly accurate matched mock check
  const lowerClaim = claim.toLowerCase();
  for (const key of Object.keys(mockChecks)) {
    if (lowerClaim.includes(key)) {
      fallback = mockChecks[key];
      break;
    }
  }

  if (!isGeminiConfigured()) {
    return res.json({ result: fallback, source: "PAKDATA Local Knowledge Base" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Fact-check the following claim about Pakistan: "${claim}".
You must output a JSON object obeying exactly this structure:
{
  "status": "True" or "False" or "Partially True",
  "correctData": "A precise statement of the correct statistics or official consensus",
  "explanation": "A detailed explanation in simple, clear, neutral English explaining the background",
  "source": "An authoritative source like World Bank, UN, SBP, PBS, Ministry of Finance, etc."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            correctData: { type: Type.STRING },
            explanation: { type: Type.STRING },
            source: { type: Type.STRING }
          },
          required: ["status", "correctData", "explanation", "source"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ result: parsed, source: "Gemini Real-Time Verification Engine" });
  } catch (error: any) {
    console.warn("Gemini Fact Check warning/info:", error.message || error);
    return res.json({ result: fallback, source: "PAKDATA Fallback Engine (API error or limit reached)" });
  }
});

// PAGE 3: PAKISTAN NEWS & SUMMARIES
app.get("/api/news", (req, res) => {
  res.json({ news: PK_NEWS });
});

app.post("/api/news-summary", async (req, res) => {
  const { title, summary } = req.body;
  if (!title) {
    return res.status(400).json({ error: "News title is required string." });
  }

  const fallbackSummary = {
    summary: summary || `Analysis of "${title}": This indicates critical development shifts in agricultural or services sectors, reflecting policy measures targeted at infrastructure growth.`,
    whatItMeans: "This means policy decisions are slowly yielding fruit, although structural bottlenecks like budget deficits and distribution leaks remain key hurdles."
  };

  if (!isGeminiConfigured()) {
    return res.json({ result: fallbackSummary, source: "PAKDATA News Desk" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Provide an easy-to-understand AI summary and a "What this means" segment for this news about Pakistan:
Headline: ${title}
Details: ${summary || "No extra text provided."}

Return a JSON object:
{
  "summary": "Explain the news in 2-3 sentences of very simple, accessible English",
  "whatItMeans": "Explain what this means for average Pakistani citizens or the nation's future in 2 clear sentences"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            whatItMeans: { type: Type.STRING }
          },
          required: ["summary", "whatItMeans"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ result: parsed, source: "PAKDATA AI News Summarizer" });
  } catch (err: any) {
    console.warn("News summary warning/info:", err.message || err);
    return res.json({ result: fallbackSummary, source: "PAKDATA News Desk (Fallback)" });
  }
});

// PAGE 4: SEARCH & INSIGHTS PAGE
app.post("/api/search-insights", async (req, res) => {
  const { query } = req.body;
  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: "Missing search query." });
  }

  // Pre-baked templates for common terms to render chart points instantly
  const mockCharts: { [key: string]: any } = {
    poverty: [
      { label: "Balochistan", value: 43.1 },
      { label: "KPK", value: 38.4 },
      { label: "Sindh", value: 37.0 },
      { label: "Punjab", value: 31.8 }
    ],
    education: [
      { label: "Punjab", value: 64 },
      { label: "Sindh", value: 55 },
      { label: "KPK", value: 53 },
      { label: "Balochistan", value: 43 }
    ],
    inflation: [
      { label: "2023", value: 29.2 },
      { label: "2024", value: 23.4 },
      { label: "2025", value: 14.5 },
      { label: "2026 (Est)", value: 11.2 }
    ],
    gdp: [
      { label: "Agriculture", value: 23 },
      { label: "Industry", value: 19 },
      { label: "Services", value: 58 }
    ],
    climate: [
      { label: "Flood vulnerability", value: 85 },
      { label: "Water Stress index", value: 72 },
      { label: "Extreme Heat Risk", value: 90 },
      { label: "Air Pollution PM2.5", value: 68 }
    ]
  };

  let selectedChart = [
    { label: "National Average", value: 60 },
    { label: "Urban Sector", value: 74 },
    { label: "Rural Sector", value: 48 }
  ];

  const queryLower = query.toLowerCase();
  let categoryKey = "nationalStats";
  for (const key of Object.keys(mockCharts)) {
    if (queryLower.includes(key)) {
      selectedChart = mockCharts[key];
      categoryKey = key;
      break;
    }
  }

  const fallbackResponse = {
    keyNumbers: categoryKey === "poverty" ? "37.5% poverty rate nationwide" 
                 : categoryKey === "inflation" ? "11.8% consumer CPI index"
                 : categoryKey === "gdp" ? "$340.6 Billion annual economic size"
                 : categoryKey === "education" ? "58.9% literacy across genders"
                 : categoryKey === "climate" ? "5th most vulnerable ranking" : "Value variable",
    simpleExplanation: `Your search about "${query}" touches on complex developmental domains in Pakistan. Historical policy, inter-provincial infrastructure disparities, and governance structures affect these outcomes.`,
    chartData: selectedChart,
    sources: [
      { name: "Pakistan Bureau of Statistics (PBS)", url: "https://www.pbs.gov.pk" },
      { name: "World Bank Data: Pakistan", url: "https://data.worldbank.org/country/pakistan" }
    ],
    aiSummary: `An exploration of "${query}" reveals significant rural-urban gaps. Major centers have robust digital layouts and higher indices, while distal divisions suffer infrastructure deficits.`
  };

  if (!isGeminiConfigured()) {
    return res.json({ result: fallbackResponse, source: "PAKDATA Analytics Engine" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Analyze this search query about Pakistan: "${query}".
Deliver a comprehensive, data-driven synthesis containing key metrics, clear explanations, and a chart mapping.
Provide exactly the following JSON structure:
{
  "keyNumbers": "1-2 vital numbers and current years (e.g. '58.9% Literacy Rate in 2026')",
  "simpleExplanation": "An easy-to-understand explanation of about 3 sentences on what causes or defines this in Pakistan",
  "chartData": [
    { "label": "Sindh / Category A", "value": 45 },
    { "label": "Punjab / Category B", "value": 60 }
  ],
  "sources": [
    { "name": "Source Name (e.g., SBP or PBS)", "url": "A realistic data source website URL" }
  ],
  "aiSummary": "A concise, high-impact paragraph of AI insights about future trends and structural issues on this topic"
}

Ensure the chartData contains 3 to 5 realistic items that represent the query (like provinces, years, or sector share) so we can render beautiful charts in the frontend!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keyNumbers: { type: Type.STRING },
            simpleExplanation: { type: Type.STRING },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                },
                required: ["label", "value"]
              }
            },
            sources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["name", "url"]
              }
            },
            aiSummary: { type: Type.STRING }
          },
          required: ["keyNumbers", "simpleExplanation", "chartData", "sources", "aiSummary"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ result: parsed, source: "Gemini Data Synthesizer" });
  } catch (error: any) {
    console.warn("Gemini Search warning/info:", error.message || error);
    return res.json({ result: fallbackResponse, source: "PAKDATA Analytics Engine (Fallback)" });
  }
});

// PAGE 5: COMPARE PAGE
app.post("/api/compare", async (req, res) => {
  const { elementA, elementB, metric } = req.body;
  if (!elementA || !elementB || !metric) {
    return res.status(400).json({ error: "Missing comparison details." });
  }

  // Pre-seed responses for side-by-side
  const fallbackCompare = {
    metricLabel: metric.toUpperCase(),
    valA: metric === "gdp" ? "$340B" : metric === "literacy" ? "58.9%" : metric === "inflation" ? "11.8%" : "37.5%",
    valB: elementB.toLowerCase().includes("india") 
          ? (metric === "gdp" ? "$3.7 trillion" : metric === "literacy" ? "77.7%" : metric === "inflation" ? "4.8%" : "21.9%")
          : elementB.toLowerCase().includes("bangladesh")
          ? (metric === "gdp" ? "$460B" : metric === "literacy" ? "74.9%" : metric === "inflation" ? "9.8%" : "18.7%")
          : (metric === "gdp" ? "$100B" : metric === "literacy" ? "65%" : metric === "inflation" ? "14%" : "40%"),
    chart: [
      { name: elementA, value: metric === "gdp" ? 340 : metric === "literacy" ? 59 : metric === "inflation" ? 11.8 : 37.5 },
      { name: elementB, value: elementB.toLowerCase().includes("india") 
            ? (metric === "gdp" ? 3700 : metric === "literacy" ? 78 : metric === "inflation" ? 4.8 : 21.9)
            : elementB.toLowerCase().includes("bangladesh")
            ? (metric === "gdp" ? 460 : metric === "literacy" ? 75 : metric === "inflation" ? 9.8 : 18.7)
            : 50 }
    ],
    aiSummary: `Comparing ${elementA} with ${elementB} on "${metric}" indicates structural deviations. ${elementA}'s index is constrained heavily by internal fiscal space, trade balances and development backlogs, whereas ${elementB} possesses different industrial growth rates and demographic yields.`
  };

  if (!isGeminiConfigured()) {
    return res.json({ result: fallbackCompare, source: "PAKDATA Benchmarker" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Compare "${elementA}" vs "${elementB}" regarding "${metric}".
You must return a JSON object with this EXACT structure:
{
  "metricLabel": "Human friendly label of the metric",
  "valA": "Formatted value of ${elementA} (e.g. '$340 Billion' or '58.9%')",
  "valB": "Formatted value of ${elementB} (e.g. '$3.7 Trillion' or '77.7%')",
  "chart": [
    { "name": "${elementA}", "value": numberValueA },
    { "name": "${elementB}", "value": numberValueB }
  ],
  "aiSummary": "A concise paragraph comparing the history, policies, or future of both regions regarding this metric. Give direct insights."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metricLabel: { type: Type.STRING },
            valA: { type: Type.STRING },
            valB: { type: Type.STRING },
            chart: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                },
                required: ["name", "value"]
              }
            },
            aiSummary: { type: Type.STRING }
          },
          required: ["metricLabel", "valA", "valB", "chart", "aiSummary"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ result: parsed, source: "Gemini Comparison Platform" });
  } catch (error: any) {
    console.warn("Gemini Compare warning/info:", error.message || error);
    return res.json({ result: fallbackCompare, source: "PAKDATA Benchmarker (Fallback)" });
  }
});

// PAGE 6: TOPICS PAGE
app.get("/api/topics/:topicName", async (req, res) => {
  const { topicName } = req.params;
  const t = topicName.toLowerCase();

  // Seed metrics per topic
  const topicsData: { [key: string]: any } = {
    economy: {
      title: "Pakistan Economy",
      keyStats: [
        { label: "GDP Annual Growth", value: "2.4% (FY26 Forecast)" },
        { label: "Foreign Reserves", value: "$9.2 Billion" },
        { label: "Fiscal Deficit", value: "6.8% of GDP" }
      ],
      chartData: [
        { year: "2023", value: -0.2 },
        { year: "2024", value: 1.2 },
        { year: "2025", value: 2.0 },
        { year: "2026 (Est)", value: 2.4 }
      ],
      explanation: "Pakistan's economy is navigating a critical stabilization phase marked by an IMF macro-reform program. Focus remains on broadening the tax base, digitizing institutions, and managing sovereign debts.",
      insight: "Broadening fiscal space rests on bringing retail, agriculture, and real estate into the active tax net."
    },
    education: {
      title: "Education in Pakistan",
      keyStats: [
        { label: "Youth Literacy (15-24)", value: "72%" },
        { label: "Out of School Children", value: "26.2 Million" },
        { label: "Public Spend on Education", value: "1.7% of GDP" }
      ],
      chartData: [
        { year: "Male Literacy", value: 71 },
        { year: "Female Literacy", value: 46 },
        { year: "Average Literacy", value: 59 }
      ],
      explanation: "Access to education is heavily split on provincial lines. Girls in rural communities face acute secondary school dropouts, governed by cultural constraints and long physical commuting distances.",
      insight: "Deploying remote digital classrooms via rural hybrid centers can salvage learning pipelines for out-of-school populations."
    },
    health: {
      title: "Health & Care infrastructure",
      keyStats: [
        { label: "Life Expectancy", value: "66.4 Years" },
        { label: "Stunting Rate (Under 5)", value: "37.6%" },
        { label: "Hospital Beds", value: "0.6 per 1000 people" }
      ],
      chartData: [
        { year: "Malnutrition", value: 37.6 },
        { year: "Immunization", value: 76 },
        { year: "Maternal Health Space", value: 54 }
      ],
      explanation: "Healthcare in Pakistan relies on private out-of-pocket costs (60%). Stunting remains a silent crisis in rural villages, driven by maternal anemia, unsafe drinking water, and chronic food insecurity.",
      insight: "Clean water purification campaigns coupled with primary obstetric care are the highest leverage preventive interventions."
    },
    climate: {
      title: "Climate & Environmental Risk",
      keyStats: [
        { label: "Forest Coverage", value: "4.8% of land" },
        { label: "Glacial Lakes at Risk", value: "33 critical lakes" },
        { label: "Air Quality Rank", value: "Top 3 worst average PM2.5" }
      ],
      chartData: [
        { year: "Monsoon anomalies", value: 82 },
        { year: "Water Availability", value: 45 },
        { year: "Urban Air pollution", value: 92 }
      ],
      explanation: "Pakistan suffers from hydrological asymmetry: massive glacial torrents in summer contrasted by winter droughts. Air quality in major urban centers regularly reaches hazardous benchmarks in winter months.",
      insight: "Reconstructing sustainable flood zones and implementing rigorous smog filters for crop waste are highly urgent."
    },
    poverty: {
      title: "Poverty & Livelihoods",
      keyStats: [
        { label: "National Poverty line", value: "37.5%" },
        { label: "Multidimensional Poverty", value: "39.1%" },
        { label: "Daily wage average", value: "Rs 1,000" }
      ],
      chartData: [
        { year: "Rural Poverty", value: 51 },
        { year: "Urban Poverty", value: 15 },
        { year: "National Avg", value: 37.5 }
      ],
      explanation: "Poverty in Pakistan remains essentially a rural phenomenon. High agricultural costs (diesel, fertilizers) squeeze tenant margins, leading to rapid migration to mega-cities' informal squatter colonies.",
      insight: "Targeted direct cash transfers via Pakistan's highly rated BISP safety net offer crucial shields during commodity surges."
    },
    population: {
      title: "Pakistan Population & Demographics",
      keyStats: [
        { label: "Total Population", value: "241.5 Million (2023 Census)" },
        { label: "Annual Growth Rate", value: "2.55%" },
        { label: "Median Age", value: "20.6 Years" }
      ],
      chartData: [
        { year: "Youth (<30 yrs)", value: 64 },
        { year: "Active labor", value: 31 },
        { year: "Senior Citizens", value: 5 }
      ],
      explanation: "Pakistan is experiencing a massive demographic youth bulge, with over 64% of the population under thirty. Unleashing their creative productivity is key to breaking out of low-growth economic equilibrium.",
      insight: "Providing vocational digital freelancing corridors and simplifying small business registrations will unlock youth capital."
    }
  };

  const selectedTopic = topicsData[t] || topicsData["economy"];

  if (!isGeminiConfigured()) {
    return res.json({ result: selectedTopic, source: "PAKDATA Knowledge Base" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Give a targeted AI expert perspective on Pakistan's topic: "${topicName}".
Provide updated facts, trends, and future trajectories.
Return a JSON object:
{
  "title": "A crisp heading",
  "keyStats": [
    { "label": "Key statistic subtitle (1-3 words)", "value": "Metric text with unit" }
  ],
  "chartData": [
    { "year": "Category or Year", "value": numericValue }
  ],
  "explanation": "A deeply educational explanation of about 4-5 sentences outlining the systemic history and hurdles on this topic in Pakistan.",
  "insight": "A 1-sentence powerful gold-standard insight on how Pakistan should solve or navigate this."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            keyStats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING }
                },
                required: ["label", "value"]
              }
            },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                },
                required: ["year", "value"]
              }
            },
            explanation: { type: Type.STRING },
            insight: { type: Type.STRING }
          },
          required: ["title", "keyStats", "chartData", "explanation", "insight"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ result: parsed, source: "Gemini Real-time Topic Analyzer" });
  } catch (error: any) {
    console.warn(`Gemini Topics warning/info (${topicName}):`, error.message || error);
    return res.json({ result: selectedTopic, source: "PAKDATA Fallback Directory" });
  }
});

// PAGE 7: AI FEATURES HUB CORE ENDPOINTS

// 1. Data Explainer
app.post("/api/tools/explain", async (req, res) => {
  const { stat } = req.body;
  if (!stat) return res.status(400).json({ error: "No statistics provided." });

  const fallback = {
    explanation: `The statistic "${stat}" reflects standard macroeconomic balances in Pakistan. Typically, such indicators vary across rural and urban divisions. Low baseline production capacities and rising energy tariffs play compounding roles in keeping it at this level. To bridge these deficits and enhance welfare, sustainable structural reform and transparency are critical.`,
    takeaway: "Sustainable growth depends extensively on policy implementation over verbal targets."
  };

  if (!isGeminiConfigured()) {
    return res.json({ result: fallback, source: "PAKDATA Core Base" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are a simple, friendly economics explainer. Take this statistic or metric relating to Pakistan: "${stat}".
Explain it in simple, jargon-free English for a high-school student. Avoid dense terms.

Return a JSON object:
{
  "explanation": "Your simplified 3-sentence explanation",
  "takeaway": "A 1-sentence simple direct takeaway on why the average citizen should care about this stat"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            takeaway: { type: Type.STRING }
          },
          required: ["explanation", "takeaway"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json({ result: parsed, source: "Gemini Simple Explainer" });
  } catch (err) {
    return res.json({ result: fallback, source: "PAKDATA Explainer (Fallback)" });
  }
});

// 2. Report Generator
app.post("/api/tools/report", async (req, res) => {
  const { criteria } = req.body;
  if (!criteria) return res.status(400).json({ error: "Missing report parameters." });

  const fallback = {
    title: `Brief Executive Brief: ${criteria}`,
    sections: [
      { heading: "Current Standing", text: "Pakistan faces systemic socio-economic bottlenecks that restrict persistent double-digit growth. Infrastructure assets are heavily leveraged and vulnerable to weather disruptions." },
      { heading: "Primary Drivers", text: "Heavy local fiscal imbalances, rapid population expansion, low institutional digitization speeds, and unstable power grids remain standard roadblocks." },
      { heading: "Key Recommendations", text: "1. Upgrade primary health networks with off-grid renewable source structures like solar power.\n2. Accelerate high-school digital literacy programs with public-private grants.\n3. Integrate local farming districts with direct digital market indexes." }
    ],
    metadata: "Generated instantly by PAKDATA offline synthesis algorithm."
  };

  if (!isGeminiConfigured()) {
    return res.json({ result: fallback, source: "PAKDATA Analytics Hub" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Generate a highly professional, brief structured report on: "${criteria}" in the context of Pakistan data.
Compose 3 sections outlining Current standing, primary drivers, and key actionable policy recommendations.

Return a JSON object structured exactly like:
{
  "title": "A precise formal title",
  "sections": [
    { "heading": "Section Heading", "text": "Section details (2-3 concise sentences)" }
  ],
  "metadata": "Source or date footnote details"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["heading", "text"]
              }
            },
            metadata: { type: Type.STRING }
          },
          required: ["title", "sections", "metadata"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json({ result: parsed, source: "Gemini report synthesizer" });
  } catch (err) {
    return res.json({ result: fallback, source: "PAKDATA Report Synth (Fallback)" });
  }
});

// 3. Question Answer
app.post("/api/tools/qa", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question query is required." });

  const fallback = {
    answer: "Your query touches on key areas of Pakistan's national roadmap. Public information records demonstrate that developmental gaps, infrastructure challenges, and local policy variables actively shape these landscapes.",
    evidence: "Pakistan Bureau of Statistics national census datasets.",
    recommendation: "Focus on decentralizing institutional frameworks to improve resource tracking."
  };

  if (!isGeminiConfigured()) {
    return res.json({ result: fallback, source: "PAKDATA Search Desk" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Answer the following question about Pakistan data: "${question}".
Be clear and highly accurate. Provide concrete data evidence names inside the JSON structure.

Return a JSON object structured exactly like:
{
  "answer": "Your comprehensive answer in 3 easy, professional sentences",
  "evidence": "Authoritative bodies or database references validating this",
  "recommendation": "1-sentence future outlook or recommendation"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            evidence: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["answer", "evidence", "recommendation"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json({ result: parsed, source: "Gemini Q&A Engine" });
  } catch (err) {
    return res.json({ result: fallback, source: "PAKDATA QA Service (Fallback)" });
  }
});

// 4. Insight Generator
app.post("/api/tools/insights", async (req, res) => {
  const { topic } = req.body;
  const topicName = topic || "General Pakistan Data";

  const fallback = {
    insightTitle: `Latent Variable Analysis: ${topicName}`,
    findings: [
      "Rural primary school pipelines lose almost 40% of enrolled kids at the grade-5 transition boundary, predominantly triggered by girls' mobility limitations.",
      "Informal solar energy installation rates in South Punjab have outpaced government low-tension grid hookups by nearly 3 to 1 since 2023.",
      "Upwards of 70% of female freelancers who receive overseas remittance are unregistered locally, rendering them invisible under national labor survey metrics."
    ],
    summary: "Leveraging decentralized networks is key to optimizing development gains without incurring excessive infrastructure costs.",
    leveragePoint: "Expand tax exemptions and micro-grants for registered digital female creators to double export volumes instantly."
  };

  if (!isGeminiConfigured()) {
    return res.json({ result: fallback, source: "PAKDATA Intelligence Lab" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Find 3 hidden, non-obvious, deeply valuable insights about Pakistan's: "${topicName}".
Focus on unconventional causal connections or interesting statistics (e.g. solar grids outgrowing standard poles, female remote labor growth, mobile banking adoption).
Avoid generic statements. Speak like a premier analytics consultancy.

Return a JSON object structured exactly like:
{
  "insightTitle": "A catchy high-impact title",
  "findings": [
    "Compelling finding 1: detailed stat/causal description",
    "Compelling finding 2: detailed stat/causal description",
    "Compelling finding 3: detailed stat/causal description"
  ],
  "summary": "1 sentence summarizing the core development bottleneck",
  "leveragePoint": "The single highest-leverage policy point to act on to solve this."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insightTitle: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summary: { type: Type.STRING },
            leveragePoint: { type: Type.STRING }
          },
          required: ["insightTitle", "findings", "summary", "leveragePoint"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json({ result: parsed, source: "Gemini Advanced Analytics Platform" });
  } catch (err) {
    return res.json({ result: fallback, source: "PAKDATA Analytics Lab (Fallback)" });
  }
});

// on-demand deep source article / structured report generator
app.post("/api/generate-source-article", async (req, res) => {
  const { title, subtitle, source, label, value, type } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title parameter is required." });
  }

  const fallback = {
    newspaperName: source || "The Sovereign Archive",
    articleDate: "June 2026",
    headline: title,
    subheading: subtitle || `National statistical overview: ${label || ""} ${value || ""}`,
    introduction: `The recently published national statistics database regarding "${title}" has triggered substantial policy reviews across ministries. Academic teams advise that structural patterns in local sectors present both growth possibilities and institutional vulnerabilities.`,
    deepSections: [
      {
        sectionTitle: "1. Spatial Analysis and Provincial Disparities",
        paragraphs: [
          `Historical data shows that major economic divisions are heavily centralized around urban economic clusters. Rural margins, primarily in Baluchistan and rural Sindh, face higher baseline costs and distribution bottlenecks. This spatial polarization has constrained cumulative development metrics.`,
          `Sectors like solar energy, secondary schooling, and micro-financing indicate deep regional variability. While administrative centers have successfully digitized over 75% of registries, agricultural and remote belts still utilize highly unstable methods.`
        ]
      },
      {
        sectionTitle: "2. Macro Trends and Fiscal Bottlenecks",
        paragraphs: [
          `Funding allocations have consistently hovered below optimal standards. According to sector analysts, direct external debt servicing and power sector circular debt restrict the state's capacity to subsidize primary consumer food or healthcare items directly.`,
          `The introduction of comprehensive, digitized registries presents a clear path to resolving leakage anomalies. Expanding micro-grants for vocational freelancers could unlock immediate foreign exchanges.`
        ]
      },
      {
        sectionTitle: "3. Policy Synthesis & Causal Outlook",
        paragraphs: [
          `Experts suggest an urgent shift from top-heavy infrastructure to decentralized service channels. Recreating sustainable crop protection zones and funding remote hybrid classrooms remain high-priority target agendas.`
        ]
      }
    ],
    editorialOpinion: "This statistic should serve as a wake-up call for municipal and national planning boards. Without a transition to verified, real-time metrics, systemic leakage and regional imbalances will continue to derail policy goals.",
    sourcesCited: [
      { name: "Pakistan Bureau of Statistics (PBS)", url: "https://www.pbs.gov.pk" },
      { name: "World Bank Data Hub", url: "https://data.worldbank.org" }
    ],
    growthImpactMetrics: [
      { metric: "Sovereign Risk Shift", value: "-0.45% volatility" },
      { metric: "Citizen Direct Utility", value: "+3.2% welfare gain" }
    ]
  };

  if (!isGeminiConfigured()) {
    return res.json({ result: fallback, source: "PAKDATA Local Library" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are an elite editorial writer for a premier economic journal like The Economist or Financial Times.
Your goal is to write a highly detailed, formal, deep-dive analytical report/article on this subject in Pakistan:
- Subject Title: "${title}"
- Related parameters: Label: "${label || ""}", Value: "${value || ""}", Source: "${source || ""}", Description: "${subtitle || ""}".
- Type context: "${type || "Data Insight"}"

Write a complete, structured, highly professional article. Avoid generic filler.
You must return a JSON object structured exactly as:
{
  "newspaperName": "An elegant, realistic journal or official agency name (e.g., 'Sovereign Pakistan Monitor' or 'Dawn Policy Journal')",
  "articleDate": "Current formal date (e.g., 'June 11, 2026')",
  "headline": "A catchy, powerful formal headline",
  "subheading": "A descriptive subtitle highlighting the core analytical tension",
  "introduction": "An engaging, deep introduction paragraph (4-5 sentences) introducing the statistical reality and systemic background",
  "deepSections": [
    {
      "sectionTitle": "Section Heading (e.g., '1. Systemic Policy Challenges' or '2. Infrastructure Bottlenecks')",
      "paragraphs": [
        "First rich, data-dense analysis paragraph.",
        "Second analytical paragraph covering provincial variations or structural leaks."
      ]
    },
    {
      "sectionTitle": "Second Section Heading",
      "paragraphs": [
        "Paragraph detailing the fiscal or spatial implications on average citizens.",
        "Paragraph showing historical comparison and current reform bottlenecks."
      ]
    }
  ],
  "editorialOpinion": "A 2-sentence sharp conclusion / policy statement showing the definitive way forward for Pakistan.",
  "sourcesCited": [
    { "name": "Authoritative body name (e.g. State Bank of Pakistan)", "url": "Official-looking URL" }
  ],
  "growthImpactMetrics": [
    { "metric": "Visual key metric indicator", "value": "Relative percentage or absolute number" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newspaperName: { type: Type.STRING },
            articleDate: { type: Type.STRING },
            headline: { type: Type.STRING },
            subheading: { type: Type.STRING },
            introduction: { type: Type.STRING },
            deepSections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sectionTitle: { type: Type.STRING },
                  paragraphs: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["sectionTitle", "paragraphs"]
              }
            },
            editorialOpinion: { type: Type.STRING },
            sourcesCited: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["name", "url"]
              }
            },
            growthImpactMetrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING },
                  value: { type: Type.STRING }
                },
                required: ["metric", "value"]
              }
            }
          },
          required: [
            "newspaperName",
            "articleDate",
            "headline",
            "subheading",
            "introduction",
            "deepSections",
            "editorialOpinion",
            "sourcesCited",
            "growthImpactMetrics"
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ result: parsed, source: "Gemini Policy Reporter" });
  } catch (error: any) {
    console.warn("Gemini article generation warning/info:", error.message || error);
    return res.json({ result: fallback, source: "PAKDATA Archivist Fallback" });
  }
});


// Global in-memory storage for uploaded research papers & theses (Pakistan focus)
const PK_RESEARCH = [
  {
    id: "res-1",
    title: "Socio-Fiscal Analysis of BISP Cash Transfers in Rural Punjab",
    author: "Dr. Maria Khan (LMU Economics)",
    summary: "This paper reviews the household consumption patterns of low-income families receiving Benazir Income Support Programme grants across Rahim Yar Khan and Bahawalpur districts. Focuses on the direct correlation between basic nutrition levels and digital disbursement efficiency.",
    whatItMeans: "Evaluating micro-level nutritional outcomes, educational enrollment trends, and developing direct policy recommendations for maternal healthcare.",
    date: "April 2026",
    pdfName: "bisp_cash_transfers_punjab.pdf",
    pdfData: "placeholder_bisp_study"
  },
  {
    id: "res-2",
    title: "Glacial Lake Outburst Floods (GLOF) in Gilgit-Baltistan: Risk Mitigation Models",
    author: "Engr. Jamil Ahmed (NUST Environmental Sciences)",
    summary: "Assesses early sensor alarms and barrier wall infrastructure in Shimshal Valley. Formulates secondary hydrological emergency exit routines and models flash-flood wave propagation timelines.",
    whatItMeans: "Assisting local disaster management authorities (GBDMA) in saving human lives and securing primary hydro-electric turbine canals during high-flow flash periods.",
    date: "May 2026",
    pdfName: "glof_mitigation_gb.pdf",
    pdfData: "placeholder_glof_study"
  },
  {
    id: "res-3",
    title: "Assessing the Solarization Matrix: Decentralized Off-Grid Energy in Rural Sindh",
    author: "Zainab Shah (NED University of Engineering)",
    summary: "Studies the efficiency, durability, and cost-benefit ratios of community-funded hybrid solar microgrids across Tharparkar and Ghotki. Highlights the economic viability of smart meters in arid communities.",
    whatItMeans: "Providing low-cost, decentralized green energy blueprints to local municipal unions to power deep-well water pumps and digital education clusters.",
    date: "January 2026",
    pdfName: "solarization_matrix_sindh.pdf",
    pdfData: "placeholder_solar_study"
  }
];

app.get("/api/researches", (req, res) => {
  res.json({ researches: PK_RESEARCH });
});

app.post("/api/researches", (req, res) => {
  const { title, author, summary, whatItMeans, pdfName, pdfData } = req.body;
  if (!title || !author || !summary || !whatItMeans) {
    return res.status(400).json({ error: "Missing required research fields: title, author, summary, and whatItMeans are mandatory." });
  }
  const newResearch = {
    id: `res-${Date.now()}`,
    title,
    author,
    summary,
    whatItMeans,
    pdfName: pdfName || "manuscript.pdf",
    pdfData: pdfData || "", // base64 representation of selected PDF file
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })
  };
  PK_RESEARCH.unshift(newResearch);
  res.status(201).json({ success: true, research: newResearch });
});


// Vite Middleware Configuration for Assets & SPA Fallbacks
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is booted! Running full-stack on http://localhost:${PORT}`);
  });
}

startServer();
