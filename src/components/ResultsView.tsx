'use client';

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TextShimmer } from "@/components/TextShimmer";

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
  isStreamFinished: boolean;
}

const CARD_OFFSET = 60;
const SCALE_FACTOR = 0.03;

// 图标配置
const ICONS = {
  ideaKit: "/icons/idea-kit.png",
  ideaSource: "/icons/idea-source.png",
  marketPotential: "/icons/market-potential.png",
  strategy: "/icons/strategy.png",
  marketing: "/icons/marketing.png",
  targetAudience: "/icons/target-audience.png",
};

const ResultsView: React.FC<ResultsViewProps> = ({
  ideas,
  onRetake,
  onBack,
  errorMessage,
  onRetry,
  isStreamFinished,
}: ResultsViewProps) => {
  const displayIdeas = ideas.slice(0, 5);
  const scrollRef = useRef<HTMLDivElement>(null);


  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const viewportOffset =
    typeof window === "undefined" ? 0 : window.innerHeight * 0.1;

  const handleCardClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleBackgroundClick = () => {
    setExpandedIndex(null);
  };

  return (
    <div
      ref={scrollRef}
      className="min-h-screen h-[100dvh] bg-gray-100 flex flex-col pt-8 overflow-y-auto relative"
    >


      <div className="text-center pb-8">
        <h1 className="text-3xl font-bold text-gray-900">Next BIG TOY</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 relative">
        {expandedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 z-30"
            onClick={handleBackgroundClick}
          />
        )}

        <div className="relative w-full max-w-md" style={{ height: `${(displayIdeas.length + (!isStreamFinished ? 1 : 0)) * 60 + 200}px` }}>
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
                  opacity: 0,
                }}
                animate={{
                  y: isExpanded
                    ? viewportOffset
                    : initialYOffset +
                    (expandedIndex !== null && index > expandedIndex ? 150 : 0),
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
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Image src={ICONS.ideaKit} alt="Idea Kit" width={24} height={24} />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Idea Kit {index + 1}
                      </h2>
                    </div>

                    {!isExpanded && (
                      <div className="space-y-3">
                        <div className="bg-gray-100 rounded-xl p-3">
                          <h3 className="flex items-center gap-1.5 font-medium text-blue-600 text-xs mb-1">
                            <Image src={ICONS.ideaSource} alt="" width={16} height={16} />
                            Idea Source
                          </h3>
                          <p className="text-gray-700 text-xs leading-snug line-clamp-2">
                            {idea.source}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-3">
                          <h3 className="flex items-center gap-1.5 font-medium text-blue-600 text-xs mb-1">
                            <Image src={ICONS.marketPotential} alt="" width={16} height={16} />
                            Market Potential
                          </h3>
                          <p className="text-gray-700 text-xs leading-snug line-clamp-2">
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
                        <div className="bg-gray-100 rounded-xl p-3">
                          <h3 className="flex items-center gap-2 font-medium text-blue-600 text-sm mb-1">
                            <Image src={ICONS.ideaSource} alt="" width={20} height={20} />
                            Idea Source
                          </h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.source}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-3">
                          <h3 className="flex items-center gap-2 font-medium text-blue-600 text-sm mb-1">
                            <Image src={ICONS.marketPotential} alt="" width={20} height={20} />
                            Market Potential
                          </h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.market_potential}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-3">
                          <h3 className="flex items-center gap-2 font-medium text-blue-600 text-sm mb-1">
                            <Image src={ICONS.strategy} alt="" width={20} height={20} />
                            Strategy
                          </h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.strategy}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-3">
                          <h3 className="flex items-center gap-2 font-medium text-blue-600 text-sm mb-1">
                            <Image src={ICONS.marketing} alt="" width={20} height={20} />
                            Marketing
                          </h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {idea.marketing}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-3">
                          <h3 className="flex items-center gap-2 font-medium text-blue-600 text-sm mb-1">
                            <Image src={ICONS.targetAudience} alt="" width={20} height={20} />
                            Target Audience
                          </h3>
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

          {/* Loading Card */}
          {!isStreamFinished && (
            <motion.div
              key="loading-card"
              className="absolute w-full"
              style={{
                zIndex: 5, // Below the last card (which is 10+)
                transformOrigin: 'center center'
              }}
              initial={{
                y: displayIdeas.length * CARD_OFFSET,
                scale: 1 - (displayIdeas.length * SCALE_FACTOR),
                opacity: 0,
              }}
              animate={{
                y: displayIdeas.length * CARD_OFFSET,
                scale: 1 - (displayIdeas.length * SCALE_FACTOR),
                opacity: 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 h-[180px] flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <TextShimmer
                  className="font-medium text-sm [--base-color:theme(colors.gray.400)] [--base-gradient-color:theme(colors.blue.500)]"
                  duration={1.5}
                >
                  Generating Idea {displayIdeas.length + 1}...
                </TextShimmer>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="px-6 pb-32 pt-4 flex flex-col items-center gap-4 shrink-0" style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom, 2rem))' }}>
        {errorMessage && (
          <div className="text-red-500 text-sm text-center max-w-md">
            {errorMessage}
          </div>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-3xl text-base font-medium transition-colors mb-2"
          >
            Retry Analysis
          </button>
        )}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-3 px-4 rounded-3xl border-2 border-gray-200 text-gray-700 text-base font-medium bg-white shadow hover:bg-gray-50 transition-colors"
            >
              Back Home
            </button>
          )}
          <button
            onClick={onRetake}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl text-base font-medium shadow transition-colors"
          >
            Retake Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
