import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Idea {
  source: string;
  strategy: string;
  marketing: string;
  market_potential: string;
  target_audience: string;
}

interface ResultsViewProps {
  ideas: Idea[];
  onRetake: () => void;
  onBack?: () => void;
  errorMessage?: string;  
  onRetry?: () => void;   
}

const ResultsView: React.FC<ResultsViewProps> = ({ ideas, onRetake }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const displayIdeas = ideas.slice(0, 5);
  const currentIdea = displayIdeas[currentIndex];

  const nextIdea = () => {
    if (currentIndex < displayIdeas.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDetails(false);
    }
  };

  const prevIdea = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowDetails(false);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      prevIdea();
    } else if (info.offset.x < -threshold) {
      nextIdea();
    }
  }; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">✨ Next BIG TOY ✨</h1>
        <div className="flex justify-center items-center space-x-2">
          {displayIdeas.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-blue-500 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {currentIndex + 1} / {displayIdeas.length}
        </p>
      </div>

      {/* Card Container */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-md h-96 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -300, opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <div className="w-full h-full bg-white rounded-2xl shadow-xl p-6 flex flex-col">
                {/* Card Header */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">💡</div>
                  <h2 className="text-xl font-bold text-gray-800">
                    创业想法 {currentIndex + 1}
                  </h2>
                </div>

                {/* Card Content */}
                <div className="flex-1 space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">📍 创意来源</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {currentIdea?.source}
                    </p>
                  </div>

                  {!showDetails ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">💰 市场潜力</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {currentIdea?.market_potential?.substring(0, 80)}...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-green-50 rounded-lg p-3">
                        <h4 className="font-semibold text-green-800 text-sm">🎯 策略</h4>
                        <p className="text-gray-700 text-xs mt-1">{currentIdea?.strategy}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <h4 className="font-semibold text-purple-800 text-sm">📢 营销</h4>
                        <p className="text-gray-700 text-xs mt-1">{currentIdea?.marketing}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <h4 className="font-semibold text-orange-800 text-sm">👥 目标用户</h4>
                        <p className="text-gray-700 text-xs mt-1">{currentIdea?.target_audience}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-medium transition-colors hover:bg-blue-600"
                  >
                    {showDetails ? '收起详情' : '查看详情'}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center px-6 py-4">
        <button
          onClick={prevIdea}
          disabled={currentIndex === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            currentIndex === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>←</span>
          <span>上一个</span>
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">左右滑动切换</p>
        </div>

        <button
          onClick={nextIdea}
          disabled={currentIndex === displayIdeas.length - 1}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            currentIndex === displayIdeas.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>下一个</span>
          <span>→</span>
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 pb-6">
        <button
          onClick={onRetake}
          className="w-full py-3 px-6 bg-blue-500 text-white rounded-xl font-medium text-lg transition-colors hover:bg-blue-600 flex items-center justify-center space-x-2"
        >
          <span>📸</span>
          <span>重新拍照</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsView;