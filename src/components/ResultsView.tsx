import React from "react";
import { useState, useRef } from "react";
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const draggingIndex = useRef<number | null>(null);
  const displayIdeas = ideas.slice(0, 5);

  const handleCardClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setDragY(0);
  };

  const handleBackgroundClick = () => {
    setExpandedIndex(null);
    setDragY(0);
  };

  // 拖拽相关
  const handleDragStart = (event: any, index: number) => {
    draggingIndex.current = index;
  };
  const handleDrag = (event: any, info: any) => {
    setDragY(info.point.y);
  };
  const handleDragEnd = (event: any, info: any) => {
    if (dragY < -120) {
      setExpandedIndex(draggingIndex.current);
    }
    setDragY(0);
    draggingIndex.current = null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800">✨ Next BIG TOY ✨</h1>
      </div>

      {/* Card Stack Container */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {/* Background Overlay for Expanded State */}
        {expandedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleBackgroundClick}
          />
        )}
        
        <div className="relative w-full max-w-sm">
          {displayIdeas.map((idea, index) => {
            const isExpanded = expandedIndex === index;
            const isTop = index === displayIdeas.length - 1;
            const stackOffset = (displayIdeas.length - 1 - index) * 16;
            const scaleOffset = (displayIdeas.length - 1 - index) * 0.06;
            const zIndex = isExpanded ? 100 : 10 + index;
            return (
              <motion.div
                key={index}
                className={`absolute w-full`} style={{zIndex}}
                initial={{
                  y: stackOffset,
                  scale: 1 - scaleOffset,
                  opacity: 0.85 + (index * 0.03),
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
                }}
                animate={{
                  y: isExpanded ? -60 : stackOffset,
                  scale: isExpanded ? 1.08 : 1 - scaleOffset,
                  opacity: isExpanded ? 1 : (isTop ? 1 : 0.85 + (index * 0.03)),
                  rotateX: isExpanded ? 0 : 0,
                  boxShadow: isExpanded ? "0 16px 48px rgba(0,0,0,0.18)" : "0 8px 32px rgba(0,0,0,0.12)"
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 32,
                  duration: 0.45
                }}
                style={{
                  transformOrigin: 'center bottom',
                  zIndex
                }}
                drag={isTop && expandedIndex === null ? "y" : false}
                dragConstraints={{ top: -180, bottom: 0 }}
                dragElastic={0.18}
                onDragStart={(e, info) => handleDragStart(e, index)}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
              >
                <motion.div
                  className={`bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer border border-gray-100 ${isExpanded ? 'shadow-2xl scale-105' : ''}`}
                  onClick={() => !isExpanded && isTop && handleCardClick(index)}
                  whileHover={isTop && !isExpanded ? { scale: 1.03, boxShadow: "0 12px 36px rgba(0,0,0,0.16)" } : {}}
                  whileTap={isTop && !isExpanded ? { scale: 0.97 } : {}}
                  animate={{
                    height: isExpanded ? 'auto' : '260px',
                    borderRadius: isExpanded ? "2.2rem" : "1.5rem"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 28
                  }}
                >
                  <div className="p-6">
                    {/* Card Header */}
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">💡</div>
                      <h2 className="text-xl font-bold text-gray-800">
                        创业想法 {index + 1}
                      </h2>
                    </div>

                    {/* Card Content - Collapsed State */}
                    {!isExpanded && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-2xl p-4">
                          <h3 className="font-semibold text-blue-800 mb-2 text-sm">📍 创意来源</h3>
                          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                            {idea.source}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <h3 className="font-semibold text-gray-800 mb-2 text-sm">💰 市场潜力</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {idea.market_potential}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Card Content - Expanded State */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="space-y-4 max-h-[60vh] overflow-y-auto"
                      >
                        <div className="bg-blue-50 rounded-2xl p-4">
                          <h3 className="font-semibold text-blue-800 mb-2">📍 创意来源</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.source}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <h3 className="font-semibold text-gray-800 mb-2">💰 市场潜力</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.market_potential}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-4">
                          <h3 className="font-semibold text-green-800 mb-2">🎯 策略</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.strategy}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-2xl p-4">
                          <h3 className="font-semibold text-purple-800 mb-2">📢 营销</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.marketing}
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-2xl p-4">
                          <h3 className="font-semibold text-orange-800 mb-2">👥 目标用户</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.target_audience}
                          </p>
                        </div>
                        
                        {/* Close Button */}
                        <div className="pt-4 border-t border-gray-100">
                          <button
                            onClick={handleBackgroundClick}
                            className="w-full py-3 px-4 bg-gray-500 text-white rounded-2xl font-medium transition-colors hover:bg-gray-600"
                          >
                            收起详情
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={onRetake}
          className="w-full py-4 px-6 bg-blue-500 text-white rounded-3xl font-medium text-lg transition-colors hover:bg-blue-600 flex items-center justify-center space-x-2 shadow-lg"
        >
          <span>📸</span>
          <span>重新拍照</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsView;