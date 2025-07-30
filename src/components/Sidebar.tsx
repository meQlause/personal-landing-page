import React, { useState } from "react";
import { Home, User, Code, Briefcase, Mail } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { id: "home", name: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "about", name: "About", icon: <User className="w-5 h-5" /> },
    { id: "skills", name: "Skills", icon: <Code className="w-5 h-5" /> },
    {
      id: "projects",
      name: "Projects & Experiences",
      icon: <Briefcase className="w-5 h-5" />,
    },
    { id: "contact", name: "Contact", icon: <Mail className="w-5 h-5" /> },
  ];

  const handleNavClick = (itemId: string) => {
    setActiveSection(itemId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 md:hidden p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
      >
        <div className="relative w-6 h-6">
          <span
            className={`absolute block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ${isOpen ? "rotate-45 top-3" : "top-1"
              }`}
          />
          <span
            className={`absolute block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ${isOpen ? "opacity-0" : "top-3"
              }`}
          />
          <span
            className={`absolute block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ${isOpen ? "-rotate-45 top-3" : "top-5"
              }`}
          />
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-40 transform transition-all duration-500 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 border-r border-gray-200/50 dark:border-gray-700/50`}
      >
        <div className="flex flex-col h-full p-8 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20" />

          {/* Profile Section */}
          <div className="text-center mb-8 relative z-10">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-xl ring-4 ring-blue-500/20 dark:ring-blue-400/30 transform hover:scale-105 transition-all duration-500">
                <img
                  src="/assets/sidebar.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-gray-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
              {/* Floating Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1 transform hover:scale-105 transition-transform duration-300">
              Ardial
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Full Stack Developer
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
              Available for work
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 relative z-10">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li
                  key={item.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={() => handleNavClick(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center px-4 py-4 rounded-xl transition-all duration-500 ease-out group relative overflow-hidden ${activeSection === item.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 transform scale-105"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:transform hover:scale-105"
                      }`}
                  >
                    {/* Background Animation */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform transition-transform duration-500 ${hoveredItem === item.id ? "scale-100" : "scale-0"
                        } rounded-xl`}
                    />

                    {/* Icon */}
                    <div
                      className={`relative z-10 transform transition-all duration-300 ${activeSection === item.id
                          ? "scale-110"
                          : "group-hover:scale-110"
                        }`}
                    >
                      {item.icon}
                    </div>

                    {/* Text */}
                    <span className="ml-4 font-medium relative z-10 transform transition-all duration-300 group-hover:translate-x-1">
                      {item.name}
                    </span>

                    {/* Active Indicator */}
                    {activeSection === item.id && (
                      <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}

                    {/* Hover Effect */}
                    <div
                      className={`absolute inset-0 border-2 border-blue-400/30 rounded-xl transform transition-all duration-300 ${hoveredItem === item.id
                          ? "scale-100 opacity-100"
                          : "scale-95 opacity-0"
                        }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Theme Toggle */}
          <div className="mt-8 flex justify-center relative z-10">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <ThemeToggle />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center relative z-10">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              © 2024 Ardial
            </p>
            <div className="mt-2 flex justify-center space-x-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse animation-delay-300" />
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse animation-delay-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-all duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
