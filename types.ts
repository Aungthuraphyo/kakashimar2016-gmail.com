
export interface BrandData {
  id: string;
  brandName: string;
  category: string;
  customCategory?: string;
  platforms: string[]; // e.g. ["Facebook", "TikTok"]
  month: string;
  budgetSpent: number;
  reach: number;
  engagement: number;
  conversions: number;
  revenue: number;
  kpiName: string;
  kpiValue: number;
  googleBusinessLink?: string;
}

export interface AnalysisRow {
  brandName: string;
  category: string;
  month: string;
  totalSpend: number;
  totalReach: number;
  engagementRate: number;
  conversions: number;
  revenue: number;
  roi: number;
  kpiName: string;
  kpiValue: number;
  status: 'Success' | 'Needs Improvement';
  googleBusinessStatus: string;
  googleBusinessUrl: string;
}

export interface BrandSpotlight {
  brandName: string;
  category: string;
  summary: string;
  positives: string[];
  negatives: string[];
  googleBusinessAnalysis: string;
}

export interface StrategicRecommendation {
  brandName: string;
  steps: string[];
}

export interface FullAnalysis {
  tableData: AnalysisRow[];
  executiveSummary: string;
  strategicRecommendations: StrategicRecommendation[];
  criticalInsights: string[];
  brandSpotlights: BrandSpotlight[];
}
