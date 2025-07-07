import React, { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Sidebar } from "./components/Sidebar";
import { MainContent } from "./components/MainContent";

function App() {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <MainContent activeSection={activeSection} />
      </div>
    </ThemeProvider>
  );
}

export default App;
