export interface StatItem {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "flat";
  change: string;
  lastUpdated: string;
  source: string;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  source: string;
  date: string;
  summary: string;
  whatItMeans: string;
}

export interface FactCheckResult {
  status: "True" | "False" | "Partially True";
  correctData: string;
  explanation: string;
  source: string;
}

export interface SearchResult {
  keyNumbers: string;
  simpleExplanation: string;
  chartData: { label: string; value: number }[];
  sources: { name: string; url: string }[];
  aiSummary: string;
}

export interface CompareResult {
  metricLabel: string;
  valA: string;
  valB: string;
  chart: { name: string; value: number }[];
  aiSummary: string;
}

export interface TopicDetails {
  title: string;
  keyStats: { label: string; value: string }[];
  chartData: { year: string; value: number }[];
  explanation: string;
  insight: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  author: string;
  summary: string;
  whatItMeans: string;
  date: string;
  pdfName?: string;
  pdfData?: string;
}
