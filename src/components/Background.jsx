import React from 'react';
import './Background.css';

export function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Top left particles */}
      <div className="particle w-24 h-24 top-[5%] left-[10%] bg-red-500/20 dark:bg-red-500/30 rounded-full filter blur-xl animate-float" />
      <div className="particle w-16 h-16 top-[15%] left-[5%] bg-red-600/20 dark:bg-red-600/30 rounded-full filter blur-lg animate-pulse-subtle" />
      
      {/* Top right particles */}
      <div className="particle w-20 h-20 top-[8%] right-[12%] bg-red-400/20 dark:bg-red-400/30 rounded-full filter blur-xl animate-float" style={{ animationDelay: '-2s' }} />
      <div className="particle w-12 h-12 top-[20%] right-[8%] bg-red-500/20 dark:bg-red-500/30 rounded-full filter blur-lg animate-pulse-subtle" style={{ animationDelay: '-1s' }} />
      
      {/* Bottom particles */}
      <div className="particle w-28 h-28 bottom-[10%] left-[15%] bg-red-600/20 dark:bg-red-600/30 rounded-full filter blur-xl animate-float" style={{ animationDelay: '-4s' }} />
      <div className="particle w-20 h-20 bottom-[15%] right-[10%] bg-red-500/20 dark:bg-red-500/30 rounded-full filter blur-lg animate-pulse-subtle" style={{ animationDelay: '-3s' }} />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 animate-shimmer opacity-50" />
    </div>
  );
}

export default Background;
