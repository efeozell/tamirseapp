import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import { API_ENDPOINTS } from "../../lib/api-config";

interface RateRequestDialogProps {
  requestId: string | null;
  businessName: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RateRequestDialog({ requestId, businessName, open, onClose, onSuccess }: RateRequestDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!requestId) {
      toast.error("Talep ID bulunamadı");
      return;
    }

    if (rating === 0) {
      toast.error("Lütfen bir değerlendirme yapın");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post(API_ENDPOINTS.RATE_REQUEST(requestId), {
        rating,
        comment: comment.trim() || undefined,
      });

      toast.success("Değerlendirmeniz kaydedildi");

      // Reset form
      setRating(0);
      setComment("");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error("Rating submission error:", error);
      toast.error(error.response?.data?.message || "Değerlendirme gönderilemedi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setComment("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hizmeti Değerlendir</DialogTitle>
          <DialogDescription>{businessName} tarafından verilen hizmeti değerlendirin</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Puanınız</Label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  disabled={isSubmitting}>
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 1 && "Çok Kötü"}
                {rating === 2 && "Kötü"}
                {rating === 3 && "Orta"}
                {rating === 4 && "İyi"}
                {rating === 5 && "Mükemmel"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Yorumunuz (İsteğe Bağlı)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Hizmet hakkında düşüncelerinizi paylaşın..."
              rows={4}
              disabled={isSubmitting}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">{comment.length}/500</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
            {isSubmitting ? "Gönderiliyor..." : "Değerlendirmeyi Gönder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
