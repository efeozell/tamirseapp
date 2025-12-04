import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Search, 
  PlusCircle, 
  ClipboardList, 
  User,
  Menu,
  X,
  LogIn
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { path: "/shops", label: "Dükkanlar", icon: Search },
  { path: "/request/new", label: "Talep Oluştur", icon: PlusCircle },
  { path: "/requests", label: "Taleplerim", icon: ClipboardList },
];

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-md">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gradient-primary">
            OtoServis
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "gap-2",
                    isActive && "shadow-md"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/auth">
            <Button variant="outline" className="gap-2">
              <LogIn className="h-4 w-4" />
              Giriş Yap
            </Button>
          </Link>
          <Link to="/auth?mode=register">
            <Button variant="hero" className="gap-2">
              Kayıt Ol
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 glass border-b border-border/50 p-4 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <div className="border-t border-border pt-2 mt-2 flex gap-2">
              <Link to="/auth" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full gap-2">
                  <LogIn className="h-4 w-4" />
                  Giriş
                </Button>
              </Link>
              <Link to="/auth?mode=register" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                <Button variant="hero" className="w-full">
                  Kayıt
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
