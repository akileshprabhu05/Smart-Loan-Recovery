import React from 'react';
import { Lightbulb } from 'lucide-react';

const AIStrategyCard = ({ recommendation, details}) => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-5 rounded-lg shadow-sm">
      <div className="flex items-center mb-3">
        <Lightbulb className="text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-blue-800">
          Suggested Strategy
        </h2>
      </div>
      <p className="text-gray-800 mb-2"><strong>Suggestion:</strong> {recommendation}</p>
      <p className="mt-2 text-gray-700">{details}</p>


    </div>
  );
};

export default AIStrategyCard;
