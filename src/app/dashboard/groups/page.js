"use client";

import { useState } from "react";
import { Plus, Send, Check, X, Users } from "lucide-react";

/**
 * Groups Page
 * 
 * Route: /dashboard/groups
 * 
 * Features:
 * - Create groups
 * - Add members
 * - Split expenses
 * - Settle balances
 * - View group history
 * 
 * Similar to Splitwise functionality
 */

export default function GroupsPage() {
    const [groups] = useState([
        {
            id: 1,
            name: "Trip to Goa",
            members: [
                { name: "You", email: "you@example.com" },
                { name: "Ravi", email: "ravi@example.com" },
                { name: "Priya", email: "priya@example.com" },
            ],
            expenses: [
                { description: "Hotel", amount: 5000, paidBy: "You", date: "2024-06-10" },
                { description: "Food", amount: 2000, paidBy: "Ravi", date: "2024-06-11" },
            ],
            settled: [
                { from: "Ravi", to: "You", amount: 833 },
                { from: "Priya", to: "You", amount: 1667 },
            ],
        },
        {
            id: 2,
            name: "Flat Expenses",
            members: [
                { name: "You", email: "you@example.com" },
                { name: "Amit", email: "amit@example.com" },
            ],
            expenses: [
                { description: "Rent", amount: 15000, paidBy: "You", date: "2024-06-01" },
                { description: "WiFi", amount: 1000, paidBy: "Amit", date: "2024-06-05" },
            ],
            settled: [
                { from: "Amit", to: "You", amount: 7500 },
            ],
        },
    ]);

    const [showAddGroup, setShowAddGroup] = useState(false);

    return (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-mist">
                        Groups & Splits
                    </h1>
                    <p className="text-muted mt-2">
                        Split expenses with friends and family
                    </p>
                </div>
                <button
                    onClick={() => setShowAddGroup(true)}
                    className="flex items-center gap-2 bg-sage hover:bg-sage-deep text-ink font-semibold px-4 py-2 rounded-lg transition"
                >
                    <Plus size={20} />
                    New Group
                </button>
            </div>

            {/* Groups List */}
            <div className="space-y-6">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className="glass rounded-xl border border-white/[0.08] overflow-hidden"
                    >
                        {/* Group Header */}
                        <div className="p-6 border-b border-line">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-mist">
                                        {group.name}
                                    </h2>
                                    <p className="text-sm text-muted mt-1">
                                        {group.members.length} members
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {group.members.map((member, idx) => (
                                        <div
                                            key={idx}
                                            className="w-10 h-10 rounded-full bg-sage/20 border border-sage/30 flex items-center justify-center text-xs font-semibold text-sage"
                                            title={member.name}
                                        >
                                            {member.name.charAt(0)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Members */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-xs font-semibold text-muted uppercase mb-3">
                                    Members
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {group.members.map((member, idx) => (
                                        <div
                                            key={idx}
                                            className="px-3 py-1 rounded-full bg-sage/20 text-sage text-xs font-medium"
                                        >
                                            {member.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Expenses */}
                        <div className="p-6 border-b border-line">
                            <p className="text-sm font-semibold text-muted uppercase mb-4">
                                Expenses
                            </p>
                            <div className="space-y-3">
                                {group.expenses.map((exp, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-mist">{exp.description}</p>
                                            <p className="text-xs text-muted">
                                                Paid by {exp.paidBy}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-mist">₹{exp.amount}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Settlements */}
                        <div className="p-6">
                            <p className="text-sm font-semibold text-muted uppercase mb-4">
                                Settlements
                            </p>
                            <div className="space-y-3">
                                {group.settled.length > 0 ? (
                                    group.settled.map((settlement, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 rounded-lg bg-sage/10 border border-sage/20"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="text-sm">
                                                    <p className="text-mist font-medium">
                                                        {settlement.from} → {settlement.to}
                                                    </p>
                                                    <p className="text-xs text-muted">
                                                        ₹{settlement.amount}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-sage/20 rounded-lg transition">
                                                <Send size={16} className="text-sage" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted">All settled up! ✓</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Group Modal */}
            {showAddGroup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-xl border border-white/[0.08] p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-mist mb-4">Create Group</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted mb-2">
                                    Group Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Goa Trip"
                                    className="w-full bg-white/5 border border-line rounded-lg px-3 py-2 text-mist placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-sage/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted mb-2">
                                    Add Members (email)
                                </label>
                                <input
                                    type="email"
                                    placeholder="friend@example.com"
                                    className="w-full bg-white/5 border border-line rounded-lg px-3 py-2 text-mist placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-sage/50 mb-2"
                                />
                                <button className="text-sage text-sm hover:underline">
                                    + Add another member
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAddGroup(false)}
                                    className="flex-1 bg-white/10 hover:bg-white/15 text-mist font-semibold py-2 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 bg-sage hover:bg-sage-deep text-ink font-semibold py-2 rounded-lg transition">
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}