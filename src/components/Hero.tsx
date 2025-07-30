import React from "react";
import { Github, Linkedin, Download, ArrowRight } from "lucide-react";

interface HeroProps {
  setActiveSection: (section: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveSection }) => {
  const handleNavClick = (itemId: string) => {
    setActiveSection(itemId);
  };

  return (
    <section className="min-h-screen py-10 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Picture */}
          <div className="mb-8 relative inline-block">
            <div className="h-[192px] w-[192px] mx-auto rounded-full overflow-hidden shadow-2xl ring-8 ring-white dark:ring-gray-700 transform hover:scale-105 transition-transform duration-500">
              <img
                src="/assets/hero.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-0 hover:opacity-20 transition-opacity duration-500"></div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-white dark:border-gray-700 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-white leading-tight">
                Hello, I'm{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ardial
                </span>
              </h1>

              <div className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-light pt-4">
                <span className="inline-block animate-pulse">
                  Full Stack Developer
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/1AqlvllE3yqHVxLXbAaiKr7Dk6HtHUXI3/view?usp=drive_link",
                    "_blank"
                  )
                }
              >
                <Download className="w-5 h-5 mr-2" />
                Download CV
              </button>
              <button onClick={() => handleNavClick("projects")} className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                View Work
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-6 pt-8">
              <a
                href="https://github.com/meQlause"
                className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-gray-700 group"
              >
                <Github className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </a>
              <a
                href="https://www.linkedin.com/in/ardial-8a85372b6/"
                className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-gray-700 group"
              >
                <Linkedin className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
