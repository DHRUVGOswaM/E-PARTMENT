'use client';

import { useEffect, useState } from 'react';
import { useUser, useAuth, SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function NoticeBoard() {
  const { user, isSignedIn } = useUser();
  const { getToken, signOut } = useAuth();
  const router = useRouter();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const ADMIN_EMAILS = ["rishabhsikarwar1000@gmail.com"]; // Add more if needed
const isAdmin = ADMIN_EMAILS.includes(user?.emailAddresses[0].emailAddress);

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    setLoading(true);
    try {
      const res = await fetch('/api/notice-board');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch notices');
      setNotices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = await getToken();

      const res = await fetch('/api/notice-board', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingId,
          content,
          postedBy: user.fullName || user.emailAddresses[0].emailAddress,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to post');

      if (editingId) {
        setNotices((prev) =>
          prev.map((n) => (n.id === result.id ? result : n))
        );
        setEditingId(null);
      } else {
        setNotices((prev) => [result, ...prev]);
      }

      setContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const token = await getToken();
      const res = await fetch('/api/notice-board', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete');

      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (!isSignedIn) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Join a Society to View Notices</h1>
        <SignIn path="/notice-board" routing="path" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notice Board</h1>
       
      </div>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <textarea
            placeholder="Write a notice..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full border p-2 rounded"
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {submitting
              ? editingId
                ? 'Updating...'
                : 'Posting...'
              : editingId
              ? 'Update Notice'
              : 'Post Notice'}
          </button>
        </form>
      )}

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {loading ? (
        <p>Loading notices...</p>
      ) : notices.length === 0 ? (
        <p>No notices yet.</p>
      ) : (
        <ul className="space-y-2">
          {notices.map((notice) => (
            <li key={notice.id} className="border p-3 rounded bg-white shadow">
              <p className="text-gray-800">{notice.content}</p>

            <p className="text-xs text-gray-500">
  Posted by <strong>{notice.posted_by}</strong>{' '}
  {ADMIN_EMAILS.includes(notice.posted_by_email) && (
    <span className="text-yellow-600 font-semibold ml-1">🔧 Admin</span>
  )}
  on {new Date(notice.created_at).toLocaleString()}
</p>

              {isAdmin && (
                <div className="flex gap-4 mt-2 text-sm">
                  <button
                    onClick={() => {
                      setContent(notice.content);
                      setEditingId(notice.id);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}