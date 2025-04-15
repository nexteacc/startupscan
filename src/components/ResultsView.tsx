import React, { useState } from "react";

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

const ResultsView: React.FC<ResultsViewProps> = ({ ideas, onRetake, onBack }) => {
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState<number | null>(null);
  const displayIdeas = ideas.slice(0, 5); 

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
  
      {ideas.length === 0 && (
        <div style={{color: 'red', marginBottom: 20}}>没有收到数据</div>
      )}
   
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>✨ Next BIG TOY ✨</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {displayIdeas.map((idea, index) => (
          <div 
            key={index}
            style={{
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedIdeaIndex(index)}
          >
            <h3>Idea {index + 1}</h3>
            <p>Source: {idea.source}</p>
          </div>
        ))}
      </div>

     
      {selectedIdeaIndex !== null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255,255,255,0.98)',
          padding: '32px 12px 16px 12px',
          borderRadius: '0',  // 移动端全屏弹窗通常不需要圆角
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 100,
          overflowY: 'auto', // 适配内容超出
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }}>
          <button 
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              background: 'none',
              border: 'none',
              fontSize: '26px',
              cursor: 'pointer',
              color: '#222'
            }}
            onClick={() => setSelectedIdeaIndex(null)}
            aria-label="关闭弹窗"
          >
            ×
          </button>
          <h2 style={{marginTop: '32px', fontSize: '22px'}}>📍 Source: {ideas[selectedIdeaIndex].source}</h2>
          <p style={{margin: '16px 0', fontSize: '18px'}}><strong>Strategy:</strong> {ideas[selectedIdeaIndex].strategy}</p>
          <p style={{margin: '10px 0'}}><strong>Marketing:</strong> {ideas[selectedIdeaIndex].marketing}</p>
          <p style={{margin: '10px 0'}}><strong>Market Potential:</strong> {ideas[selectedIdeaIndex].market_potential}</p>
          <p style={{margin: '10px 0'}}><strong>Target Audience:</strong> {ideas[selectedIdeaIndex].target_audience}</p>
        </div>
      )}

   
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <button 
          style={{
            padding: '10px 20px',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          onClick={onRetake}
        >
          📸 Retake
        </button>

      </div>
    </div>
  );
};

export default ResultsView;