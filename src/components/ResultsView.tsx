import React, { useState } from "react";

interface Idea {
  source: string;
  strategy: string;
  marketing: string;
  market_potential: string;
  target_audience: string;
}

// 在ResultsView组件中添加错误状态和重试按钮
interface ResultsViewProps {
  ideas: Idea[];
  onRetake: () => void;
  onBack?: () => void;
  errorMessage?: string;  // 添加错误信息属性
  onRetry?: () => void;   // 添加重试回调
}

const ResultsView: React.FC<ResultsViewProps> = ({ ideas, onRetake, onBack }) => {
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState<number | null>(null);
  const displayIdeas = ideas.slice(0, 5); 

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* 新增：空数据提示 */}
      {ideas.length === 0 && (
        <div style={{color: 'red', marginBottom: 20}}>没有收到数据</div>
      )}
      {/* 原有展示逻辑 */}
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
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 100
        }}>
          <button 
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedIdeaIndex(null)}
          >
            ×
          </button>
          <h2>📍 Source: {ideas[selectedIdeaIndex].source}</h2>
          <p><strong>Strategy:</strong> {ideas[selectedIdeaIndex].strategy}</p>
          <p><strong>Marketing:</strong> {ideas[selectedIdeaIndex].marketing}</p>
          <p><strong>Market Potential:</strong> {ideas[selectedIdeaIndex].market_potential}</p>
          <p><strong>Target Audience:</strong> {ideas[selectedIdeaIndex].target_audience}</p>
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
        {onBack && (
          <button 
            style={{
              padding: '10px 20px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onClick={onBack}
          >
            ⬅️ Back
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultsView;