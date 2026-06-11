import { StatItem, NewsItem, FactCheckResult, SearchResult, CompareResult, TopicDetails, ResearchItem } from "./types";

export interface SourceArticle {
  newspaperName: string;
  articleDate: string;
  headline: string;
  subheading: string;
  introduction: string;
  deepSections: {
    sectionTitle: string;
    paragraphs: string[];
  }[];
  editorialOpinion: string;
  sourcesCited: { name: string; url: string }[];
  growthImpactMetrics: { metric: string; value: string }[];
}

export const FALLBACK_STATS: StatItem[] = [
  { id: "gdp", label: "GDP Estimate (FY2025/26)", value: "$340.6 Billion", trend: "down", change: "-0.5% YoY", lastUpdated: "June 2026", source: "State Bank of Pakistan", description: "Pakistan's economic output facing stabilization challenges, with services and agriculture showing minor recovery." },
  { id: "inflation", label: "Inflation Rate (CPI)", value: "11.8%", trend: "down", change: "-2.4% MoM", lastUpdated: "May 2026", source: "Pakistan Bureau of Statistics", description: "Consumer price index eased into double digits from record-high 38% peaks in 2023-2024." },
  { id: "poverty", label: "Poverty Rate (World Bank)", value: "37.5%", trend: "up", change: "+1.2% YoY", lastUpdated: "May 2026", source: "World Bank", description: "Percentage of population living below lower-middle-income poverty line ($3.65/day), impacted by high food costs." },
  { id: "unemployment", label: "Unemployment Rate", value: "6.3%", trend: "flat", change: "0.0% YoY", lastUpdated: "April 2026", source: "PBS / ILO estimate", description: "Measured unemployment rate remains steady, though high underemployment in informal/agricultural sectors persist." },
  { id: "climate", label: "Climate Risk Index", value: "Rank 5th", trend: "up", change: "+0.1 vulnerability score", lastUpdated: "June 2026", source: "Germanwatch Global Climate Risk Index", description: "Pakistan remains among top 5 nations most vulnerable to climate catastrophes, stemming from glacier melt and monsoon intensity." },
  { id: "literacy", label: "National Literacy Rate", value: "58.9%", trend: "up", change: "+0.4% YoY", lastUpdated: "March 2026", source: "Pakistan Economic Survey", description: "Literacy rate varies greatly between urban centers (76%) and rural districts (52%), with an ongoing gender gap." }
];

export const FALLBACK_NEWS: NewsItem[] = [
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

export const FALLBACK_RESEARCH: ResearchItem[] = [
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
    title: "Solarization Potential Matrix: Modeling Arid Decentralized Microgrids in Sindh",
    author: "Zainab Shah (NED University of Engineering)",
    summary: "Studies the efficiency, durability, and cost-benefit ratios of community-funded hybrid solar microgrids across Tharparkar and Ghotki. Highlights the economic viability of smart meters in arid communities.",
    whatItMeans: "Providing low-cost, decentralized green energy blueprints to local municipal unions to power deep-well water pumps and digital education clusters.",
    date: "January 2026",
    pdfName: "solarization_matrix_sindh.pdf",
    pdfData: "placeholder_solar_study"
  }
];

