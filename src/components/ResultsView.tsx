import React from "react";

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

const ResultsView: React.FC<ResultsViewProps> = ({ ideas, onRetake, onBack }) => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center mb-4">✨ Startup Inspiration ✨</h1>

      {ideas.map((idea, index) => (
        <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">📍 Source: {idea.source}</h2>
          <p className="text-gray-700 mb-2">💡 Strategy: {idea.strategy}</p>
          <p className="text-sm text-gray-500 mb-2">📢 Marketing: {idea.marketing}</p>
          <p className="text-sm text-gray-500">🚀 Market Potential: {idea.market_potential}</p>
          <p className="text-sm text-gray-500">🎯 Target Audience: {idea.target_audience}</p>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          返回首页
        </button>
        <button
          onClick={onRetake}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          重新拍摄
        </button>
      </div>
    </div>
  );
};

export default ResultsView;