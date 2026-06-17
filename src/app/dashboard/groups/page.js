"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Plus, Users, Trash2 } from "lucide-react";

const initialGroups = [
  { id: 1, name: "Apartment 4B", members: ["You", "Rahul", "Priya"], total: 4500, yourShare: 1500 },
  { id: 2, name: "Goa Trip", members: ["You", "Amit", "Sara", "Raj"], total: 12000, yourShare: 3000 },
];

export default function GroupsPage() {
  const [groups, setGroups] = useState(initialGroups);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", members: "" });

  const handleCreate = (e) => {
    e.preventDefault();
    const newGroup = {
      id: Date.now(),
      name: form.name,
      members: ["You", ...form.members.split(",").map((m) => m.trim()).filter(Boolean)],
      total: 0,
      yourShare: 0,
    };
    setGroups((prev) => [newGroup, ...prev]);
    setForm({ name: "", members: "" });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-mist">Groups</h1>
          <p className="text-muted mt-1">Split expenses with friends and family</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-sage hover:bg-sage-deep text-ink font-semibold px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} />
          New Group
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-xl border border-white/[0.08] p-6">
          <h2 className="text-lg font-semibold text-mist mb-4">Create New Group</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-2">Group Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Apartment 4B"
                className="w-full bg-white/5 border border-line rounded-lg px-3 py-2 text-mist outline-none focus:ring-2 focus:ring-sage/50"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Members (comma separated)</label>
              <input
                type="text"
                value={form.members}
                onChange={(e) => setForm({ ...form, members: e.target.value })}
                placeholder="e.g. Rahul, Priya, Amit"
                className="w-full bg-white/5 border border-line rounded-lg px-3 py-2 text-mist outline-none focus:ring-2 focus:ring-sage/50"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-sage text-ink font-semibold px-6 py-2 rounded-lg transition">
                Create Group
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white/5 hover:bg-white/10 text-mist font-medium px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="glass rounded-xl border border-white/[0.08] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                  <Users size={20} className="text-sage" />
                </div>
                <div>
                  <h3 className="font-semibold text-mist">{group.name}</h3>
                  <p className="text-xs text-muted">{group.members.length} members</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(group.id)}
                className="p-2 hover:bg-red-500/10 rounded-lg transition text-muted hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {group.members.map((m) => (
                <span key={m} className="text-xs bg-white/10 text-muted px-2 py-0.5 rounded-full">
                  {m}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-line">
              <div>
                <p className="text-xs text-muted">Total Expenses</p>
                <p className="font-bold text-mist">₹{group.total.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Your Share</p>
                <p className="font-bold text-sage">₹{group.yourShare.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