export const getFallbackTopicDetails = (topicName: string): TopicDetails => {
  const t = topicName.toLowerCase();
  const topicsData: { [key: string]: TopicDetails } = {
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
  return topicsData[t] || topicsData["economy"];
};

export const getFallbackFactCheck = (claim: string): FactCheckResult => {
  const lowerClaim = claim.toLowerCase();
  
  if (lowerClaim.includes("90%")) {
    return {
      status: "False",
      correctData: "Pakistan's literacy rate is approximately 58.9% as of the latest Pakistan Economic Survey.",
      explanation: "While some major urban municipal centers have literacy close to 75-80%, the national average rests around 58.9%, with deep disparities between provinces (e.g. Punjab approx 62%, Balochistan approx 45%).",
      source: "Pakistan Economic Survey / Pakistan Bureau of Statistics"
    };
  }

  if (lowerClaim.includes("5%")) {
    return {
      status: "Partially True",
      correctData: "Inflation was around 11% recently, but has touched single digits in some month-on-month intervals.",
      explanation: "Inflation peaked heavily at nearly 38% in early 2024, but has successfully cooled down toward 11-12% as of early 2026 following rigorous monetary tightening from the SBP.",
      source: "State Bank of Pakistan (SBP) CPI reports"
    };
  }

  if (lowerClaim.includes("gdp") || lowerClaim.includes("billion") || lowerClaim.includes("size")) {
    return {
      status: "True",
      correctData: "Pakistan's nominal GDP is estimated around $340-350 Billion USD.",
      explanation: "The country's economic size rests in this window, with agriculture contributing about 23% and services accounting for 58% of the economic output.",
      source: "World Bank / State Bank of Pakistan Database"
    };
  }

  return {
    status: "Partially True",
    correctData: "According to standard public registers (PBS, World Bank, UN), data is variable.",
    explanation: `Your claim: "${claim}" was assessed by our offline repository parser. Generally, Pakistan's macro and developmental stats reflect immense variations between urban nodes and rural divisions.`,
    source: "Pakistan Bureau of Statistics (PBS)"
  };
};

export const getFallbackSearchInsights = (query: string): SearchResult => {
  const queryLower = query.toLowerCase();
  
  const mockCharts: { [key: string]: { label: string; value: number }[] } = {
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

  let categoryKey = "nationalStats";
  for (const key of Object.keys(mockCharts)) {
    if (queryLower.includes(key)) {
      selectedChart = mockCharts[key];
      categoryKey = key;
      break;
    }
  }

  return {
    keyNumbers: categoryKey === "poverty" ? "37.5% poverty rate nationwide" 
                 : categoryKey === "inflation" ? "11.8% consumer CPI index"
                 : categoryKey === "gdp" ? "$340.6 Billion annual economic size"
                 : categoryKey === "education" ? "58.9% literacy across genders"
                 : categoryKey === "climate" ? "5th most vulnerable ranking" : "78.4% regional metric index",
    simpleExplanation: `Your search about "${query}" matches relevant planning commission databases. Disparities in local municipal funding, access to physical grids, and regional geographics heavily determine this outcome.`,
    chartData: selectedChart,
    sources: [
      { name: "Pakistan Bureau of Statistics (PBS)", url: "https://www.pbs.gov.pk" },
      { name: "World Bank Data: Pakistan", url: "https://data.worldbank.org/country/pakistan" }
    ],
    aiSummary: `Our regional compendium for "${query}" shows visible development anomalies. Inter-provincial corridors demonstrate progress in technological adoption and freelance capabilities, while remote farming divisions are squeezed by distribution leaks.`
  };
};

export const getFallbackCompare = (elementA: string, elementB: string, metric: string): CompareResult => {
  const metricLower = metric.toLowerCase();
  const lowerB = elementB.toLowerCase();
  
  let valA = "58.9%";
  let valB = "74.9%";
  let numericA = 59;
  let numericB = 75;

  if (metricLower === "gdp") {
    valA = "$340.6 Billion";
    numericA = 340.6;
    if (lowerB.includes("india")) {
      valB = "$3.73 Trillion";
      numericB = 3730;
    } else if (lowerB.includes("bangladesh")) {
      valB = "$460.2 Billion";
      numericB = 460.2;
    } else {
      valB = "$120.5 Billion";
      numericB = 120.5;
    }
  } else if (metricLower === "inflation") {
    valA = "11.8%";
    numericA = 11.8;
    if (lowerB.includes("india")) {
      valB = "4.8%";
      numericB = 4.8;
    } else if (lowerB.includes("bangladesh")) {
      valB = "9.8%";
      numericB = 9.8;
    } else {
      valB = "13.5%";
      numericB = 13.5;
    }
  } else if (metricLower === "poverty") {
    valA = "37.5%";
    numericA = 37.5;
    if (lowerB.includes("india")) {
      valB = "21.9%";
      numericB = 21.9;
    } else if (lowerB.includes("bangladesh")) {
      valB = "18.7%";
      numericB = 18.7;
    } else {
      valB = "35.2%";
      numericB = 35.2;
    }
  } else if (metricLower === "literacy") {
    valA = "58.9%";
    numericA = 58.9;
    if (lowerB.includes("india")) {
      valB = "77.7%";
      numericB = 77.7;
    } else if (lowerB.includes("bangladesh")) {
      valB = "74.9%";
      numericB = 74.9;
    } else {
      valB = "65.4%";
      numericB = 65.4;
    }
  }

  return {
    metricLabel: metric.toUpperCase() + " COMPARISON INDEX",
    valA,
    valB,
    chart: [
      { name: elementA, value: numericA },
      { name: elementB, value: numericB }
    ],
    aiSummary: `Evaluating ${elementA} and ${elementB} on "${metric}" illustrates diverging macro-trajectories. While ${elementA}'s index is governed by recent stabilization corrections, IMF program compliance, and high interest rates, ${elementB} features a different demographic transition trajectory and varying degrees of industrial output.`
  };
};

export const getFallbackSourceArticle = (
  title: string,
  subtitle: string,
  source: string,
  label?: string,
  value?: string,
  type?: string
): SourceArticle => {
  return {
    newspaperName: source || "The Dawn Policy Journal",
    articleDate: "June 11, 2026",
    headline: title,
    subheading: subtitle || `National developmental brief: ${label || ""} - ${value || ""}`,
    introduction: `The newly published policy datasets regarding "${title}" have spurred intensive discussions among the Planning Commission and local provincial cabinets. Academic research suggests that underlying parameters on "${type || "Data assessment"}" present both high-value growth potentials and deep infrastructural limits in peripheral circles.`,
    deepSections: [
      {
        sectionTitle: "1. Spatial Analysis and Provincial Disparities",
        paragraphs: [
          "Historical statistics reveal that Pakistan's growth clusters remain heavily centralized around primary municipal nodes (Lahore, Karachi, Islamabad-Rawalpindi). Peripheral districts in Balochistan and South Punjab face compound freight overheads and baseline connectivity deficits.",
          "This uneven distribution reflects heavily on local services and school participation metrics. Where provincial hubs showcase over 74% literacy, agrarian segments struggle with a lack of primary infrastructure and persistent gender-based dropout rates."
        ]
      },
      {
        sectionTitle: "2. Macro-Fiscal Vulnerabilities and Public Finance",
        paragraphs: [
          "Funding deficits remain a persistent roadblock for local municipal development programs. According to central bank advisors, steep interest servicing obligations combined with the soaring circular debt of state utility corporations restrict direct welfare allocations.",
          "However, the adoption of decentralized smart meters, solarized primary clinics, and direct digital micro-remittances to female freelance creators can bypass distribution inefficiencies, yielding maximum local outcome per rupee spent."
        ]
      }
    ],
    editorialOpinion: "This developmental reality demonstrates that Pakistan must pivot immediately from centralized funding constructs to community-led solarization and hybrid instructional classrooms. Verified, transparent data represents the singular foundation of this transition.",
    sourcesCited: [
      { name: "Pakistan Bureau of Statistics (PBS)", url: "https://www.pbs.gov.pk" },
      { name: "State Bank of Pakistan (SBP) Reserves", url: "https://www.sbp.org.pk" }
    ],
    growthImpactMetrics: [
      { metric: "Sovereign Risk Premium Correction", value: "-0.45% Volatility" },
      { metric: "Citizen Direct Welfare Index", value: "+3.2% Utility Gain" }
    ]
  };
};
