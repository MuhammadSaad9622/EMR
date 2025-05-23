import React from 'react';
import { useParams } from 'react-router-dom';

const VisitNotes: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Visit Notes</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Visit ID: {id}</p>
        {/* Visit notes content will be implemented later */}
      </div>
    </div>
  );
};

export default VisitNotes;