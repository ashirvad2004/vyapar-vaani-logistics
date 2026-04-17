import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePlaceOrder } from "@/hooks/use-orders";
import { useLocalOrders } from "@/hooks/use-local-orders";
import type { Product } from "@/types/logistics";
import { toast } from "sonner";

interface BuyDialogProps {
  product: Product | null;
  onClose: () => void;
}

export function BuyDialog({ product, onClose }: BuyDialogProps) {
  const [buyerName, setBuyerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const placeOrder = usePlaceOrder();
  const { addOrder } = useLocalOrders();

  useEffect(() => {
    if (product) {
      setBuyerName("");
      setPhone("");
      setAddress("");
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    try {
      const order = await placeOrder.mutateAsync({
        productId: product._id,
        buyerName,
        phone,
        address,
      });
      addOrder(order);
      toast.success("Order placed", {
        description: `${order.productName} → logistics queue`,
      });
      onClose();
    } catch {
      toast.error("Failed to place order");
    }
  };

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Place Order</DialogTitle>
          <DialogDescription>
            {product ? `${product.name} · ${product.quantity} · ${product.suggestedPrice}` : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buyerName">Buyer name</Label>
            <Input
              id="buyerName"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Delivery address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={placeOrder.isPending}>
              {placeOrder.isPending ? "Placing…" : "Place Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
