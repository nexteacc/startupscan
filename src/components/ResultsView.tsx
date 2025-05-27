import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

const CARD_HEIGHT = 250;
const CARD_TITLE_HEIGHT = 50;
const SCROLL_THRESHOLD_PER_CARD = CARD_HEIGHT * 0.8;

const CARD_OFFSET = 60;
const SCALE_FACTOR = 0.03;

const ResultsView: React.FC<ResultsViewProps> = ({ ideas, onRetake }: ResultsViewProps) => {
  const displayIdeas = ideas.slice(0, 5);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleBackgroundClick = () => {
    setExpandedIndex(null);
  };

  return (
    <div 
      ref={scrollRef}
      className="min-h-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col pt-8 overflow-y-auto relative"
    >
      <div style={{ height: `${displayIdeas.length * SCROLL_THRESHOLD_PER_CARD + window.innerHeight}px` }}> 
      <div className="text-center pb-8 sticky top-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-50 pt-8">
        <h1 className="text-3xl font-bold text-gray-800">✨ Next BIG TOY ✨</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 relative mt-4"> 
        
        <div className="relative w-full max-w-md" style={{ height: `${CARD_HEIGHT + (displayIdeas.length -1) * CARD_TITLE_HEIGHT + 100}px` }}> 
          {displayIdeas.map((idea, index) => {
            const cardScrollStart = (index - 1) * SCROLL_THRESHOLD_PER_CARD;
            const cardScrollCenter = index * SCROLL_THRESHOLD_PER_CARD;
            const cardScrollEnd = (index + 1) * SCROLL_THRESHOLD_PER_CARD;

            const opacity = useTransform(
              scrollY,
              [cardScrollStart, cardScrollCenter, cardScrollEnd],
              [0.7, 1, 0.7]
            );

            const zIndex = displayIdeas.length - index; 

            return (
              <motion.div
                key={idea.source + index}
                className={`absolute w-full cursor-pointer`}
                style={{
                  zIndex,
                  transformOrigin: 'center center',
                  opacity: opacity,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                }}
                onClick={() => handleCardClick(index)}
              >
                <motion.div
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200`}
                  style={{ height: 'auto' }}
                >
                  <div className={`p-5`}>
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-2">💡</div>
                      <h2 className="text-lg font-semibold text-gray-700">
                        创业想法 {index + 1}
                      </h2>
                    </div>

                    <motion.div
                      className="space-y-3"
                      style={{
                      }}
                    >
                      <div className="bg-blue-50 rounded-xl p-3">
                        <h3 className="font-medium text-blue-700 text-sm mb-1">📍 创意来源</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {idea.source}
                        </p>
                      </div>
                      <div className="bg-gray-100 rounded-xl p-3">
                        <h3 className="font-medium text-gray-700 text-sm mb-1">💰 市场潜力</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {idea.market_potential}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3">
                        <h3 className="font-medium text-green-700 text-sm mb-1">🎯 策略</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {idea.strategy}
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3">
                        <h3 className="font-medium text-purple-700 text-sm mb-1">📢 营销</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {idea.marketing}
                        </p>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-3">
                        <h3 className="font-medium text-orange-700 text-sm mb-1">👥 目标用户</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {idea.target_audience}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-8 pt-4 sticky bottom-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-50">
        <button
          onClick={onRetake}
          className="w-full py-4 px-6 bg-blue-500 text-white rounded-3xl font-medium text-lg transition-colors hover:bg-blue-600 flex items-center justify-center space-x-2 shadow-lg"
        >
          <span>📸</span>
          <span>重新拍照</span>
        </button>
      </div>
    </div>
      <div className="text-center pb-8">
        <h1 className="text-3xl font-bold text-gray-800">✨ Next BIG TOY ✨</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 relative">
        {expandedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-30"
            onClick={handleBackgroundClick}
          />
        )}
        
        <div className="relative w-full max-w-md" style={{ height: `${displayIdeas.length * 60 + 200}px` }}> 
          {displayIdeas.map((idea, index) => {
            const isExpanded = expandedIndex === index;
            let displayOrder = displayIdeas.length - 1 - index;
            if (expandedIndex !== null) {
              if (index === expandedIndex) {
                displayOrder = displayIdeas.length;
              } else if (index > expandedIndex) {
                displayOrder = displayIdeas.length - 1 - index + 1; 
              } else {
                displayOrder = displayIdeas.length - 1 - index;
              }
            }

            const zIndex = isExpanded ? 40 : 10 + displayOrder;
            const initialYOffset = index * CARD_OFFSET;
            const initialScale = 1 - (index * SCALE_FACTOR);

            return (
              <motion.div
                key={idea.source + index}
                className={`absolute w-full cursor-pointer`}
                style={{
                  zIndex,
                  transformOrigin: 'center center'
                }}
                initial={{
                  y: initialYOffset,
                  scale: initialScale,
                  opacity: 1,
                }}
                animate={{
                  y: isExpanded ? (window.innerHeight * 0.1) : initialYOffset + (expandedIndex !== null && index > expandedIndex ? 150 : 0),
                  scale: isExpanded ? 1 : initialScale,
                  opacity: isExpanded ? 1 : (expandedIndex !== null && index !== expandedIndex ? 0.7 : 1),
                  rotateX: 0,
                  boxShadow: isExpanded ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={() => handleCardClick(index)}
              >
                <motion.div
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200`}
                  animate={{
                    height: isExpanded ? 'auto' : '180px',
                    borderRadius: isExpanded ? "1.25rem" : "1rem"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  <div className={`p-5 ${isExpanded ? 'pb-8' : ''}`}> 
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-2">💡</div>
                      <h2 className="text-lg font-semibold text-gray-700">
                        创业想法 {index + 1}
                      </h2>
                    </div>

                    {!isExpanded && (
                      <div className="space-y-3">
                        <div className="bg-blue-50 rounded-xl p-3">
                          <h3 className="font-medium text-blue-700 text-xs mb-1">📍 创意来源</h3>
                          <p className="text-gray-600 text-xs leading-snug line-clamp-2">
                            {idea.source}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-3">
                          <h3 className="font-medium text-gray-700 text-xs mb-1">💰 市场潜力</h3>
                          <p className="text-gray-500 text-xs leading-snug line-clamp-2">
                            {idea.market_potential}
                          </p>
                        </div>
                      </div>
                    )}

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.1 }}
                        className="space-y-3"
                      >
                        <div className="bg-blue-50 rounded-xl p-3">
                          <h3 className="font-medium text-blue-700 text-sm mb-1">📍 创意来源</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.source}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-3">
                          <h3 className="font-medium text-gray-700 text-sm mb-1">💰 市场潜力</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.market_potential}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3">
                          <h3 className="font-medium text-green-700 text-sm mb-1">🎯 策略</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.strategy}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-3">
                          <h3 className="font-medium text-purple-700 text-sm mb-1">📢 营销</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.marketing}
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-3">
                          <h3 className="font-medium text-orange-700 text-sm mb-1">👥 目标用户</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.target_audience}
                          </p>
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