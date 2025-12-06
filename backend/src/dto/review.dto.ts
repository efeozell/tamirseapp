import { ServiceRequest } from "../entity/ServiceRequest.entity";

export class ReviewResponseDTO {
  id?: string;
  customerName?: string;
  rating?: number;
  comment?: string;
  date?: Date;
  static fromServiceRequest(request: ServiceRequest): ReviewResponseDTO {
    return {
      id: request.id,
      customerName: request.customer?.name || "Anonim",
      rating: request.rating || 0,
      comment: request.review || "",
      date: request.completedAt || request.updatedAt,
    };
  }
}
