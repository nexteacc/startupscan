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

const CARD_HEIGHT = 250; // Approximate height of a card, similar to Gist
const CARD_TITLE_HEIGHT = 50; // Approximate height of the visible part of a stacked card
const CARD_PADDING = 10; // Padding for interpolation, similar to Gist
const EXPANDED_CARD_TOP_MARGIN = 20; // Fine-tuned margin from top for expanded card
const SCROLL_THRESHOLD_PER_CARD = CARD_HEIGHT * 0.8; // Scroll distance to transition one card

const ResultsView: React.FC<ResultsViewProps> = ({ ideas, onRetake }: ResultsViewProps) => {
  const displayIdeas = ideas.slice(0, 5);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });

  // activeIndex will determine which card to scroll to, but animation is purely scroll-driven
  const [activeIndex, setActiveIndex] = useState<number | null>(0); 

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
    if (scrollRef.current) {
      // Scroll to a position where the clicked card is fully expanded
      // This target scrollY needs to be calculated such that the card's transform places it correctly.
      // For simplicity, let's say each card "occupies" SCROLL_THRESHOLD_PER_CARD of scroll space.
      const targetScrollY = index * SCROLL_THRESHOLD_PER_CARD;
      scrollRef.current.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  };

  return (
    <div 
      ref={scrollRef}
      className="min-h-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col pt-8 overflow-y-auto relative"
    >
      {/* This div acts as the scrollable content area, its height determines total scroll range */}
      {/* Ensure enough scroll height for all cards to be focused + some buffer for the last card to expand fully */}
      {/* Plus space for the button at the bottom */}
      <div style={{ height: `${displayIdeas.length * SCROLL_THRESHOLD_PER_CARD + window.innerHeight}px` }}> 
      {/* Header */}
      <div className="text-center pb-8 sticky top-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-50 pt-8">
        <h1 className="text-3xl font-bold text-gray-800">✨ Next BIG TOY ✨</h1>
      </div>

      {/* Card Stack Container - Adjusted for top alignment and Wallet feel */}
      {/* This container's height should be enough to allow cards to stack and one to expand */}
      {/* The actual scrolling will happen in the parent `scrollRef` div */}
      <div className="flex-1 flex flex-col items-center px-4 relative mt-4"> {/* Adjusted marginTop from -60px to 4, to give some space below header */} 
        
        {/* The height of this container should be enough for one expanded card and parts of others. Or, make it dynamic based on scroll. */}
        {/* For now, let's ensure it's tall enough for the expanded card and some stacking context. */}
        <div className="relative w-full max-w-md" style={{ height: `${CARD_HEIGHT + (displayIdeas.length -1) * CARD_TITLE_HEIGHT + 100}px` }}> {/* Adjusted height to better fit screen */}
          {displayIdeas.map((idea, index) => {
            // Define the scroll range for this card's animation
            // When scrollY is around `index * SCROLL_THRESHOLD_PER_CARD`, this card should be prominent.
            const cardScrollStart = (index - 1) * SCROLL_THRESHOLD_PER_CARD;
            const cardScrollCenter = index * SCROLL_THRESHOLD_PER_CARD;
            const cardScrollEnd = (index + 1) * SCROLL_THRESHOLD_PER_CARD;

            const initialYOffset = index * CARD_OFFSET;
            const initialScale = 1 - (index * SCALE_FACTOR);

            // Transform for Y position
            // When card is active (scrollY is near cardScrollCenter), it moves to EXPANDED_CARD_TOP_MARGIN
            // Otherwise, it's stacked based on its index or pushed further down/up.
            const y = useTransform(
              scrollY,
              [cardScrollStart, cardScrollCenter, cardScrollEnd],
              [
                initialYOffset + SCROLL_THRESHOLD_PER_CARD * 0.5, // Pushed down if scrolling past it upwards
                EXPANDED_CARD_TOP_MARGIN - (index * CARD_OFFSET), // When active, moves to top, counteracting initial offset
                initialYOffset - SCROLL_THRESHOLD_PER_CARD * 0.5  // Pushed up if scrolling past it downwards
              ]
            );
            
            // More refined Y transform for Wallet-like stacking and expansion:
            // Card i should be at `EXPANDED_CARD_TOP_MARGIN` when `scrollY` is `i * SCROLL_THRESHOLD_PER_CARD`.
            // When `scrollY` is `(i-1) * SCROLL_THRESHOLD_PER_CARD`, card `i` should be at `EXPANDED_CARD_TOP_MARGIN + CARD_OFFSET` and scaled down.
            // When `scrollY` is `(i+1) * SCROLL_THRESHOLD_PER_CARD`, card `i` should be at `EXPANDED_CARD_TOP_MARGIN - CARD_OFFSET` (or some other position indicating it's being scrolled away).
            // Re-implementing animation logic based on the Gist
            // The core idea is to interpolate `translateY` based on `scrollY`
            const inputRange = [-CARD_HEIGHT, 0];
            const outputRange = [
              CARD_HEIGHT * index, 
              (CARD_HEIGHT - CARD_TITLE_HEIGHT) * -index
            ];

            if (index > 0) {
              inputRange.push(CARD_PADDING * index);
              outputRange.push((CARD_HEIGHT - CARD_PADDING) * -index - (CARD_TITLE_HEIGHT * index) + CARD_PADDING ); // Adjusted to better match Gist logic
            }

            const y = useTransform(scrollY, value => {
              // This transform maps the global scrollY to a per-card animation progress
              // We want the card to be fully visible when scrollY is at a point corresponding to this card's turn
              // And stacked when scrollY is 0 (or before its turn)
              // And scrolled away when scrollY is past its turn

              // Let's define a scroll segment for each card
              const scrollSegmentStart = (index) * SCROLL_THRESHOLD_PER_CARD;
              const scrollSegmentEnd = (index + 1) * SCROLL_THRESHOLD_PER_CARD;
              
              // Relative scroll position within this card's segment (0 to 1)
              let relativeScroll = (value - scrollSegmentStart) / SCROLL_THRESHOLD_PER_CARD;
              relativeScroll = Math.max(0, Math.min(1, relativeScroll)); // Clamp between 0 and 1

              // When relativeScroll is 0, card is stacked (or just starting to expand)
              // When relativeScroll is 1, card is fully expanded (or just starting to collapse)
              
              // Interpolate Y based on Gist logic, adapted for framer-motion
              // The Gist uses a single Animated.Value for all cards, here scrollY is global
              // We need to derive a similar effect. Let's consider the state when this card is 'active'.
              // When scrollY makes this card the 'active' one (e.g., scrollY is around index * SCROLL_THRESHOLD_PER_CARD)
              // its y should be EXPANDED_CARD_TOP_MARGIN.
              // Otherwise, it's stacked.

              // Simplified Gist-like interpolation for translateY
              // `t` is like the `y` value from the Gist, but derived from our global `scrollY`
              // When `value` (our scrollY) is 0, all cards are stacked.
              // As `value` increases, cards expand one by one.
              const t = value - (index * (CARD_HEIGHT - CARD_TITLE_HEIGHT)); 
              
              let newY;
              if (t <= 0) { // Card is stacked or in the process of being revealed from stack
                newY = EXPANDED_CARD_TOP_MARGIN + index * CARD_TITLE_HEIGHT + t * 0.3; // Apply some of t to show movement
              } else { // Card is expanded or being scrolled away
                newY = EXPANDED_CARD_TOP_MARGIN - t * 0.7; // Move up as it's scrolled past
              }
              // Add a base offset for initial stacking, which is counteracted as card becomes active
              newY += index * CARD_TITLE_HEIGHT * (1 - relativeScroll); 
              newY = Math.max(EXPANDED_CARD_TOP_MARGIN - (relativeScroll * CARD_HEIGHT * 0.5) , newY - (relativeScroll * CARD_TITLE_HEIGHT * index) );

              // Let's try a direct adaptation of the Gist's interpolation logic
              // The Gist's `y` is a direct animation value. Our `scrollY` is the driver.
              // We need to map `scrollY` to a range that makes sense for the Gist's `inputRange` and `outputRange`.
              // Let `y_gist_equivalent` be the value that would be passed to `interpolate` in the Gist.
              // When `scrollY` = 0, `y_gist_equivalent` should be 0 (initial stacked state).
              // When `scrollY` = `SCROLL_THRESHOLD_PER_CARD`, the first card is fully expanded.
              // This means `y_gist_equivalent` should be around `-CARD_HEIGHT` for the first card to be at the top.
              
              // This mapping is tricky because the Gist's `y` is shared and drives all cards.
              // Our `scrollY` is global. Let's simplify: when this card is active, it's at the top.
              // When it's not, it's stacked. The transition is driven by `scrollY` relative to `index * SCROLL_THRESHOLD_PER_CARD`.

              const progress = Math.min(1, Math.max(0, (value - (index * SCROLL_THRESHOLD_PER_CARD - CARD_HEIGHT * 0.5)) / (SCROLL_THRESHOLD_PER_CARD + CARD_HEIGHT*0.5) ));              
              // `progress` = 0 means card is fully stacked below.
              // `progress` = 1 means card is fully expanded at top.
              
              const stackedY = EXPANDED_CARD_TOP_MARGIN + index * CARD_TITLE_HEIGHT;
              const expandedY = EXPANDED_CARD_TOP_MARGIN;
              
              // Interpolate between stacked and expanded based on progress
              // And allow it to scroll off screen when progress > 1 (effectively)
              const y_final = stackedY * (1 - progress) + expandedY * progress - Math.max(0, (value - (index + 0.5) * SCROLL_THRESHOLD_PER_CARD)) * 0.5;
              return y_final;
            });

            const scale = useTransform(scrollY, value => {
              const progress = Math.min(1, Math.max(0, (value - (index * SCROLL_THRESHOLD_PER_CARD - CARD_HEIGHT * 0.5)) / (SCROLL_THRESHOLD_PER_CARD + CARD_HEIGHT*0.5) )); // Same progress as y
              const stackedScale = 1 - (index * 0.05); // More pronounced scale difference
              const expandedScale = 1;
              return stackedScale * (1 - progress) + expandedScale * progress;
            });

            // Use 'y' instead of 'dynamicY'
            const dynamicY = y;

            const opacity = useTransform(
              scrollY,
              [cardScrollStart, cardScrollCenter, cardScrollEnd],
              [0.7, 1, 0.7]
            );

            // Determine zIndex: active card is highest.
            // This needs to be dynamic based on scroll, or simply fixed if transforms handle overlap.
            // For simplicity, let's use a fixed stacking order for now, but the 'active' card should visually be on top.
            // The `y` and `scale` transforms should naturally handle most of the visual layering.
            const zIndex = displayIdeas.length - index; 

            return (
              <motion.div
                key={idea.source + index}
                className={`absolute w-full cursor-pointer`}
                style={{
                  zIndex,
                  transformOrigin: 'center center',
                  y: dynamicY, // Use the transformed y
                  scale: scale,   // Use the transformed scale
                  opacity: opacity,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" // Simplified shadow for now
                }}
                onClick={() => handleCardClick(index)}
              >
                {/* Card Content - structure remains similar, but height animation might change */}
                {/* The expanded state is now primarily controlled by scroll position */}
                <motion.div
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200`}
                  // Height could also be transformed, or set to 'auto' for expanded content
                  // For now, let's use a fixed height for unexpanded, and rely on content for expanded.
                  style={{ height: 'auto' }} // Let content define height, especially when scaled
                >
                  <div className={`p-5`}>
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-2">💡</div>
                      <h2 className="text-lg font-semibold text-gray-700">
                        创业想法 {index + 1}
                      </h2>
                    </div>

                    {/* Content: Always render all content, visibility/layout handled by parent scale/opacity */}
                    {/* We can use useTransform to conditionally show more detail based on scale or a scroll threshold */}
                    {/* For now, always show full detail, rely on scale to make it appear/disappear */}
                    <motion.div
                      className="space-y-3"
                      // Animate opacity of details based on scale, to fade in/out smoothly
                      style={{
                        opacity: useTransform(scale, [initialScale * 0.95, 1], [0, 1]),
                        // Prevent interaction when scaled down
                        pointerEvents: useTransform(scale, (s) => (s < 0.95 ? 'none' : 'auto'))
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

      {/* Bottom Actions - needs to be sticky at the bottom of the viewport, not the scrollable content */}
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
      {/* Header */}
      <div className="text-center pb-8">
        <h1 className="text-3xl font-bold text-gray-800">✨ Next BIG TOY ✨</h1>
      </div>

      {/* Card Stack Container - Adjusted for top alignment and Wallet feel */}
      <div className="flex-1 flex flex-col items-center px-4 relative">
        {/* Background Overlay for Expanded State */}
        {expandedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-30" // Lower z-index than expanded card
            onClick={handleBackgroundClick} // Click overlay to close
          />
        )}
        
        <div className="relative w-full max-w-md" style={{ height: `${displayIdeas.length * 60 + 200}px` }}> {/* Adjust height based on cards */}
          {displayIdeas.map((idea, index) => {
            const isExpanded = expandedIndex === index;
            // Determine the visual stacking order. Clicked card comes to front.
            let displayOrder = displayIdeas.length - 1 - index;
            if (expandedIndex !== null) {
              if (index === expandedIndex) {
                displayOrder = displayIdeas.length; // Expanded card is topmost
              } else if (index > expandedIndex) {
                displayOrder = displayIdeas.length - 1 - index + 1; 
              } else {
                displayOrder = displayIdeas.length - 1 - index;
              }
            }

            const zIndex = isExpanded ? 40 : 10 + displayOrder;
            const initialYOffset = index * 30; // Initial stacking closer like Wallet
            const initialScale = 1 - (index * 0.03); // Subtle scaling for depth

            return (
              <motion.div
                key={idea.source + index} // Ensure unique key if ideas can change
                className={`absolute w-full cursor-pointer`}
                style={{
                  zIndex,
                  transformOrigin: 'center center' // Changed for more direct expansion
                }}
                initial={{
                  y: initialYOffset,
                  scale: initialScale,
                  opacity: 1, // All cards initially visible
                }}
                animate={{
                  y: isExpanded ? (window.innerHeight * 0.1) : initialYOffset + (expandedIndex !== null && index > expandedIndex ? 150 : 0), // Move card to near top when expanded, shift others down
                  scale: isExpanded ? 1 : initialScale,
                  opacity: isExpanded ? 1 : (expandedIndex !== null && index !== expandedIndex ? 0.7 : 1),
                  rotateX: 0, // No X rotation for Wallet style
                  boxShadow: isExpanded ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={() => handleCardClick(index)} // Click any card to expand/collapse
              >
                <motion.div
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200`}
                  animate={{
                    height: isExpanded ? 'auto' : '180px', // Adjust initial height
                    borderRadius: isExpanded ? "1.25rem" : "1rem"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  <div className={`p-5 ${isExpanded ? 'pb-8' : ''}`}> {/* More padding for expanded */}
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
                        className="space-y-3" // Removed max-h and overflow-y for single screen attempt
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
                        {/* Removed Close Button as per request */}
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