export type RequestStatus = 'pending' | 'quoted' | 'approved' | 'in_progress' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  categoryName: string;
  brandName?: string;
  productName?: string;
  issueDescription: string;
  preferredDate: string;
  preferredTime: string;
  status: RequestStatus;
  estimatedQuote?: number;
  createdAt: string;
  images?: string[];
}
