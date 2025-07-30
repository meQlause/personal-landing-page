import React, { useState, useEffect } from "react";
import { Hero } from "./Hero";
import { About } from "./About";
import { Skills } from "./Skills";
import { Projects } from "./Projects";
import { Contact } from "./Contact";

interface MainContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const MainContent: React.FC<MainContentProps> = ({ activeSection, setActiveSection }) => {
  const [currentSection, setCurrentSection] = useState(activeSection);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextSection, setNextSection] = useState("");

  useEffect(() => {
    if (activeSection !== currentSection) {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentSection(activeSection);

        setTimeout(() => {
          setIsTransitioning(false);
          setNextSection("");
        }, 300);
      }, 300);
    }
  }, [activeSection, currentSection]);

  const renderSection = (section: string) => {
    switch (section) {
      case "home":
        return <Hero setActiveSection={setActiveSection} />;
      case "about":
        return <About />;
      case "skills":
        return <Skills />;
      case "projects":
        return <Projects />;
      case "contact":
        return <Contact />;
      default:
        return <Hero setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="flex-1 md:ml-80 relative overflow-hidden">
      {/* Transition Overlay */}
      <div
        className={`absolute inset-0 z-50 transition-all duration-700 ease-in-out ${isTransitioning
          ? "bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 opacity-100"
          : "bg-transparent opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex items-center justify-center h-full">
          <div
            className={`transition-all duration-500 ${isTransitioning ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
          >
            <div className="relative">
              {/* Animated Loading Rings */}
              <div className="w-24 h-24 border-4 border-white/20 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-white rounded-full animate-pulse"></div>
              </div>
              <div className="absolute top-2 left-2 w-20 h-20 border-4 border-white/30 rounded-full animate-spin animation-reverse">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-b-white rounded-full animate-pulse animation-delay-300"></div>
              </div>
              <div className="absolute top-4 left-4 w-16 h-16 border-4 border-white/40 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-r-white rounded-full animate-pulse animation-delay-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Section */}
      <div
        className={`h-screen transition-all duration-700 ease-out ${isTransitioning
          ? "transform scale-95 opacity-0 blur-sm"
          : "transform scale-100 opacity-100 blur-0"
          }`}
      >
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="transition-transform duration-700 ease-out">
            {renderSection(currentSection)}
          </div>
        </div>
      </div>

      {/* Next Section (Pre-loading) */}
      {nextSection && (
        <div
          className={`absolute inset-0 h-screen transition-all duration-700 ease-out ${isTransitioning
            ? "transform scale-100 opacity-100 blur-0 z-10"
            : "transform scale-105 opacity-0 blur-sm z-0"
            }`}
        >
          <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="transition-transform duration-700 ease-out">
              {renderSection(nextSection)}
            </div>
          </div>
        </div>
      )}

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-1000 ${isTransitioning ? "opacity-100 animate-float" : "opacity-0"
              }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 200}ms`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
