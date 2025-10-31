import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useAuth } from "@/layouts/Root";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const Header = ({ totalStars = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { user } = useSelector((state) => state.user);
  const isHome = location.pathname === "/";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-primary via-pink-500 to-secondary text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2">
                <ApperIcon name="Sparkles" size={32} className="text-accent" />
              </div>
              <h1 className="text-3xl font-display">LearnQuest</h1>
            </motion.button>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <NavItem 
              label="Home" 
              icon="Home" 
              onClick={() => navigate("/")} 
              active={isHome}
            />
            <NavItem 
              label="Math" 
              icon="Calculator" 
              onClick={() => navigate("/challenges/math")} 
              active={location.pathname.includes("/math")}
            />
            <NavItem 
              label="Reading" 
              icon="BookOpen" 
              onClick={() => navigate("/challenges/reading")} 
              active={location.pathname.includes("/reading")}
            />
            <NavItem 
              label="Avatar" 
              icon="User" 
              onClick={() => navigate("/avatar")} 
              active={location.pathname === "/avatar"}
            />
            <NavItem
              label="Progress" 
              icon="TrendingUp" 
              onClick={() => navigate("/progress")} 
              active={location.pathname === "/progress"}
            />
          </nav>

          <div className="flex items-center gap-4">
            <Badge 
              variant="light"
              className="bg-white/20 backdrop-blur-sm px-4 py-2"
            >
              <ApperIcon name="Star" size={20} className="text-accent" />
              <span className="ml-2 font-bold">{totalStars}</span>
            </Badge>
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <ApperIcon name="LogOut" size={20} />
                <span className="font-medium">Logout</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const NavItem = ({ label, icon, onClick, active }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center gap-1 group"
  >
    <div className={cn(
      "p-2 rounded-xl transition-all",
      active ? "bg-white/30 backdrop-blur-sm" : ""
    )}>
      <ApperIcon name={icon} size={24} />
    </div>
    <span className="text-xs font-semibold">{label}</span>
  </motion.button>
);

export default Header;