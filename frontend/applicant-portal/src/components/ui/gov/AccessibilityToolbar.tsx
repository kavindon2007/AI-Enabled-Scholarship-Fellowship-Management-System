import React, { useState } from 'react';

const AccessibilityToolbar: React.FC = () => {
  const [fontSize, setFontSize] = useState<number>(100);

  const handleResize = (step: number) => {
    const newSize = Math.max(80, Math.min(150, fontSize + step));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const resetSize = () => {
    setFontSize(100);
    document.documentElement.style.fontSize = '100%';
  };

  return (
    <div className="flex items-center space-x-2 border-l border-white/20 pl-4" aria-label="Accessibility Toolbar">
      <button 
        onClick={() => handleResize(-10)} 
        className="px-1.5 py-0.5 border border-white/30 rounded hover:bg-white/20 transition-colors"
        aria-label="Decrease text size"
        title="Decrease text size"
      >
        A-
      </button>
      <button 
        onClick={resetSize}
        className="px-1.5 py-0.5 border border-white/30 rounded hover:bg-white/20 transition-colors"
        aria-label="Reset text size"
        title="Reset text size"
      >
        A
      </button>
      <button 
        onClick={() => handleResize(10)}
        className="px-1.5 py-0.5 border border-white/30 rounded hover:bg-white/20 transition-colors"
        aria-label="Increase text size"
        title="Increase text size"
      >
        A+
      </button>
      {/* High contrast could toggle a class on the body here */}
    </div>
  );
};

export default AccessibilityToolbar;
