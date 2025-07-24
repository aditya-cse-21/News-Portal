import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const SingleNewsPage = () => {
  const { id } = useParams();
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();

  const [news, setNews] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let headers = {};
        let token = null;
        if (isAuthenticated) {
          token = await getAccessTokenSilently();
          headers.Authorization = `Bearer ${token}`;
        }
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_BASE_URL}/api/news/${id}`, { headers });
        setNews(res.data.news);
        setBlocked(res.data.blocked);
        setComments(res.data.comments);
      } catch (err) {
        console.error('fetchNews error:', err.message);
      }
    };

    fetchNews();
  }, [id, isAuthenticated]);

  const handleLikeDislike = async (type) => {
    if (!isAuthenticated) {
      alert("Please login to like or dislike.");
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const url = `${API_BASE_URL}/api/news/${id}/${type}`;
      await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh news
      const API_BASE_URL_2 = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await axios.get(`${API_BASE_URL_2}/api/news/${id}`);
      setNews(res.data.news);
    } catch (err) {
      console.error('Action failed:', err.message);
    }
  };

  const submitComment = async () => {
    if (!comment.trim()) return;

    if (!isAuthenticated) {
      alert("Please login to comment.");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await axios.post(
        `${API_BASE_URL}/api/news/${id}/comment`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComment('');
      // Instantly add the new comment to the UI
      setComments((prev) => [
        ...prev,
        {
          _id: res.data.comment._id,
          userEmail: user.email,
          content: comment,
        },
      ]);
    } catch (err) {
      console.error('Failed to comment:', err.message);
    }
  };

  if (!news) return <p className="p-6">Loading...</p>;

  if (blocked) return (
    <div className="p-6 text-red-600 font-semibold text-xl">
      ❌ You are blocked from viewing this post.
    </div>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          className="w-full max-w-2xl mb-4 rounded object-cover"
          style={{ maxHeight: 300 }}
        />
      )}
      <h1 className="text-2xl font-bold mb-4">{news.title}</h1>
      <p className="text-gray-700 mb-4">{news.content}</p>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleLikeDislike('like')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          👍 {news.likes.length}
        </button>
        <button
          onClick={() => handleLikeDislike('dislike')}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          👎 {news.dislikes.length}
        </button>
      </div>

      <hr className="my-4" />

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Add a Comment:</h3>
        <textarea
          className="w-full border rounded p-2 mb-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        <button
          onClick={submitComment}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">All Comments:</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="bg-gray-100 rounded p-2 mb-2">
              <strong>{c.userEmail}:</strong> {c.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SingleNewsPage;
