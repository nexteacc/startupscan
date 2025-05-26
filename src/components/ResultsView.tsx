import * as React from "react";
import { useState } from "react";
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

const ResultsView: React.FC<ResultsViewProps> = ({ ideas, onRetake }: ResultsViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const displayIdeas = ideas.slice(0, 5);
  const currentIdea = displayIdeas[currentIndex];

  const nextIdea = () => {
    if (currentIndex < displayIdeas.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDetails(false);
      setIsExpanded(false);
    }
  };

  const prevIdea = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowDetails(false);
      setIsExpanded(false);
    }
  };

  const handleDetailToggle = () => {
    setIsExpanded(!isExpanded);
    setShowDetails(!showDetails);
  };

  const handleDragEnd = (_: unknown, info: any) => {
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
          {displayIdeas.map((_: Idea, index: number) => (
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
      <div className="flex-1 flex items-center justify-center px-4 relative">
        {/* Background Overlay for Expanded State */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 z-[5]"
            onClick={handleDetailToggle}
          />
        )}
        <div className={`relative w-full max-w-md ${isExpanded ? 'min-h-96 max-h-[80vh]' : 'h-96'} overflow-visible`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0, scale: 0.8 }}
              animate={{ 
                x: 0, 
                opacity: 1, 
                scale: isExpanded ? 1.02 : 1,
                y: isExpanded ? -20 : 0,
                zIndex: isExpanded ? 10 : 1
              }}
              exit={{ x: -300, opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              drag={!isExpanded ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className={`absolute inset-0 ${!isExpanded ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              <motion.div 
                animate={{
                  height: isExpanded ? 'auto' : '100%',
                  boxShadow: isExpanded 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className="w-full bg-white rounded-2xl p-6 flex flex-col overflow-hidden"
              >
                {/* Card Header */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">💡</div>
                  <h2 className="text-xl font-bold text-gray-800">
                    创业想法 {currentIndex + 1}
                  </h2>
                </div>

                {/* Card Content */}
                <div className={`flex-1 ${isExpanded ? 'overflow-y-auto max-h-[60vh]' : ''} space-y-4`}>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">📍 创意来源</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {currentIdea?.source}
                    </p>
                  </div>

                  {!showDetails ? (
                    <motion.div 
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={handleDetailToggle}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">💰 市场潜力</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {currentIdea?.market_potential?.substring(0, 80)}...
                      </p>
                      <p className="text-xs text-blue-500 mt-2">点击查看详细信息 ↗</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">💰 市场潜力</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {currentIdea?.market_potential}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <h4 className="font-semibold text-green-800 text-sm">🎯 策略</h4>
                        <p className="text-gray-700 text-xs mt-1 leading-relaxed">{currentIdea?.strategy}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <h4 className="font-semibold text-purple-800 text-sm">📢 营销</h4>
                        <p className="text-gray-700 text-xs mt-1 leading-relaxed">{currentIdea?.marketing}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <h4 className="font-semibold text-orange-800 text-sm">👥 目标用户</h4>
                        <p className="text-gray-700 text-xs mt-1 leading-relaxed">{currentIdea?.target_audience}</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Card Actions */}
                {showDetails && (
                  <motion.div 
                    className="mt-4 space-y-3 border-t border-gray-100 pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      onClick={handleDetailToggle}
                      className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg font-medium transition-colors hover:bg-gray-600"
                    >
                      收起详情
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Hint */}
      <div className="text-center px-6 py-4">
        <p className="text-sm text-gray-500">左右滑动切换创业想法</p>
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