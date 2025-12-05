export type RequestStatus = 
  | "pending" 
  | "approved" 
  | "in_progress" 
  | "completed" 
  | "rejected";

export interface RequestMessage {
  id: string;
  sender: "customer" | "business";
  content: string;
  timestamp: Date;
  attachments?: {
    type: "image" | "document";
    url: string;
    name: string;
  }[];
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  shopId: string;
  shopName: string;
  vehicle: {
    brand: string;
    model: string;
    year: string;
    mileage?: string;
  };
  issueDescription: string;
  selectedIssues: string[];
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedPrice?: string;
  actualPrice?: string;
  messages: RequestMessage[];
  timeline: {
    status: RequestStatus;
    timestamp: Date;
    note?: string;
  }[];
}
