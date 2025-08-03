import { useState } from "react";
import { Star, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  rating: number;
  reviews_count: number;
  badge?: string;
  in_stock: boolean;
  category_id: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
    onAddToCart(product);
    setIsLoading(false);
  };

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <Card className="group relative overflow-hidden bg-card/60 backdrop-blur-sm border border-border/50 shadow-elegant hover:shadow-hover transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=375&fit=crop&crop=center`;
            }}
          />
        </div>
        
        <div className="absolute top-3 left-3 flex gap-2">
          {product.badge && (
            <Badge className="bg-warning/90 text-warning-foreground backdrop-blur-sm font-medium px-2 py-1 shadow-lg">
              {product.badge}
            </Badge>
          )}
          
          {discountPercentage && (
            <Badge className="bg-destructive/90 text-destructive-foreground backdrop-blur-sm font-medium px-2 py-1 shadow-lg">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {!product.in_stock && (
          <div className="absolute inset-0 bg-muted/80 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="secondary" className="text-sm font-medium">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? "fill-warning text-warning"
                        : "text-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-medium ml-1">
                {product.rating} ({product.reviews_count})
              </span>
            </div>
          </div>

          <h3 className="font-semibold text-base leading-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-baseline gap-3 pt-2">
            <span className="font-bold text-2xl text-foreground">
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {product.original_price && (
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground line-through">
                  ${product.original_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-success font-medium">
                  Save ${(product.original_price - product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isLoading || !product.in_stock}
            className="w-full mt-4 group/button h-11 font-medium transition-all duration-300"
            variant="default"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2 group-hover/button:scale-110 transition-transform duration-300" />
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};