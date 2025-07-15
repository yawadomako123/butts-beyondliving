import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ProductCard, Product } from "@/components/ProductCard";
import { Cart, CartItem } from "@/components/Cart";
import { CheckoutForm, OrderData } from "@/components/CheckoutForm";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-tech.jpg";

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "MacBook Pro 16-inch M3 Pro",
    price: 2499.99,
    originalPrice: 2699.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    rating: 4.8,
    reviews: 124,
    category: "Laptops",
    badge: "Bestseller",
    description: "Powerful laptop with M3 Pro chip, 18GB RAM, 512GB SSD"
  },
  {
    id: "2", 
    name: "iPhone 15 Pro Max 256GB",
    price: 1199.99,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    rating: 4.7,
    reviews: 89,
    category: "Phones",
    description: "Latest iPhone with titanium design and advanced camera system"
  },
  {
    id: "3",
    name: "Sony WH-1000XM5 Headphones",
    price: 349.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    rating: 4.9,
    reviews: 256,
    category: "Audio",
    badge: "Sale",
    description: "Industry-leading noise canceling wireless headphones"
  },
  {
    id: "4",
    name: "iPad Air 11-inch M2",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400", 
    rating: 4.6,
    reviews: 67,
    category: "Tablets",
    description: "Powerful and versatile tablet with M2 chip and stunning display"
  }
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = (orderData: OrderData) => {
    toast({
      title: "Order placed successfully!",
      description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
    });
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Welcome to <span className="bg-gradient-primary bg-clip-text text-transparent">Butts & Beyond Living</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in">
            Discover the latest in technology with unbeatable prices and fast delivery
          </p>
          <Button variant="hero" size="lg" className="animate-scale-in">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-lg">Discover our bestselling tech products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      <CheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onBack={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(true);
        }}
        items={cartItems}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
};

export default Index;
