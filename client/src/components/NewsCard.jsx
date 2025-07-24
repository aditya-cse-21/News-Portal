import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ news }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/news/${news._id}`)}
    >
      <h2 className="text-xl font-semibold text-blue-700">{news.title}</h2>
      <p className="text-gray-600 mt-2">
        {news.content.slice(0, 100)}...
      </p>
    </div>
  );
};

export default NewsCard;
