import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { 
  Home as HomeIcon, 
  Database, 
  ShieldCheck, 
  Newspaper, 
  Search, 
  GitCompare, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ArrowUpRight, 
  FileText, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Info,
  Globe,
  Settings,
  Lock,
  ChevronDown,
  Upload
} from "lucide-react";
import { StatItem, NewsItem, FactCheckResult, SearchResult, CompareResult, TopicDetails, ResearchItem } from "./types";

interface SourceArticle {
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

// ----------------------------------------------------
// PAKDATA Custom Visual Logo Component (attached asset faithfully rendered in SVG)
// ----------------------------------------------------
function PakDataLogo({ className = "h-11" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Precision geometric visual symbol */}
      <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer stylized block navy letter 'P' resembling the brand image */}
        <path 
          d="M34 20 H86 C106 20 106 62 86 62 H56 V92 H34 V20 Z" 
          fill="#021224" 
          fillRule="evenodd"
          clipRule="evenodd"
        />
        {/* Crisp white/negative background cutout inside vertical stem of P */}
        <path 
          d="M45 56 H60 V86 H45 V56 Z"
          fill="#ffffff"
        />
        {/* Integrated custom rising data columns (cutout details) */}
        {/* First bar (part cut out / navy contrast) */}
        <rect x="47" y="74" width="7" height="8" rx="1" fill="#021224" />
        {/* Second bar (green contrast) */}
        <rect x="56" y="60" width="7" height="22" rx="1" fill="#00a86b" />
        {/* Third bar (green contrast, outer stem) */}
        <rect x="65" y="46" width="7" height="36" rx="1" fill="#00a86b" />
      </svg>
      {/* Brand typographic pairing */}
      <div className="flex flex-col justify-center leading-none select-none">
        <div className="text-xl font-extrabold tracking-tight font-sans text-[#021224]">
          PAK<span className="text-[#00a86b]">DATA</span>
        </div>
        <div className="text-[7.5px] font-bold tracking-[0.25em] font-sans text-slate-500 mt-1 uppercase">
          Pakistan in Data
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Custom Re-usable High-Fidelity Charts
// ----------------------------------------------------
interface BarItem {
  label: string;
  value: number;
}

function PremiumBarChart({ data }: { data: BarItem[] }) {
  if (!data || data.length === 0) return null;
  const maxValue = Math.max(...data.map(d => Number(d.value) || 0), 1);
  return (
    <div className="flex flex-col h-full justify-between select-none">
      <div className="flex items-end justify-between h-48 pt-4 pb-2 px-1 border-b border-slate-200 gap-2">
        {data.map((item, idx) => {
          const valNum = Number(item.value) || 0;
          const percentage = Math.min((valNum / maxValue) * 100, 100);
          return (
            <div key={idx} className="flex flex-col items-center group flex-grow relative h-full justify-end">
              {/* Dynamic tooltip on hover */}
              <div className="absolute -top-6 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                {item.value}%
              </div>
              {/* Filled bar segment with low transparent green touch */}
              <div 
                className="w-full bg-[#10b981] hover:bg-[#059669] rounded-t-sm transition-all duration-300 shadow-xs relative"
                style={{ height: `${percentage}%`, minHeight: '4px' }}
              >
                {/* Low opacity inner background */}
                <div className="absolute inset-0 bg-white/10 rounded-t-sm"></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between pt-2 text-[#475569] font-bold text-[9px] sm:text-[10px] gap-1 overflow-x-auto">
        {data.map((item, idx) => (
          <span key={idx} className="flex-grow text-center truncate max-w-[64px]" title={item.label}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface LineItem {
  year: string;
  value: number;
}

function PremiumLineChart({ data }: { data: LineItem[] }) {
  if (!data || data.length === 0) return null;
  const vals = data.map(d => Number(d.value) || 0);
  const maxValue = Math.max(...vals, 1);
  const minValue = Math.min(...vals, 0);
  const valueRange = maxValue - minValue || 1;
  const dataLength = data.length || 1;
  
  return (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Container holding SVG dynamic coordinates projection */}
      <div className="relative h-32 border-b border-slate-200 flex items-end">
        <svg className="absolute inset-x-0 bottom-0 w-full h-full p-2 overflow-visible" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#059669"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((item, idx) => {
              const xPosPct = (idx / Math.max(dataLength - 1, 1)) * 100;
              const yVal = Number(item.value) || 0;
              const yPosPct = 100 - ((yVal - minValue) / valueRange) * 85; 
              return `${idx === 0 ? 4 : xPosPct}%,${yPosPct}%`;
            }).join(" ")}
          />
        </svg>

        {/* Floating circles on top of lines for interactive feel */}
        <div className="absolute inset-x-0 bottom-0 h-full w-full flex justify-between px-2 overflow-visible">
          {data.map((item, idx) => {
            const yVal = Number(item.value) || 0;
            const percentageY = ((yVal - minValue) / valueRange) * 85;
            return (
              <div 
                key={idx} 
                className="relative group flex flex-col items-center" 
                style={{ height: '100%', width: `calc(100% / ${dataLength})` }}
              >
                {/* Floating tooltip */}
                <div 
                  className="absolute bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none"
                  style={{ bottom: `calc(${percentageY}% + 14px)` }}
                >
                  {item.value}
                </div>
                {/* Visual anchor point */}
                <div 
                  className="absolute w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs group-hover:scale-130 transition-transform cursor-pointer"
                  style={{ bottom: `calc(${percentageY}% - 6px)` }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between pt-2 text-[#475569] font-bold text-[10px] gap-1">
        {data.map((item, idx) => (
          <span key={idx} className="w-full text-center truncate" title={item.year}>
            {item.year || item.year}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  // Routing state
  const [activeTab, setActiveTab] = useState<string>("home");

  // Authentication states (simple offline mock)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  // Search queries
  const [homeSearchQuery, setHomeSearchQuery] = useState<string>("");

  // Topic specific selector
  const [activeTopic, setActiveTopic] = useState<string>("economy");

  // DATA TODAY states
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [selectedStat, setSelectedStat] = useState<StatItem | null>(null);

  // FACT CHECK states
  const [checkerClaim, setCheckerClaim] = useState<string>("");
  const [checkerLoading, setCheckerLoading] = useState<boolean>(false);
  const [checkerResult, setCheckerResult] = useState<FactCheckResult | null>(null);
  const [checkerSource, setCheckerSource] = useState<string>("");

  // NEWS states
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // SEARCH PAGE states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [searchEngineSource, setSearchEngineSource] = useState<string>("");

  // COMPARE states
  const [compareMetric, setCompareMetric] = useState<string>("gdp");
  const [compareEntityA, setCompareEntityA] = useState<string>("Pakistan");
  const [compareEntityB, setCompareEntityB] = useState<string>("India");
  const [compareLoading, setCompareLoading] = useState<boolean>(false);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);

  // TOPIC hub states
  const [topicDetails, setTopicDetails] = useState<TopicDetails | null>(null);
  const [loadingTopic, setLoadingTopic] = useState<boolean>(false);

  // RESEARCHES States
  const [researches, setResearches] = useState<ResearchItem[]>([]);
  const [loadingResearches, setLoadingResearches] = useState<boolean>(false);
  const [selectedResearch, setSelectedResearch] = useState<ResearchItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  
  // Submit Research state
  const [newTitle, setNewTitle] = useState<string>("");
  const [newSummary, setNewSummary] = useState<string>("");
  const [newWhatItMeans, setNewWhatItMeans] = useState<string>("");
  const [newPdfName, setNewPdfName] = useState<string>("");
  const [newPdfData, setNewPdfData] = useState<string>(""); // Base64 string
  const [tempFileError, setTempFileError] = useState<string>("");
  const [uploadingResearch, setUploadingResearch] = useState<boolean>(false);

  // DYNAMIC SOURCE REPORT GENERATION state (Click to open premium journal article by source)
  const [sourceArticle, setSourceArticle] = useState<SourceArticle | null>(null);
  const [loadingArticle, setLoadingArticle] = useState<boolean>(false);
  const [articleModalOpen, setArticleModalOpen] = useState<boolean>(false);

  // Sync hash with state routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveTab(hash);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (tabName: string) => {
    setActiveTab(tabName);
    window.location.hash = tabName;
  };

  // Fetch Live Stats Today
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
        if (data.stats.length > 0 && !selectedStat) {
          setSelectedStat(data.stats[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Pakistan News
  const fetchNews = async () => {
    setLoadingNews(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.news) {
        setNewsList(data.news);
        if (data.news.length > 0 && !selectedNews) {
          setSelectedNews(data.news[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNews(false);
    }
  };

  // Fetch Live Research upload directory
  const fetchResearches = async () => {
    setLoadingResearches(true);
    try {
      const res = await fetch("/api/researches");
      const data = await res.json();
      if (data.researches) {
        setResearches(data.researches);
        if (data.researches.length > 0 && !selectedResearch) {
          setSelectedResearch(data.researches[0]);
        }
      }
    } catch (e) {
      console.error("Failed fetching researches:", e);
    } finally {
      setLoadingResearches(false);
    }
  };

  // Fetch Topic details
  const fetchTopicDetailsIdx = async (topic: string) => {
    setLoadingTopic(true);
    try {
      const res = await fetch(`/api/topics/${topic}`);
      const data = await res.json();
      if (data.result) {
        setTopicDetails(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTopic(false);
    }
  };

  // Run initial loadings
  useEffect(() => {
    fetchStats();
    fetchNews();
    fetchResearches();
  }, []);

  useEffect(() => {
    fetchTopicDetailsIdx(activeTopic);
  }, [activeTopic]);

  // Handle Home Search Submit
  const handleHomeSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (homeSearchQuery.trim()) {
      setSearchQuery(homeSearchQuery);
      navigateTo("search");
      triggerSearch(homeSearchQuery);
    }
  };

  // Fact Checker Action
  const handleFactCheck = async (e: FormEvent) => {
    e.preventDefault();
    if (!checkerClaim.trim()) return;
    setCheckerLoading(true);
    setCheckerResult(null);
    try {
      const res = await fetch("/api/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim: checkerClaim })
      });
      const data = await res.json();
      if (data.result) {
        setCheckerResult(data.result);
        setCheckerSource(data.source || "PAKDATA Fact-Check");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckerLoading(false);
    }
  };

  // Search & Insights API Action
  const triggerSearch = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setSearchLoading(true);
    setSearchResult(null);
    try {
      const res = await fetch("/api/search-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToSearch })
      });
      const data = await res.json();
      if (data.result) {
        setSearchResult(data.result);
        setSearchEngineSource(data.source || "Insight Engine");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    triggerSearch(searchQuery);
  };

  // Compare Action
  const handleCompareSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCompareLoading(true);
    setCompareResult(null);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elementA: compareEntityA,
          elementB: compareEntityB,
          metric: compareMetric
        })
      });
      const data = await res.json();
      if (data.result) {
        setCompareResult(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompareLoading(false);
    }
  };

  // DYNAMIC SOURCE REPORT GENERATION (AI synthesis)
  const triggerSourceArticle = async (itemTitle: string, itemDesc: string, itemSource: string, labelVal?: string, valueVal?: string, typeString?: string) => {
    setLoadingArticle(true);
    setArticleModalOpen(true);
    setSourceArticle(null);
    try {
      const res = await fetch("/api/generate-source-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: itemTitle,
          subtitle: itemDesc,
          source: itemSource,
          label: labelVal || "",
          value: valueVal || "",
          type: typeString || "Policy Review"
        })
      });
      const data = await res.json();
      if (data.result) {
        setSourceArticle(data.result);
      }
    } catch (e) {
      console.error("Error synthesizing source report", e);
    } finally {
      setLoadingArticle(false);
    }
  };

  // Mock authorization handler
  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() && passwordInput.trim()) {
      setIsLoggedIn(true);
      setUserEmail(emailInput);
      setShowAuthModal(false);
      setEmailInput("");
      setPasswordInput("");
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserEmail("");
  };

  const applyQuickSearchHint = (hint: string) => {
    setSearchQuery(hint);
    navigateTo("search");
    triggerSearch(hint);
  };

  // PDF file reader handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setTempFileError("Please upload a valid PDF document (.pdf only)");
        setNewPdfName("");
        setNewPdfData("");
        return;
      }
      setTempFileError("");
      setNewPdfName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewPdfData(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Thesis Research handler
  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setAuthMode("signup");
      setShowAuthModal(true);
      return;
    }
    if (!newTitle.trim() || !newSummary.trim() || !newWhatItMeans.trim()) {
      alert("Please fill in all mandatory fields: Title, Summary, and 'What is it for?'");
      return;
    }
    if (!newPdfName || !newPdfData) {
      alert("Please upload a PDF document of your thesis.");
      return;
    }
    
    setUploadingResearch(true);
    try {
      const res = await fetch("/api/researches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          author: userEmail,
          summary: newSummary,
          whatItMeans: newWhatItMeans,
          pdfName: newPdfName,
          pdfData: newPdfData
        })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh live listings from server
        await fetchResearches();
        // Reset form variables
        setNewTitle("");
        setNewSummary("");
        setNewWhatItMeans("");
        setNewPdfName("");
        setNewPdfData("");
        setShowUploadModal(false);
      } else {
        alert("Failed to submit thesis. " + (data.error || ""));
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Network error occurred during thesis submission.");
    } finally {
      setUploadingResearch(false);
    }
  };

  // Download PDF Manuscript handler
  const handleDownloadPdf = (paper: ResearchItem) => {
    if (!paper.pdfData) {
      alert("No PDF manuscript file associated with this article.");
      return;
    }
    if (paper.pdfData.startsWith("placeholder_")) {
      // Create readable text manuscript representation of preseeded content
      const mockText = `--- PAKISTAN DATA RESEARCH NETWORK ---\n\nTitle: ${paper.title.toUpperCase()}\nAuthor: ${paper.author}\nDate of submission: ${paper.date}\n\nManuscript PDF Segment Code: ${paper.pdfData}\n\n1. Abstract & Brief Summary:\n${paper.summary}\n\n2. Target Objectives (What is it for):\n${paper.whatItMeans}\n\nDisclaimer: This document is a text render generated from the PakData preseeded academic database.`;
      const blob = new Blob([mockText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${paper.pdfName || "manuscript"}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Real file downloaded instantly
      const a = document.createElement("a");
      a.href = paper.pdfData;
      a.download = paper.pdfName || `${paper.title.replace(/\s+/g, "_").toLowerCase()}.pdf`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 scroll-smooth flex flex-col justify-between">
      
      {/* BRAND HEADER BAR (Styled directly matching Statista premium white navigation) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-22 py-2">
            
            {/* Logo and Tag in left margin */}
            <div className="flex items-center cursor-pointer" onClick={() => navigateTo("home")}>
              <PakDataLogo />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button 
                onClick={() => navigateTo("home")}
                className={`px-3 py-2 rounded-md text-xs font-bold tracking-normal transition-all duration-150 ${activeTab === 'home' ? 'bg-[#10b98115] text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Statistics
              </button>
              <button 
                onClick={() => navigateTo("data-today")}
                className={`px-3 py-2 rounded-md text-xs font-bold tracking-normal transition-all duration-150 ${activeTab === 'data-today' ? 'bg-[#10b98115] text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Daily Data
              </button>
              <button 
                onClick={() => navigateTo("fact-checker")}
                className={`px-3 py-2 rounded-md text-xs font-bold tracking-normal transition-all duration-150 ${activeTab === 'fact-checker' ? 'bg-[#10b98115] text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Fact
              </button>
              <button 
                onClick={() => navigateTo("news")}
                className={`px-3 py-2 rounded-md text-xs font-bold tracking-normal transition-all duration-150 ${activeTab === 'news' ? 'bg-[#10b98115] text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                News
              </button>
              <button 
                onClick={() => navigateTo("search")}
                className={`px-3 py-2 rounded-md text-xs font-bold tracking-normal transition-all duration-150 ${activeTab === 'search' ? 'bg-[#10b98115] text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Search & Insights
              </button>
              <button 
                onClick={() => navigateTo("compare")}
                className={`px-3 py-2 rounded-md text-xs font-bold tracking-normal transition-all duration-150 ${activeTab === 'compare' ? 'bg-[#10b98115] text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Compare
              </button>
              <button 
                onClick={() => navigateTo("topics")}
                className={`px-3 py-2 rounded-md text-xs font-bold tracking-normal transition-all duration-150 ${activeTab === 'topics' ? 'bg-[#10b98115] text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Topics
              </button>
              <button 
                onClick={() => navigateTo("researches")}
                className={`px-3 py-2 rounded-md text-xs font-bold tracking-normal transition-all duration-150 ${activeTab === 'researches' ? 'bg-[#10b98115] text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Researches
              </button>
            </nav>

            {/* Right Side Info, Access Pricing Button & Mock Login */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => alert("Premium access is complimentary for standard policy analysis.")}
                className="hidden sm:inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-sm shadow-xs tracking-normal"
              >
                Prices & Access
              </button>

              <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-bold hidden lg:inline">PK</span>
              </div>

              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <span className="hidden md:inline-block text-xs font-bold text-slate-700 max-w-[120px] truncate">
                    {userEmail}
                  </span>
                  <button 
                    onClick={handleSignOut}
                    className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-250 rounded-sm px-3.5 py-2 hover:bg-slate-50 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer Panel */}
        <div className="lg:hidden flex overflow-x-auto py-2 px-4 space-x-1 bg-slate-50 border-t border-slate-200 scrollbar-none">
          {[
            { id: "home", label: "Statistics", icon: HomeIcon },
            { id: "data-today", label: "Daily Data", icon: Database },
            { id: "fact-checker", label: "Fact", icon: ShieldCheck },
            { id: "news", label: "News", icon: Newspaper },
            { id: "search", label: "Search & Insights", icon: Search },
            { id: "compare", label: "Compare", icon: GitCompare },
            { id: "topics", label: "Topics", icon: Layers },
            { id: "researches", label: "Researches", icon: BookOpen }
          ].map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold whitespace-nowrap transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-white border border-slate-200'}`}
              >
                <IconComp className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* CORE FRAMEWORK WORKSPACE */}
      <main id="main-content" className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ==============================================
            TAB 1: STATISTICS (LANDING SEARCH PAGE) 
           ============================================== */}
        {activeTab === "home" && (
          <div className="space-y-12 animate-fadeIn py-6">
            
            {/* HERO BLOCK (Strictly styled like Statista dark banner, but converted to requested light mode with low transparent green background) */}
            <div className="rounded-sm border border-emerald-500/10 bg-emerald-500/5 px-6 py-16 sm:py-20 text-center space-y-8 max-w-5xl mx-auto">
              
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#002b17] font-sans">
                  See Pakistan in numbers.
                </h1>
                <p className="text-base sm:text-lg text-emerald-950/70 font-sans max-w-2xl mx-auto">
                  Insights and facts across 10 sectors, 150+ districts and 240 million population.
                </p>
              </div>

              {/* GIANT CENTERED STATISTA SEARCH BOX */}
              <form onSubmit={handleHomeSearchSubmit} className="max-w-2xl mx-auto relative">
                <div className="flex flex-col sm:flex-row shadow-md rounded-sm overflow-hidden border border-slate-200">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <Search className="w-5 h-5 text-slate-400" />
                    </span>
                    <input 
                      type="text"
                      value={homeSearchQuery}
                      onChange={(e) => setHomeSearchQuery(e.target.value)}
                      placeholder="Find statistics, forecasts and reports..."
                      className="w-full pl-12 pr-4 py-4.5 bg-white text-slate-900 focus:outline-none placeholder-slate-450 text-sm leading-relaxed"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4.5 text-sm font-bold tracking-wide transition-colors flex items-center justify-center gap-2 shrink-0 rounded-r-sm"
                  >
                    PAKDATA Search <Search className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Popular Statista-style search tag widgets */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-emerald-900/80">
                  <span className="font-bold">Trending statistics:</span>
                  {[
                    "Poverty in Sindh",
                    "Inflation Rate",
                    "GDP Pakistan",
                    "Agricultural Yields",
                    "Climate change impact",
                    "Solarization",
                    "Water Stress"
                  ].map((example) => (
                    <button
                      type="button"
                      key={example}
                      onClick={() => applyQuickSearchHint(example)}
                      className="px-3 py-1.5 rounded-sm border border-emerald-500/10 bg-white text-emerald-800 hover:bg-emerald-500/10 transition-all font-semibold"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {/* KEY INDICATOR METRICS GRID */}
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-500">
                  Key Country Indicators Today
                </h3>
                <button onClick={() => navigateTo("data-today")} className="text-xs font-bold text-emerald-700 hover:underline flex items-center">
                  See live registry <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "GDP Estimate (FY2025/26)", value: "$340.6 Billion", change: "-0.5%", trend: "down", source: "State Bank of Pakistan", desc: "National output challenges under macro adjustments." },
                  { title: "Inflation Rate (CPI)", value: "11.8%", change: "-2.4%", trend: "down", source: "Bureau of Statistics", desc: "Consumer pressure easing down from multi-year peaks." },
                  { title: "Poverty Rate (WB)", value: "37.5%", change: "+1.2%", trend: "up", source: "World Bank Data", desc: "Population living beneath $3.65 daily threshold." },
                  { title: "National Literacy", value: "58.9%", change: "+0.4%", trend: "up", source: "Economic Survey", desc: "Literacy patterns divided by rural-urban boundaries." },
                ].map((ind, i) => (
                  <div
                    key={ind.title}
                    onClick={() => triggerSourceArticle(ind.title, ind.desc, ind.source, ind.title, ind.value, "Economic Index")}
                    className="bg-white border border-slate-200 hover:border-emerald-500/30 p-5 rounded-sm cursor-pointer hover:shadow-xs group transition-all"
                  >
                    <div className="flex justify-between items-start text-[11px] font-bold text-slate-400">
                      <span className="uppercase">{ind.source}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] flex items-center gap-0.5 font-sans ${ind.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : ind.trend === 'down' ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-700'}`}>
                        {ind.trend === "up" ? "▲" : "▼"} {ind.change}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <h4 className="text-2xl font-black font-sans text-slate-900 tracking-tight">{ind.value}</h4>
                      <p className="text-xs font-bold text-slate-700 mt-1">{ind.title}</p>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{ind.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700 opacity-80 group-hover:opacity-100">
                      <span>Click to build deep report</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTOR SPOTLIGHT BOX (Statista elegant promotion) */}
            <div className="rounded-sm border border-slate-200 p-6 bg-white grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#10b981] bg-[#10b98115] px-2 py-0.5 rounded-sm">
                  Active Spotlight
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  On-Demand AI Policy Verification & Article Synthesis
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every statistic or news block in PAKDATA is backed by dynamic editorial compiling. Click any card inside our system to generate a fully fleshed, formal economic journal essay cross-checking the causal layers of national trends.
                </p>
              </div>
              <div className="md:col-span-1 text-right">
                <button
                  onClick={() => triggerSourceArticle("National Water Stress Outlook", "Spatial hydrology assessment on Indus Basin channels.", "Indus River System Authority (IRSA)", "Water stress metrics", "78/100", "Hydrological Policy")}
                  className="w-full md:w-auto bg-emerald-600 text-white text-xs font-bold px-5 py-3 rounded-sm hover:bg-emerald-700 transition-colors uppercase tracking-wider"
                >
                  Generate Test Article
                </button>
              </div>
            </div>

            {/* QUICK SECTORS LAUNCHER */}
            <div className="space-y-4">
              <h4 className="text-sm uppercase font-extrabold tracking-wider text-slate-500">
                Explore Content by Industry Topic
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: "economy", name: "Economy", desc: "Finance & Trade GDP" },
                  { id: "education", name: "Education", desc: "Literacy & Schools" },
                  { id: "health", name: "Healthcare", desc: "Nutrition & Clinics" },
                  { id: "climate", name: "Climate Risk", desc: "Vulnerability Index" },
                  { id: "poverty", name: "Poverty", desc: "Livelihoods & BISP" },
                  { id: "population", name: "Population", desc: "Youth & Census" }
                ].map((sec) => (
                  <div
                    key={sec.id}
                    onClick={() => { setActiveTopic(sec.id); navigateTo("topics"); }}
                    className="bg-[#10b98108] hover:bg-[#10b98115] border border-emerald-500/10 p-4 rounded-sm text-center cursor-pointer transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-900 block">{sec.name}</span>
                    <span className="text-[10px] text-emerald-800 font-semibold block mt-1">{sec.desc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==============================================
            TAB 2: DAILY DATA (LIVE MACRO SNAPSHOTS)
           ============================================== */}
        {activeTab === "data-today" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Macroeconomic Databank
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                A verified database indexing key socio-economic indicators. Select any panel below to view metadata and trigger detailed journal research reports.
              </p>
            </div>

            {loadingStats && stats.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="ml-3 text-sm font-bold">Querying SBP registry...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Indicators grid */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stats.map((stat) => {
                    const isSelected = selectedStat?.id === stat.id;
                    const isUp = stat.trend === "up";
                    const isDown = stat.trend === "down";
                    
                    return (
                      <div
                        key={stat.id}
                        onClick={() => setSelectedStat(stat)}
                        className={`p-5 rounded-sm border cursor-pointer transition-all ${isSelected ? 'ring-2 ring-emerald-600 bg-[#10b98108]' : 'border-slate-200 bg-white hover:border-emerald-500/30'}`}
                      >
                        <div className="flex justify-between items-start text-xs font-bold text-slate-400">
                          <span>{stat.source}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isUp ? 'bg-emerald-50 text-emerald-700' : isDown ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-700'}`}>
                            {stat.change}
                          </span>
                        </div>
                        <div className="mt-3">
                          <span className="text-3xl font-black text-[#002f1a] font-sans">
                            {stat.value}
                          </span>
                          <h4 className="text-xs font-bold text-slate-700 mt-1">
                            {stat.label}
                          </h4>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Updated: {stat.lastUpdated}</span>
                          <span className="text-emerald-700 font-bold group-hover:underline">Verify details</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Micro audit panel */}
                <div className="lg:col-span-1">
                  {selectedStat ? (
                    <div className="border border-slate-200 rounded-sm p-6 bg-white sticky top-24 space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                          Source Information & Metadata
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-2">
                          {selectedStat.label}
                        </h3>
                        <div className="text-3xl font-black text-emerald-600 mt-1 font-sans">
                          {selectedStat.value}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {selectedStat.description}
                      </p>

                      <div className="bg-[#10b98108] border border-emerald-500/10 p-4 rounded-sm space-y-3">
                        <div className="flex justify-between text-xs font-bold">
                          <span>Official Registry Source</span>
                          <span className="text-emerald-800">{selectedStat.source}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                          <span>Registry Status</span>
                          <span className="text-slate-600">Active / Verified</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                          <span>Last Assessment</span>
                          <span className="text-slate-605">{selectedStat.lastUpdated}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => triggerSourceArticle(selectedStat.label, selectedStat.description, selectedStat.source, selectedStat.label, selectedStat.value, "Economic Registry Assessment")}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
                      >
                        Generate Detailed Report
                      </button>
                    </div>
                  ) : (
                    <div className="border border-slate-250 border-dashed rounded-sm p-8 bg-white text-center text-xs opacity-65 text-slate-500 font-bold">
                      Select an economic card representation to reveal deep report assessments.
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* ==============================================
            TAB 3: FACT (FACT VERIFICATION DESK)
           ============================================== */}
        {activeTab === "fact-checker" && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                Fact Checking Desk
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Checks statements, media claims, and socioeconomic claims floating on internet forums. Our verification model queries national planning catalogs and regulatory archives to provide a consolidated truth score.
              </p>
            </div>

            <div className="border border-slate-200 rounded-sm p-6 bg-white space-y-5">
              <form onSubmit={handleFactCheck} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="claim-input" className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Input Claim Statement to Verify
                  </label>
                  <textarea 
                    id="claim-input"
                    rows={3}
                    value={checkerClaim}
                    onChange={(e) => setCheckerClaim(e.target.value)}
                    placeholder="e.g., Inflation is 5% in Pakistan, or Pakistan literacy rate is 90%..."
                    className="w-full p-4 rounded-sm border border-slate-200 bg-slate-50 font-sans text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    required
                  ></textarea>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <span className="font-bold text-slate-400 self-center">Suggested topics:</span>
                    <button 
                      type="button"
                      onClick={() => setCheckerClaim("Pakistan literacy rate is 90%")}
                      className="px-2.5 py-1.5 rounded-sm bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:border-emerald-500/20"
                    >
                      Literacy 90%
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCheckerClaim("Inflation is 5% in Pakistan")}
                      className="px-2.5 py-1.5 rounded-sm bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:border-emerald-500/20"
                    >
                      Inflation 5%
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCheckerClaim("Pakistan nominal GDP estimate is 340 Billion USD")}
                      className="px-2.5 py-1.5 rounded-sm bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:border-emerald-500/20"
                    >
                      GDP 340B
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={checkerLoading}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {checkerLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Assessing metrics...
                      </>
                    ) : (
                      "Check Claim"
                    )}
                  </button>
                </div>
              </form>

              {/* FACT RESULT PANEL */}
              {checkerResult && (
                <div className="mt-6 border-t border-slate-150 pt-6 space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-sm border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold uppercase text-slate-400">Archival consensus:</span>
                      {checkerResult.status === "True" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-sm text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3.5 h-3.5" /> TRUE
                        </span>
                      ) : checkerResult.status === "False" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-sm text-xs font-bold bg-rose-100 text-rose-800">
                          <XCircle className="w-3.5 h-3.5" /> FALSE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-sm text-xs font-bold bg-amber-100 text-amber-800">
                          <Info className="w-3.5 h-3.5" /> PARTIALLY TRUE
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{checkerSource}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Correct Consolidated Data:</h4>
                    <p className="text-base font-bold text-emerald-900 bg-emerald-500/5 px-4 py-3 rounded-sm border border-emerald-500/10">
                      {checkerResult.correctData}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Verification Breakdown:</h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {checkerResult.explanation}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-bold">
                    <span>Cited Base: {checkerResult.source}</span>
                    <button 
                      onClick={() => triggerSourceArticle(checkerClaim, checkerResult.explanation, checkerResult.source, "Fact Verification Verdict", checkerResult.correctData, "Fact Verification Assessment")}
                      className="text-emerald-700 hover:underline flex items-center gap-0.5"
                    >
                      Retrieve Verified Source Article <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==============================================
            TAB 4: NEWS DESK (SECTOR AFFAIRS SUMMARY)
           ============================================== */}
        {activeTab === "news" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                National Sector News Desk
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Major institutional changes and socio-climatic updates. Click any headline below to load full analytical essays generated on real statistical bases.
              </p>
            </div>

            {loadingNews && newsList.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="ml-3 text-sm font-bold">Connecting Dawn Policy Desk...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* News list */}
                <div className="lg:col-span-2 space-y-4">
                  {newsList.map((news) => {
                    const isSelected = selectedNews?.id === news.id;
                    return (
                      <div
                        key={news.id}
                        onClick={() => setSelectedNews(news)}
                        className={`p-5 rounded-sm border cursor-pointer transition-all ${isSelected ? 'ring-2 ring-emerald-600 bg-[#10b98108]' : 'border-slate-200 bg-white hover:border-emerald-500/30'}`}
                      >
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-sm uppercase tracking-wider">{news.category}</span>
                          <span>{news.date} • {news.source}</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-2 hover:text-emerald-800 transition-colors">
                          {news.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2">
                          {news.summary}
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-emerald-700 font-bold opacity-80 group-hover:opacity-100">
                          <span>Verified Policy implications</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* News detail & summary portal */}
                <div className="lg:col-span-1">
                  {selectedNews ? (
                    <div className="border border-slate-200 rounded-sm p-6 bg-white sticky top-24 space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#10b981] bg-[#10b98115] px-2 py-0.5 rounded-sm">
                          Policy Summary
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-2 font-sans leading-snug">
                          {selectedNews.title}
                        </h3>
                        <div className="text-xs font-bold text-slate-400 mt-1">
                          {selectedNews.date} • Published by {selectedNews.source}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Headline facts:</h4>
                          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-semibold mt-1">
                            {selectedNews.summary}
                          </p>
                        </div>

                        <div className="bg-emerald-500/5 p-4 rounded-sm border border-emerald-500/10 space-y-1">
                          <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-widest">National Development Cost:</h4>
                          <p className="text-xs text-emerald-900 leading-relaxed font-semibold">
                            {selectedNews.whatItMeans}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => triggerSourceArticle(selectedNews.title, selectedNews.summary, selectedNews.source, "News Desk Event", "", "Sector News Analysis")}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
                      >
                        Compile Complete Policy Document
                      </button>
                    </div>
                  ) : (
                    <div className="border border-slate-200 border-dashed rounded-sm p-8 bg-white text-center text-xs opacity-65 font-bold text-slate-400">
                      Select any news update on the left to reveal dynamic impact calculators.
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* ==============================================
            TAB 5: SEARCH & INSIGHTS (ANALYTICS ENGINE)
           ============================================== */}
        {activeTab === "search" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Interactive Analytical Engine
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Find hidden correlations in census, climate, and provincial registries of Pakistan. Returns real charts and citation lines.
              </p>
            </div>

            <div className="border border-slate-200 rounded-sm p-6 bg-white space-y-6">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask specifically like: Poverty in Punjab vs Sindh, or water storage capacity..."
                  className="flex-grow p-3.5 rounded-sm border border-slate-200 font-sans text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {searchLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Query Database"}
                </button>
              </form>

              {searchLoading && (
                <div className="flex justify-center items-center py-16">
                  <RefreshCw className="w-8 h-8 text-emerald-605 animate-spin" />
                  <span className="ml-3 text-sm font-bold">Scanning Federal catalogs...</span>
                </div>
              )}

              {/* SEARCH RESULTS DISPLAY WITH CHARTS */}
              {searchResult && (
                <div className="space-y-6 pt-4 border-t border-slate-150">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left details */}
                    <div className="md:col-span-1 space-y-4">
                      <div className="p-4 bg-emerald-500/5 rounded-sm border border-emerald-500/10">
                        <h4 className="text-xs font-extrabold uppercase text-slate-400">Database Index Metric:</h4>
                        <p className="text-lg font-black text-emerald-900 mt-1">{searchResult.keyNumbers}</p>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold uppercase text-slate-400">Contextual causality:</h4>
                        <p className="text-xs sm:text-sm text-slate-650 font-medium leading-relaxed">
                          {searchResult.simpleExplanation}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-extrabold uppercase text-slate-400">Authority Registers Cited:</h4>
                        <div className="grid grid-cols-1 gap-1.5 mt-1.5">
                          {searchResult.sources.map((src, idx) => (
                            <a 
                              key={idx}
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
                            >
                              <BookOpen className="w-3 h-3 text-emerald-650" /> {src.name} <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Chart Panel */}
                    <div className="md:col-span-2 space-y-2">
                      <h4 className="text-xs font-extrabold uppercase text-slate-400">Provincial or Seasonal Distribution:</h4>
                      <div className="h-64 border border-slate-200 rounded-sm p-4 bg-slate-50">
                        <PremiumBarChart data={searchResult.chartData} />
                      </div>
                    </div>

                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-sm">
                    <h4 className="text-xs font-extrabold uppercase text-slate-400">Editorial Summary:</h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold mt-1">
                      {searchResult.aiSummary}
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 text-right">
                      <button
                        onClick={() => triggerSourceArticle(searchQuery, searchResult.aiSummary, searchResult.sources[0]?.name || "Analytics Library", "Custom Search Query", searchResult.keyNumbers, "Dynamic Database Query")}
                        className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                      >
                        Generate Detailed Report <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==============================================
            TAB 6: COMPARE (BENCHMARK INTERVENE)
           ============================================== */}
        {activeTab === "compare" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Country Comparison Desk
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Compare development parameters between Pakistan and regional competitors like India, Bangladesh, or other developing economies.
              </p>
            </div>

            <div className="border border-slate-200 rounded-sm p-6 bg-white space-y-6">
              <form onSubmit={handleCompareSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-400">Benchmark Index</label>
                  <select 
                    value={compareMetric} 
                    onChange={(e) => setCompareMetric(e.target.value)}
                    className="w-full p-2.5 rounded-sm border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="gdp">GDP Scale (Billion USD)</option>
                    <option value="literacy">Literacy Rate (%)</option>
                    <option value="inflation">Consumer CPI Inflation (%)</option>
                    <option value="poverty">Poverty Ratio (%)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-400">Target Entity A</label>
                  <input 
                    type="text" 
                    value={compareEntityA} 
                    onChange={(e) => setCompareEntityA(e.target.value)}
                    className="w-full p-2.5 rounded-sm border border-slate-200 bg-white font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-400">Compare Entity B</label>
                  <select 
                    value={compareEntityB} 
                    onChange={(e) => setCompareEntityB(e.target.value)}
                    className="w-full p-2.5 rounded-sm border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="India">India</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Vietnam">Vietnam</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={compareLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2"
                >
                  {compareLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Run Matrix"}
                </button>
              </form>

              {compareLoading && (
                <div className="flex justify-center items-center py-16">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                  <span className="ml-3 text-sm font-bold font-mono">Drawing country vectors...</span>
                </div>
              )}

              {compareResult && (
                <div className="space-y-6 pt-4 border-t border-slate-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Visual Comparison Chart */}
                    <div className="border border-slate-200 rounded-sm p-4 bg-slate-50 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Metric Scale: {compareResult.metricLabel}</h4>
                      
                      <div className="grid grid-cols-2 gap-4 pb-4">
                        <div className="bg-white p-4 border border-slate-100 rounded-sm">
                          <span className="text-[10px] font-extrabold uppercase text-slate-450">{compareEntityA}</span>
                          <p className="text-3xl font-black text-slate-900 mt-1">{compareResult.valA}</p>
                        </div>
                        <div className="bg-white p-4 border border-slate-100 rounded-sm">
                          <span className="text-[10px] font-extrabold uppercase text-slate-450">{compareEntityB}</span>
                          <p className="text-3xl font-black text-[#059669] mt-1">{compareResult.valB}</p>
                        </div>
                      </div>

                      <div className="h-44 bg-slate-50 border border-slate-200 p-4 rounded-sm">
                        <PremiumBarChart data={compareResult.chart.map(c => ({ label: c.name, value: Number(c.value) || 0 }))} />
                      </div>
                    </div>

                    {/* Explanatory insights */}
                    <div className="space-y-4">
                      <div className="bg-[#10b98108] border border-emerald-500/10 p-5 rounded-sm">
                        <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Comparative causality:</h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold mt-2">
                          {compareResult.aiSummary}
                        </p>
                      </div>

                      <div className="p-4 border border-slate-200 rounded-sm text-xs space-y-2">
                        <h5 className="font-extrabold uppercase text-slate-400">National intervention recommendation:</h5>
                        <p className="text-slate-600 font-medium">
                          To minimize this developmental delta, Pakistan must focus on expanding digital literacy, decreasing power-sector circular debt, and securing green climate finance channels.
                        </p>
                      </div>

                      <div className="text-right">
                        <button
                          onClick={() => triggerSourceArticle(`Comparative Assessment: ${compareEntityA} vs ${compareEntityB}`, `Metric: ${compareMetric}`, "National Benchmark Unit", compareMetric, `A: ${compareResult.valA}, B: ${compareResult.valB}`, "National Competitiveness Review")}
                          className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                        >
                          Generate Comparative Study Document <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==============================================
            TAB 7: TOPICS (CURATED INDUSTRY CABINET)
           ============================================== */}
        {activeTab === "topics" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Curated Sector Directories
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Select from standard national divisions to review historical growth plots, systemic narratives, and policy interventions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Directory rails */}
              <div className="lg:col-span-1 space-y-2">
                {[
                  { id: "economy", name: "Macro Economy" },
                  { id: "education", name: "Education & Literacy" },
                  { id: "health", name: "Health Infrastructure" },
                  { id: "climate", name: "Climate Risk & Water" },
                  { id: "poverty", name: "Poverty & BISP" },
                  { id: "population", name: "Youth Bulge & Census" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTopic(item.id)}
                    className={`w-full text-left p-3 rounded-sm font-bold text-xs transition-colors border ${activeTopic === item.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Main Directory Area */}
              <div className="lg:col-span-3">
                {loadingTopic ? (
                  <div className="flex justify-center items-center py-20 bg-white border border-slate-200 rounded-sm">
                    <RefreshCw className="w-8 h-8 text-emerald-605 animate-spin" strokeWidth={2.5} />
                    <span className="ml-3 text-xs font-bold uppercase tracking-wider text-slate-500">Retrieving sector registry...</span>
                  </div>
                ) : (
                  topicDetails && (
                    <div className="border border-slate-250 bg-white p-6 space-y-6 rounded-sm">
                      
                      <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#10b981] bg-[#10b98115] px-2 py-0.5 rounded-sm">
                            Sector Folder
                          </span>
                          <h3 className="text-xl font-black text-slate-900 mt-2 font-sans">
                            {topicDetails.title}
                          </h3>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase font-mono">DIR: {activeTopic.toUpperCase()}</span>
                      </div>

                      {/* Top micro metric summaries */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {topicDetails.keyStats.map((st, index) => (
                          <div key={index} className="bg-slate-50 p-4 border border-slate-150 rounded-sm">
                            <span className="text-[10px] uppercase font-extrabold text-slate-450 tracking-wider block">{st.label}</span>
                            <span className="text-lg font-black text-slate-900 block mt-1 font-sans">{st.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Sector breakdown narration and chart visualizer */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="space-y-4">
                          <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Historical parameters:</h4>
                          <div className="h-44 border border-slate-200 bg-slate-50 p-3 rounded-sm select-none">
                            <PremiumLineChart data={topicDetails.chartData.map(c => ({ year: String(c.year), value: Number(c.value) || 0 }))} />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Analytical Assessment:</h4>
                          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-semibold">
                            {topicDetails.explanation}
                          </p>
                        </div>

                      </div>

                      <div className="bg-emerald-500/5 p-4 rounded-sm border border-emerald-500/10">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#10b981] block">Sector gold-standard leverage point:</span>
                        <p className="text-xs sm:text-sm text-emerald-900 font-bold leading-relaxed mt-1">
                          {topicDetails.insight}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-150 text-right">
                        <button
                          onClick={() => triggerSourceArticle(topicDetails.title, topicDetails.explanation, "Planning Commission of Pakistan", "Sector Assessment", topicDetails.keyStats[0]?.value || "", "Sector Compendium Document")}
                          className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                        >
                          Synthesize Extensive Sector Policy Essay <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  )
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==============================================
            TAB 8: RESEARCHES (COLLABORATIVE PAPERS & THESES)
           ============================================== */}
        {activeTab === "researches" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top info and upload action */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900">
                  Pakistan Research Repository
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  A collaborative digital library of academic theses, policy papers, and economic studies on Pakistan.
                </p>
              </div>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setAuthMode("signup");
                    setShowAuthModal(true);
                  } else {
                    setShowUploadModal(true);
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-sm shadow-xs flex items-center gap-2 uppercase tracking-wider whitespace-nowrap"
              >
                <Upload className="w-4 h-4" /> Submit Research Paper
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Thesis directories list */}
              <div className="lg:col-span-1 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Available Manuscripts ({researches.length})
                </span>
                
                {loadingResearches ? (
                  <div className="py-20 text-center text-slate-450">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
                    <span className="text-xs font-bold block mt-2">Loading manuscripts...</span>
                  </div>
                ) : researches.length === 0 ? (
                  <div className="bg-white border border-slate-200 p-8 rounded-sm text-center text-slate-500">
                    No articles found. Be the first to upload yours!
                  </div>
                ) : (
                  researches.map((paper) => {
                    const isSelected = selectedResearch?.id === paper.id;
                    return (
                      <div
                        key={paper.id}
                        onClick={() => setSelectedResearch(paper)}
                        className={`p-4 border rounded-sm cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-emerald-600 bg-emerald-50/20 shadow-xs' 
                            : 'border-slate-200 bg-white hover:border-slate-350'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100/40 px-1.5 py-0.5 rounded">
                          PDF Paper
                        </span>
                        <h4 className="font-bold text-slate-900 mt-2 text-sm leading-snug line-clamp-2">
                          {paper.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-bold mt-1">
                          By: {paper.author}
                        </p>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                          {paper.summary}
                        </p>
                        <div className="text-[10px] text-slate-400 font-bold flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                          <span>{paper.date}</span>
                          <span className="text-emerald-700">Read manuscript &rarr;</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: High Fidelity Manuscript PDF Simulation Reader */}
              <div className="lg:col-span-2">
                {selectedResearch ? (
                  <div className="bg-[#fafafa] border border-slate-200 rounded-sm p-6 md:p-8 space-y-6 shadow-xs relative">
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadPdf(selectedResearch)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-sm flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" /> Download PDF Manuscript
                      </button>
                    </div>

                    <div className="border-b-2 border-slate-300 pb-4 pr-32">
                      <span className="text-xs font-extrabold uppercase text-emerald-800 font-mono tracking-widest block">
                        Academic Manuscript
                      </span>
                      <h3 className="text-xl md:text-2xl font-black font-serif text-slate-900 mt-1 leading-snug">
                        {selectedResearch.title}
                      </h3>
                      <div className="text-xs text-slate-500 mt-2 font-bold flex flex-wrap gap-x-4">
                        <span>Author: {selectedResearch.author}</span>
                        <span>•</span>
                        <span>Date Published: {selectedResearch.date}</span>
                        {selectedResearch.pdfName && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700">Digital ID (PDF): {selectedResearch.pdfName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Simulation Abstract block */}
                    <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-2">
                      <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider font-sans">
                        Abstract & Summary
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans first-letter:text-2xl first-letter:font-black first-letter:text-emerald-800">
                        {selectedResearch.summary}
                      </p>
                    </div>

                    {/* "What is it for" target Objective sector */}
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-sm space-y-2">
                      <h4 className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider font-sans font-bold">
                        Research Objective & Application (What is it for)
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-semibold">
                        {selectedResearch.whatItMeans}
                      </p>
                    </div>

                    {/* Simulated PDF document pages design */}
                    <div className="border-t border-slate-200 pt-6 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider font-sans">
                        Manuscript Preview (3 Pages)
                      </h4>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="border border-slate-200 bg-white p-3 shadow-2xs aspect-[1/1.4] text-[6px] text-slate-400 overflow-hidden relative select-none">
                          <div className="absolute top-2 right-2 font-bold text-slate-350">Page 1</div>
                          <div className="text-[8px] font-black font-serif text-slate-700 border-b pb-1 mb-2">I. INTRODUCTION</div>
                          <p className="leading-[1.4] line-clamp-10 text-slate-500 mt-2">
                            The spatial metrics of socio-economic progress in Pakistan indicate high disparities. This study seeks to explore the primary variables underpinning growth across multi-tiered regional units...
                          </p>
                          <div className="border-t pt-1 mt-4 text-[4.5px] text-emerald-700 font-bold">PAKDATA REGISTER REPOSIT</div>
                        </div>

                        <div className="border border-slate-200 bg-white p-3 shadow-2xs aspect-[1/1.4] text-[6px] text-slate-400 overflow-hidden relative select-none">
                          <div className="absolute top-2 right-2 font-bold text-slate-350">Page 2</div>
                          <div className="text-[8px] font-black font-serif text-slate-700 border-b pb-1 mb-2">II. EMPIRICAL MATRIX</div>
                          <div className="grid grid-cols-2 gap-1 my-1.5 py-1 bg-slate-50 border">
                            <div className="font-bold pl-1 text-[5px]">Sector Var A:</div>
                            <div className="text-right pr-1 text-emerald-700">74.5% index</div>
                            <div className="font-bold pl-1 text-[5px]">Monsoon Std.D:</div>
                            <div className="text-right pr-1 text-emerald-700">0.052 deviation</div>
                          </div>
                          <p className="leading-[1.4] line-clamp-5 mt-1">
                            By deploying linear regression frameworks and mapping geographical GIS parameters, coefficients reveal statistically significant shifts following intervention periods.
                          </p>
                        </div>

                        <div className="border border-slate-200 bg-white p-3 shadow-2xs aspect-[1/1.4] text-[6px] text-slate-400 overflow-hidden relative select-none">
                          <div className="absolute top-2 right-2 font-bold text-slate-350">Page 3</div>
                          <div className="text-[8px] font-black font-serif text-slate-700 border-b pb-1 mb-2">III. POLICY BRIEF</div>
                          <p className="leading-[1.4] line-clamp-10 text-slate-500">
                            Based on our calculations, decentralizing microgrid arrays and ensuring direct nutritional cash disbursement programs directly correlates to elevated human development index parameters locally. We recommend immediate legislative adoptions across local municipal frameworks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-sm p-12 text-center text-slate-450 h-full flex flex-col justify-center items-center">
                    <BookOpen className="w-12 h-12 text-slate-300 stroke-[1.2] mb-3" />
                    <h3 className="font-bold text-slate-700 text-sm">No Manuscript Selected</h3>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      Choose any paper on the left to read its full abstract, research objective, and visualize the peer-reviewed digital manuscript pages.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER COOPERATIVE */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500 text-center font-bold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div>
            pakdata © 2026 • Verified data library of Pakistan.
          </div>
          <div className="text-[10px] uppercase tracking-widest text-emerald-700 opacity-60">
            Verified Data Pipeline • Real-Time Fact Assessor
          </div>
        </div>
      </footer>

      {/* ==============================================
          1. DYNAMIC ARTICLE READER OVERLAY (AI Article modal)
         ============================================== */}
      {articleModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fafdfc] border border-slate-250 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-xl p-6 md:p-10 space-y-8 animate-scaleIn select-text">
            
            {/* Header: Magazine visual accent */}
            <div className="flex justify-between items-center border-b-[3px] border-emerald-800 pb-2.5">
              <span className="text-xs font-extrabold tracking-widest text-emerald-800 uppercase font-serif">
                {loadingArticle ? "COMPILING SYSTEMIC DOCUMENT" : "ARTICLE AND REPORT GENERATOR"}
              </span>
              <button 
                onClick={() => setArticleModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 px-3 py-1 font-bold text-sm bg-slate-100 hover:bg-slate-200"
              >
                ✕ Close Reader
              </button>
            </div>

            {loadingArticle ? (
              <div className="space-y-4 py-20 text-center">
                <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin mx-auto" strokeWidth={1.5} />
                <h4 className="text-sm uppercase font-extrabold text-slate-500 tracking-wide">
                  Cross-referencing National data indices & Synthesizing Editorial Article via Gemini...
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Compiling spatial variance maps, circular deficits, and policy causal tracks directly from World Bank and SBP digital registries.
                </p>
              </div>
            ) : (
              sourceArticle && (
                <div className="space-y-6">
                  
                  {/* Journal Branding Header */}
                  <div className="text-center space-y-2 border-b-2 border-dashed border-slate-200 pb-6">
                    <span className="font-serif italic text-base block text-emerald-800">{sourceArticle.newspaperName}</span>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-950 font-black tracking-tight leading-tight max-w-3xl mx-auto">
                      {sourceArticle.headline}
                    </h2>
                    <p className="font-sans text-xs md:text-sm text-slate-600 font-medium max-w-2xl mx-auto italic">
                      {sourceArticle.subheading}
                    </p>
                    <div className="flex justify-center items-center gap-3 pt-2 text-[11px] font-bold text-slate-400">
                      <span>{sourceArticle.articleDate}</span>
                      <span>•</span>
                      <span>National Research Unit</span>
                      <span>•</span>
                      <span className="text-emerald-800">Verified Citation</span>
                    </div>
                  </div>

                  {/* High visual key metrics indicator panel */}
                  <div className="bg-[#10b98108] border border-emerald-500/15 p-4 rounded-sm flex flex-col sm:flex-row justify-around items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200 gap-3">
                    {sourceArticle.growthImpactMetrics.map((met, idx) => (
                      <div key={idx} className="w-full text-center py-2 sm:py-0">
                        <span className="text-[10px] text-slate-450 uppercase font-extrabold tracking-wider">{met.metric}</span>
                        <p className="text-lg font-black text-emerald-800 font-sans mt-0.5">{met.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Editorial Introduction */}
                  <div className="font-serif text-sm md:text-base text-slate-800 leading-relaxed font-semibold first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-emerald-800">
                    {sourceArticle.introduction}
                  </div>

                  {/* Deeply rich policy analysis dynamic sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {sourceArticle.deepSections.map((sec, idx) => (
                      <div key={idx} className="space-y-3 p-4 bg-slate-50 border border-slate-200/50 rounded-sm">
                        <h4 className="font-bold text-sm tracking-normal text-slate-900 border-b border-slate-200 pb-1.5 font-serif font-black">
                          {sec.sectionTitle}
                        </h4>
                        {sec.paragraphs.map((p, pIdx) => (
                          <p key={pIdx} className="font-sans text-xs md:text-sm text-slate-650 leading-relaxed font-semibold">
                            {p}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Opinion Box */}
                  <div className="bg-[#10b98108] border-l-4 border-emerald-600 p-5 rounded-sm">
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#10b981] block">Consolidated Policy Verdict:</span>
                    <p className="font-serif font-bold italic text-slate-900 text-sm leading-relaxed mt-1">
                      "{sourceArticle.editorialOpinion}"
                    </p>
                  </div>

                  {/* Bottom sources cited block */}
                  <div className="pt-6 border-t border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-bold text-slate-400 gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span>Citations Base:</span>
                      {sourceArticle.sourcesCited.map((cite, cIdx) => (
                        <a 
                          key={cIdx} 
                          href={cite.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-sm text-[11px] inline-flex items-center gap-1"
                        >
                          {cite.name} <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </a>
                      ))}
                    </div>
                    <span className="text-emerald-800 text-[11px]">Verified Document System</span>
                  </div>

                </div>
              )
            )}
            
            <div className="pt-4 border-t border-slate-200 text-right">
              <button 
                onClick={() => setArticleModalOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-sm uppercase tracking-wider"
              >
                Close Article Reader
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==============================================
          2. OFFLINE MOCK LOGIN MODAL
         ============================================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-sm p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-500">
                {authMode === "login" ? "Login to Databank" : "Register Credentials"}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Account Email Address</label>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. user@domain.com"
                  className="w-full p-2.5 rounded-sm border border-slate-200 bg-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Security Password</label>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-sm border border-slate-200 bg-white"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs py-3 uppercase tracking-wider rounded-sm transition-colors"
                onSubmit={handleAuthSubmit}
              >
                {authMode === "login" ? "Establish Session" : "Create Registry account"}
              </button>
            </form>

            <div className="text-center text-xs">
              {authMode === "login" ? (
                <button onClick={() => setAuthMode("signup")} className="text-emerald-700 font-bold hover:underline">
                  No credential record? Create one free
                </button>
              ) : (
                <button onClick={() => setAuthMode("login")} className="text-emerald-700 font-bold hover:underline">
                  Already registered? Login instead
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==============================================
          3. RESEARCH THESIS UPLOAD MODAL
         ============================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fafafc] border border-slate-300 w-full max-w-lg rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-3">
              <h3 className="text-sm uppercase font-extrabold tracking-wider text-[#021224] flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" /> Submit Your Research Work
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-450 hover:text-slate-900 font-bold px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-xs"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-705">Thesis or Article Title*</label>
                <input 
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Assessing Pakistan's Cotton Yield Under Seasonal Fluctuations"
                  className="w-full border border-slate-300 p-2.5 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-705">Author & Affiliation</label>
                <input 
                  type="text"
                  disabled
                  value={`${userEmail} (Verified Account)`}
                  className="w-full border border-slate-200 p-2.5 rounded-sm bg-slate-100 text-slate-500 cursor-not-allowed font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-705">Brief Abstract / Summary*</label>
                <textarea 
                  required
                  rows={4}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Provide a comprehensive summary of facts, data source used, and academic findings..."
                  className="w-full border border-slate-300 p-2.5 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-705">What is this for / Impact & Intention*</label>
                <textarea 
                  required
                  rows={2}
                  value={newWhatItMeans}
                  onChange={(e) => setNewWhatItMeans(e.target.value)}
                  placeholder="e.g., Assisting regional cotton planning commissions in optimizing seed subsidy distributions across Southern Punjab."
                  className="w-full border border-slate-300 p-2.5 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5 p-4 border border-dashed border-slate-300 bg-white rounded-sm">
                <label className="block font-bold text-slate-705 mb-1">Upload PDF Manuscript (.pdf file only)*</label>
                <input 
                  type="file"
                  required
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-slate-550 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                
                {newPdfName && (
                  <p className="text-emerald-700 font-bold mt-1.5">
                    ✓ Selected: {newPdfName}
                  </p>
                )}
                {tempFileError && (
                  <p className="text-rose-600 font-bold mt-1.5">
                    ⚠ {tempFileError}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploadingResearch}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-sm flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  {uploadingResearch ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Publish Thesis"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
