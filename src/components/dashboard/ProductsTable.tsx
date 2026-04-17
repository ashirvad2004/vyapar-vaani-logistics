import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/logistics";
import { Package, ShoppingCart } from "lucide-react";

interface ProductsTableProps {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onBuy: (product: Product) => void;
}

export function ProductsTable({ products, isLoading, isError, onBuy }: ProductsTableProps) {
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Package className="h-10 w-10 mb-3 text-destructive/50" />
        <p className="font-medium text-foreground">Failed to load products</p>
        <p className="text-sm mt-1">Check your backend connection and try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Package className="h-10 w-10 mb-3 opacity-40" />
        <p className="font-medium text-foreground">No live products</p>
        <p className="text-sm mt-1">Sellers can list products via the chat backend.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="font-display font-semibold">Product</TableHead>
          <TableHead className="font-display font-semibold">Quantity</TableHead>
          <TableHead className="font-display font-semibold">Price</TableHead>
          <TableHead className="font-display font-semibold">Seller</TableHead>
          <TableHead className="font-display font-semibold text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id}>
            <TableCell className="font-medium capitalize">{product.name}</TableCell>
            <TableCell className="tabular-nums">{product.quantity}</TableCell>
            <TableCell className="tabular-nums font-medium">{product.suggestedPrice}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {product.sellerId}
            </TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="outline" onClick={() => onBuy(product)}>
                <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                Buy
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
