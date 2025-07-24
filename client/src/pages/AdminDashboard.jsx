import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [blockEmail, setBlockEmail] = useState({}); // Change to object
  const [blockMsg, setBlockMsg] = useState({}); // Change to object

  const token = localStorage.getItem('adminToken');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/news`);
        const data = Array.isArray(res.data) ? res.data : (res.data.news || []);
        setNewsList(data);
      } catch (err) {
        setNewsList([]);
      }
    };
    fetchNews();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      if (editId) {
        // Update news
        await axios.put(
          `${API_BASE_URL}/api/news/${editId}`,
          { title, content, image },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMsg('✅ News updated successfully');
      } else {
        // Add news
        await axios.post(
          `${API_BASE_URL}/api/news`,
          { title, content, image },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMsg('✅ News posted successfully');
      }

      // Refresh news list
      const res = await axios.get(`${API_BASE_URL}/api/news`);
      setNewsList(res.data);

      // Clear form
      setTitle('');
      setContent('');
      setImage('');
      setEditId(null);
    } catch (err) {
      setMsg(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (news) => {
    setTitle(news.title);
    setContent(news.content);
    setImage(news.image);
    setEditId(news._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this news?');
    if (!confirm) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewsList(newsList.filter((n) => n._id !== id));
    } catch (err) {
      alert('❌ Failed to delete news');
    }
  };

  const handleBlockUser = async (newsId) => {
    if (!blockEmail[newsId]) return alert('Enter email to block');

    try {
      await axios.patch(
        `${API_BASE_URL}/api/news/${newsId}/block-user`,
        { email: blockEmail[newsId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlockMsg((prev) => ({ ...prev, [newsId]: '✅ User blocked for this post' }));
      setBlockEmail({}); // Clear all fields after blocking
    } catch (err) {
      setBlockMsg((prev) => ({ ...prev, [newsId]: `❌ ${err.response?.data?.message || 'Error blocking user'}` }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Add / Edit News */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">{editId ? 'Edit News' : 'Add News'}</h3>
        {msg && <p className="mb-2 text-sm">{msg}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Content"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="md:col-span-2 border p-2 rounded"
            required
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (editId ? 'Updating...' : 'Publishing...') : editId ? 'Update News' : 'Publish News'}
          </button>
        </form>
      </div>

      {/* All News Section */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">All News</h3>
        {newsList.length === 0 ? (
          <p>📝 No news added yet.</p>
        ) : (
          newsList.map((news) => (
            <div
              key={news._id}
              className="border-b py-4 flex flex-col gap-2 md:flex-row md:justify-between md:items-center"
            >
              <div>
                {news.image && (
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full max-w-xs mb-2 rounded object-cover"
                    style={{ maxHeight: 150 }}
                  />
                )}
                <h4 className="text-lg font-bold">{news.title}</h4>
                <p className="text-sm text-gray-600">{news.content}</p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleEdit(news)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(news._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
              <div className="flex flex-col mt-2 md:mt-0 md:ml-4">
                <input
                  type="email"
                  placeholder="User email to block"
                  value={blockEmail[news._id] || ''}
                  onChange={(e) =>
                    setBlockEmail((prev) => ({ ...prev, [news._id]: e.target.value }))
                  }
                  className="border p-1 rounded mb-1"
                />
                <button
                  onClick={() => handleBlockUser(news._id)}
                  className="bg-black text-white px-2 py-1 rounded hover:bg-gray-800"
                >
                  Block User
                </button>
                {blockMsg[news._id] && <p className="text-xs mt-1 text-red-600">{blockMsg[news._id]}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
