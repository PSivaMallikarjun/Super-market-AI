export enum View {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  SUPPORT = 'SUPPORT',
  SECURITY = 'SECURITY',
  MARKETING = 'MARKETING',
  SHELF_MONITORING = 'SHELF_MONITORING',
  PLANOGRAM_COMPLIANCE = 'PLANOGRAM_COMPLIANCE',
  PRICING_DETECTION = 'PRICING_DETECTION',
  INVENTORY_TRACKING = 'INVENTORY_TRACKING',
  OOS_PREDICTION = 'OOS_PREDICTION',
  CUSTOMER_BEHAVIOUR = 'CUSTOMER_BEHAVIOUR',
  SHELF_SPACE_OPTIMISATION = 'SHELF_SPACE_OPTIMISATION',
  SPOILAGE_DETECTION = 'SPOILAGE_DETECTION',
  PROMO_MONITORING = 'PROMO_MONITORING',
  THEFT_DETECTION = 'THEFT_DETECTION'
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  lastSold: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface SalesData {
  name: string;
  sales: number;
  revenue: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  location: string;
  status: 'Normal' | 'Suspicious' | 'Empty Shelf';
  details: string;
}

export interface MarketingCampaign {
  id: string;
  timestamp: Date;
  productName: string;
  targetAudience: string;
  generatedCopy: string;
  generatedImageUrl?: string;
  uploadedImageUrl?: string;
}

export interface CreativeAudit {
  id: string;
  timestamp: Date;
  roiScore: number;
  attentionScore: number;
  suggestions: string[];
  suppressionStrategy: string;
  fullAnalysis: string;
}

export interface ShelfAlert {
  id: string;
  timestamp: Date;
  location: string;
  type: 'Out of Stock' | 'Low Stock' | 'Planogram Mismatch';
  priority: 'High' | 'Medium' | 'Low';
  details: string;
  isResolved: boolean;
}

export interface PricingIssue {
  id: string;
  timestamp: Date;
  productName?: string;
  detectedPrice?: string;
  issueType: 'Incorrect Price' | 'Missing Tag' | 'Expired Promotion' | 'Label Misplacement';
  priority: 'High' | 'Medium' | 'Low';
  details: string;
  isResolved: boolean;
}

export interface RecognizedProduct {
  id: string;
  brand: string;
  sku?: string;
  category: string;
  count: number;
  confidence: number;
}

export interface StockPrediction {
  id: string;
  productName: string;
  currentFillLevel: number; // 0-100
  estimatedTimeRemaining: string; // e.g., "2h 30m"
  riskLevel: 'Critical' | 'Warning' | 'Stable';
  historicalVelocity: string;
  recommendation: string;
}

export interface BehaviourInsight {
  id: string;
  type: 'Hot Zone' | 'Cold Zone' | 'High Interaction' | 'Path Obstruction';
  location: string;
  description: string;
  score: number; // 0-100 impact
}

export interface BrandSpaceShare {
  brand: string;
  occupancyPercentage: number;
  facings: number;
  contractualTarget: number;
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Over-Represented';
}

export interface SpoilageAlert {
  id: string;
  timestamp: Date;
  location: string;
  type: 'Damaged Packaging' | 'Expired Product' | 'Spill/Contamination' | 'Produce Decay';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  details: string;
  isResolved: boolean;
}

export interface PromoAudit {
  id: string;
  timestamp: Date;
  campaignName: string;
  location: string;
  complianceStatus: 'Compliant' | 'Partial' | 'Non-Compliant';
  findings: string[];
}

export interface SecurityIncident {
  id: string;
  timestamp: Date;
  location: string;
  type: 'Shelf Sweeping' | 'Concealment' | 'Unusual Handling' | 'Aggressive Behavior';
  confidence: number;
  status: 'Investigating' | 'Dispatched' | 'False Alarm' | 'Resolved';
  details: string;
}