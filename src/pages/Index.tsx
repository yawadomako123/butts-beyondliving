import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ProductCard, Product } from "@/components/ProductCard";
import { Cart, CartItem } from "@/components/Cart";
import { CheckoutForm, OrderData } from "@/components/CheckoutForm";
import { AuthModal } from "@/components/AuthModal";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-tech.jpg";

interface Category {
  id: string;
  name: string;
  description: string;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  const fetchCategoriesAndProducts = async () => {
    try {
      setIsLoading(true);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      setCategories(categoriesData || []);
      setProducts(productsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load products. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category_id === selectedCategory)
    : products;

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
        onAuthClick={() => setIsAuthOpen(true)}
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
            Discover the latest in technology and modern furniture with unbeatable prices and fast delivery
          </p>
          <Button variant="hero" size="lg" className="animate-scale-in">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h2>
          <p className="text-muted-foreground text-lg">Discover our collection of tech gadgets and modern furniture</p>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4"></div>
                <div className="bg-muted rounded h-4 mb-2"></div>
                <div className="bg-muted rounded h-4 w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found in this category.</p>
          </div>
        )}
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

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default Index;
