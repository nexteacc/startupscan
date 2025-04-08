import React, { useState, useEffect } from "react";
import { StyledWrapper } from "./ResultsView.styles"; // Import styled wrapper

// Keep Idea interface definition
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
}

// --- ResultsView Component ---
const ResultsView: React.FC<ResultsViewProps> = ({ ideas, onRetake, onBack }) => {
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState<number | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false); // Control visibility for animation

  const handleCardClick = (index: number) => {
    // Prevent clicking if detail view is already visible or animating out
    if (isDetailVisible && selectedIdeaIndex !== null) return;
    setSelectedIdeaIndex(index);
    setIsDetailVisible(true); // Trigger detail view appearance
  };


  const ANIMATION_DURATION = 350; // Duration in milliseconds
  
  const handleCloseDetail = () => {
    setIsDetailVisible(false);
    setTimeout(() => setSelectedIdeaIndex(null), ANIMATION_DURATION);
  };


  // Close detail view if Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDetailVisible) {
        handleCloseDetail();
      }
    };

    // Add listener only when detail view is visible
    if (isDetailVisible) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup listener on component unmount or when detail view is closed
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDetailVisible]); // Dependency array includes isDetailVisible

  const selectedIdea = selectedIdeaIndex !== null ? ideas[selectedIdeaIndex] : null;

  // Ensure we only try to render cards if ideas exist
  const displayIdeas = ideas.slice(0, 5); // Still limit to 5 cards

  return (
    <StyledWrapper>
       <h1 className="text-xl font-bold text-center mb-6">✨ Next BIG TOY ✨</h1>

       
      <div className="main">
    
        <div className="hint-card">
          <span>💡</span>
          Hover to see Ideas
        </div>

        
        {displayIdeas.map((_, index) => (  
          <div
            key={index}
            className={`card ${index === 0 ? "center-card" : "outer-card"}`}
            onClick={() => handleCardClick(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(index)}
          >
            💡
          </div>
        ))}
      </div>


      {selectedIdeaIndex !== null && (
         <>
         
           <div
              className={`detail-backdrop ${isDetailVisible ? 'visible' : ''}`}
              onClick={handleCloseDetail}
              style={{ animation: isDetailVisible ? 'fadeIn 0.3s ease-out forwards' : 'fadeOut 0.3s ease-in forwards' }}
            />
          
           <div
             className={`detail-view ${isDetailVisible ? 'visible' : ''}`}
             role="dialog"
             aria-modal="true"
             aria-labelledby="detail-title"
             style={{ animation: isDetailVisible ? 'fadeInScale 0.35s cubic-bezier(0.165, 0.84, 0.44, 1) forwards' : 'fadeOutScale 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards' }}
             >
              <button
                 className="detail-close-button"
                 onClick={handleCloseDetail}
                 aria-label="Close detail view"
              >
                ×
              </button>
             <h2 id="detail-title">📍 Source: {selectedIdea?.source}</h2>
             <p><strong>Strategy:</strong> {selectedIdea?.strategy}</p>
             <p><strong>Marketing:</strong> {selectedIdea?.marketing}</p>
             <p><strong>Market Potential:</strong> {selectedIdea?.market_potential}</p>
             <p><strong>Target Audience:</strong> {selectedIdea?.target_audience}</p>
           </div>
         </>
       )}

      
      {selectedIdeaIndex === null && (
        <div className="action-buttons">
          <button className="action-button" onClick={onRetake}>
            📸 Retake
          </button>
          {onBack && (
             <button className="action-button secondary" onClick={onBack}>
               ⬅️ Back
             </button>
          )}
        </div>
      )}
    </StyledWrapper>
  );
};

export default ResultsView;