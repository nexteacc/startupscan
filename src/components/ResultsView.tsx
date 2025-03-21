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
}

const ResultsView: React.FC<ResultsViewProps> = ({ ideas, onRetake }) => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center mb-4">✨ 创业灵感 ✨</h1>

      {ideas.map((idea, index) => (
        <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">📍 灵感来源: {idea.source}</h2>
          <p className="text-gray-700 mb-2">💡 赚钱技巧: {idea.strategy}</p>
          <p className="text-sm text-gray-500 mb-2">📢 种草文案: {idea.marketing}</p>
          <p className="text-sm text-gray-500">🚀 市场潜力: {idea.market_potential}</p>
          <p className="text-sm text-gray-500">🎯 目标人群: {idea.target_audience}</p>
        </div>
      ))}

      <button
        onClick={onRetake}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        重新生成
      </button>
    </div>
  );
};

export default ResultsView;