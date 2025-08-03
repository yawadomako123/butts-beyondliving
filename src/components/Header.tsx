import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import logoImage from "@/assets/logo.jpg";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onAuthClick: () => void;
}

export const Header = ({ cartItemsCount, onCartClick, onAuthClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-background/80 border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-background via-background to-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Butts & Beyond Living
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300 hover:after:w-full">Home</a>
            <a href="#" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300 hover:after:w-full">Electronics</a>
            <a href="#" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300 hover:after:w-full">Office</a>
            <a href="#" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300 hover:after:w-full">Deals</a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="search"
                placeholder="Search amazing products..."
                className="pl-12 pr-4 h-12 bg-muted/30 border border-border/50 rounded-2xl focus:bg-background/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.user_metadata?.full_name || user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="hidden md:flex" onClick={onAuthClick}>
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            
            <Button
              variant="default"
              size="lg"
              onClick={onCartClick}
              className="relative bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-glow"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-warning text-warning-foreground min-w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-10 bg-muted/50"
                  />
                </div>
              </div>
              <a href="#" className="block px-3 py-2 text-foreground hover:text-primary">Home</a>
              <a href="#" className="block px-3 py-2 text-foreground hover:text-primary">Laptops</a>
              <a href="#" className="block px-3 py-2 text-foreground hover:text-primary">Phones</a>
              <a href="#" className="block px-3 py-2 text-foreground hover:text-primary">Accessories</a>
              <a href="#" className="block px-3 py-2 text-foreground hover:text-primary">Deals</a>
              <div className="pt-2">
                {user ? (
                  <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="ghost" className="w-full justify-start" onClick={onAuthClick}>
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};