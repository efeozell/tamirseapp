import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  PlusCircle, 
  ClipboardList, 
  User 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Ana Sayfa" },
  { path: "/shops", icon: Search, label: "Dükkanlar" },
  { path: "/request/new", icon: PlusCircle, label: "Talep" },
  { path: "/requests", icon: ClipboardList, label: "Taleplerim" },
  { path: "/profile", icon: User, label: "Profil" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 px-2 py-2 md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 px-3 py-2"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex items-center justify-center rounded-xl p-2 transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
              </motion.div>
              <span className={cn(
                "text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-2 h-1 w-8 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
