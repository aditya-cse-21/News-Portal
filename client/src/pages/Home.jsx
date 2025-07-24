import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/news');
        setNewsList(res.data);
      } catch (err) {
        console.error('Failed to fetch news:', err.message);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-blue-50 to-transparent min-h-[320px]">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4 leading-tight">
          Welcome to India's Fast and
          <br />
          Authentic News Portal
        </h1>
        <p className="text-lg text-center text-gray-600 max-w-2xl">Stay updated with the latest, most reliable news from across the country. Trusted by thousands for real, unbiased reporting.</p>
      </section>

      {/* Latest News Section */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <div
              key={news._id}
              className="bg-white rounded-xl shadow-md p-5 flex flex-col hover:shadow-xl transition-shadow duration-200"
            >
              {news.image && (
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-40 object-cover rounded-lg mb-4 border"
                />
              )}
              <h3 className="text-xl font-semibold mb-2 text-gray-900 truncate">{news.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {news.content.length > 120 ? news.content.slice(0, 120) + '...' : news.content}
              </p>
              <Link
                to={`/news/${news._id}`}
                className="mt-auto inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full bg-white border-t py-4 mt-8 text-center text-gray-500 text-sm">
        &copy; 2025 &middot; Made by Aditya
      </footer>
    </div>
  );
};

export default Home;
