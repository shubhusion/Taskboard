'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Task = { id: number; title: string; status: string };

const STATUSES = ['todo', 'in-progress', 'done'];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('todo');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTasks(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status }),
      });
      if (res.ok) {
        setTitle('');
        setStatus('todo');
        fetchTasks();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create task');
      }
    } catch {
      setError('Network error');
    } finally {
      setCreating(false);
    }
  }

  async function updateStatus(id: number, newStatus: string) {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      }
    } catch {
      setError('Update failed');
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const statusColor = (s: string) => {
    if (s === 'done') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'in-progress') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Task Board</h1>
          <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleCreate} className="bg-white rounded shadow-sm p-4 mb-5">
          <h2 className="font-medium mb-3">New Task</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="flex-1 p-2 border rounded text-black placeholder:text-gray-400"
            />
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="p-2 border rounded text-black"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Adding...' : 'Add'}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>

        <div className="bg-white rounded shadow-sm">
          <h2 className="font-medium p-4 border-b">Tasks</h2>
          {loading ? (
            <p className="p-6 text-center text-gray-500">Loading...</p>
          ) : tasks.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No tasks yet</p>
          ) : (
            <ul>
              {tasks.map(task => (
                <li key={task.id} className="p-3 border-b last:border-0 flex justify-between items-center gap-2">
                  <span className="text-gray-800">{task.title}</span>
                  <select
                    value={task.status}
                    onChange={e => updateStatus(task.id, e.target.value)}
                    className={`px-2 py-1 text-sm rounded border ${statusColor(task.status)}`}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
