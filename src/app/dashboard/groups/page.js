"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, Users, ArrowLeft, Trash2, UserPlus, Receipt } from "lucide-react";
import {
  getUserGroups,
  createGroup,
  getGroupDetails,
  addGroupMember,
  removeGroupMember,
  addGroupExpense,
  deleteGroupExpense,
  deleteGroup,
  calculateDebts,
  calculateBalances,
} from "@/lib/groups";

export const dynamic = "force-dynamic";

export default function GroupsPage() {
  const { data: session } = useSession();
  const [view, setView] = useState("list"); // "list" or "detail"
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    paidBy: "",
    splitType: "equal",
    customSplits: {},
  });

  // Load user's groups
  useEffect(() => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }
    loadGroups();
  }, [session?.user?.email]);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const data = await getUserGroups(session.user.email);
      setGroups(data);
      setError(null);
    } catch (err) {
      console.error("Error loading groups:", err);
      setError("Failed to load groups.");
    } finally {
      setIsLoading(false);
    }
  };

  const openGroupDetail = async (group) => {
    try {
      setIsLoading(true);
      const details = await getGroupDetails(group.id);
      setActiveGroup(details.group);
      setMembers(details.members);
      setExpenses(details.expenses);
      setView("detail");
      setError(null);
    } catch (err) {
      console.error("Error loading group:", err);
      setError("Failed to load group details.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshActiveGroup = async () => {
    if (!activeGroup) return;
    const details = await getGroupDetails(activeGroup.id);
    setMembers(details.members);
    setExpenses(details.expenses);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      await createGroup(newGroupName, session.user.email);
      setNewGroupName("");
      setIsCreateOpen(false);
      await loadGroups();
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Failed to create group.");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    try {
      await addGroupMember(activeGroup.id, newMemberEmail.trim(), newMemberName.trim() || null);
      setNewMemberEmail("");
      setNewMemberName("");
      setIsAddMemberOpen(false);
      await refreshActiveGroup();
    } catch (err) {
      console.error("Error adding member:", err);
      setError("Failed to add member. They may already be in this group.");
    }
  };

  const handleRemoveMember = async (email) => {
    try {
      await removeGroupMember(activeGroup.id, email);
      await refreshActiveGroup();
    } catch (err) {
      console.error("Error removing member:", err);
      setError("Failed to remove member.");
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm(`Delete "${activeGroup.name}"? This removes all its expenses too.`)) return;
    try {
      await deleteGroup(activeGroup.id);
      setView("list");
      setActiveGroup(null);
      await loadGroups();
    } catch (err) {
      console.error("Error deleting group:", err);
      setError("Failed to delete group.");
    }
  };

  const openAddExpense = () => {
    setExpenseForm({
      description: "",
      amount: "",
      paidBy: session.user.email,
      splitType: "equal",
      customSplits: {},
    });
    setIsAddExpenseOpen(true);
  };

  const handleExpenseAmountChange = (amount) => {
    setExpenseForm((prev) => ({ ...prev, amount }));
  };

  const handleCustomSplitChange = (email, value) => {
    setExpenseForm((prev) => ({
      ...prev,
      customSplits: { ...prev.customSplits, [email]: value },
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(expenseForm.amount);
    if (!expenseForm.description.trim() || !amountNum || !expenseForm.paidBy) return;

    let splits = {};

    if (expenseForm.splitType === "equal") {
      const share = amountNum / members.length;
      members.forEach((m) => {
        splits[m.email] = Math.round(share * 100) / 100;
      });
    } else {
      // custom
      const total = members.reduce(
        (sum, m) => sum + (parseFloat(expenseForm.customSplits[m.email]) || 0),
        0
      );
      if (Math.abs(total - amountNum) > 0.5) {
        setError(`Custom splits add up to ₹${total}, but the expense is ₹${amountNum}. Please adjust.`);
        return;
      }
      members.forEach((m) => {
        splits[m.email] = parseFloat(expenseForm.customSplits[m.email]) || 0;
      });
    }

    try {
      await addGroupExpense(activeGroup.id, {
        description: expenseForm.description,
        amount: amountNum,
        paidBy: expenseForm.paidBy,
        splitType: expenseForm.splitType,
        splits,
      });
      setIsAddExpenseOpen(false);
      setError(null);
      await refreshActiveGroup();
    } catch (err) {
      console.error("Error adding expense:", err);
      setError("Failed to add expense.");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteGroupExpense(expenseId);
      await refreshActiveGroup();
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense.");
    }
  };

  const getDisplayName = (email) => {
    const member = members.find((m) => m.email === email);
    if (member?.name) return member.name;
    if (email === session?.user?.email) return session.user.name || "You";
    return email;
  };

  const debts = activeGroup ? calculateDebts(expenses, members) : [];
  const balances = activeGroup ? calculateBalances(expenses, members) : {};

  if (!session) {
    return (
      <div className="min-h-screen bg-mist dark:bg-slate-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Please log in to view groups.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist dark:bg-slate-950 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-sm font-bold">✕</button>
          </div>
        )}

        {/* ============ LIST VIEW ============ */}
        {view === "list" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                 <h1 className="text-4xl font-boldtext-ink dark:text-slate-100  font-display">
                  Groups
                </h1>
                <p className="text-muted dark:text-slate-400 mt-2">
                  Split expenses with friends and family
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
              >
                <Plus size={20} />
                New Group
              </button>
            </div>

            {isLoading ? (
              <p className= "text-muted dark:text-slate-400 text-center py-12">Loading groups...</p>
            ) : groups.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-muted dark:text-slate-400">
                  No groups yet. Create one to start splitting expenses!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => openGroupDetail(group)}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 text-left hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <Users className="text-green-600 dark:text-green-400" size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created {new Date(group.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Create Group Modal */}
            {isCreateOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">New Group</h2>
                  <form onSubmit={handleCreateGroup} className="space-y-4">
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="e.g., Goa Trip, Flatmates"
                      className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg">
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreateOpen(false)}
                        className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-bold py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* ============ DETAIL VIEW ============ */}
        {view === "detail" && activeGroup && (
          <>
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-2text-muted dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <ArrowLeft size={18} /> Back to groups
            </button>

            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-display">
                {activeGroup.name}
              </h1>
              <button
                onClick={handleDeleteGroup}
                className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
              >
                <Trash2 size={16} /> Delete Group
              </button>
            </div>

            {/* Members */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Members ({members.length})
                </h2>
                <button
                  onClick={() => setIsAddMemberOpen(true)}
                  className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-medium"
                >
                  <UserPlus size={16} /> Add Member
                </button>
              </div>
              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.email} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-gray-900 dark:text-white text-sm font-medium">
                        {m.name || m.email} {m.email === session.user.email && "(You)"}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{m.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${
                        (balances[m.email] || 0) > 0.01 ? "text-green-600" : (balances[m.email] || 0) < -0.01 ? "text-red-500" : "text-gray-400"
                      }`}>
                        {(balances[m.email] || 0) > 0.01 ? `+₹${balances[m.email].toFixed(0)}` :
                         (balances[m.email] || 0) < -0.01 ? `-₹${Math.abs(balances[m.email]).toFixed(0)}` : "settled"}
                      </span>
                      {m.email !== session.user.email && (
                        <button onClick={() => handleRemoveMember(m.email)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Who owes whom */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 mb-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Settlements</h2>
              {debts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Everyone is settled up! 🎉</p>
              ) : (
                <div className="space-y-2">
                  {debts.map((debt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm text-gray-800 dark:text-gray-100">
                        <span className="font-semibold">{getDisplayName(debt.from)}</span>
                        {" owes "}
                        <span className="font-semibold">{getDisplayName(debt.to)}</span>
                      </p>
                      <span className="font-bold text-amber-700 dark:text-amber-400">₹{debt.amount.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expenses */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Group Expenses ({expenses.length})
                </h2>
                <button
                  onClick={openAddExpense}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1"
                >
                  <Receipt size={16} /> Add Expense
                </button>
              </div>

              {expenses.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm py-6 text-center">
                  No expenses yet. Add one to start splitting!
                </p>
              ) : (
                <div className="space-y-2">
                  {expenses.map((exp) => (
                    <div key={exp.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{exp.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Paid by {getDisplayName(exp.paid_by)} • {new Date(exp.date).toLocaleDateString()} • {exp.split_type} split
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 dark:text-white">₹{exp.amount.toLocaleString("en-IN")}</span>
                        <button onClick={() => handleDeleteExpense(exp.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Member Modal */}
            {isAddMemberOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Member</h2>
                  <form onSubmit={handleAddMember} className="space-y-4">
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="friend@example.com"
                      required
                      className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Name (optional)"
                      className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="flex gap-3">
                      <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg">
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddMemberOpen(false)}
                        className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-bold py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add Expense Modal */}
            {isAddExpenseOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Group Expense</h2>
                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Description</label>
                      <input
                        type="text"
                        value={expenseForm.description}
                        onChange={(e) => setExpenseForm((p) => ({ ...p, description: e.target.value }))}
                        placeholder="e.g., Dinner at restaurant"
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Amount (₹)</label>
                      <input
                        type="number"
                        value={expenseForm.amount}
                        onChange={(e) => handleExpenseAmountChange(e.target.value)}
                        step="0.01"
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Paid By</label>
                      <select
                        value={expenseForm.paidBy}
                        onChange={(e) => setExpenseForm((p) => ({ ...p, paidBy: e.target.value }))}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {members.map((m) => (
                          <option key={m.email} value={m.email}>
                            {m.name || m.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Split</label>
                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setExpenseForm((p) => ({ ...p, splitType: "equal" }))}
                          className={`flex-1 py-2 rounded-lg font-medium text-sm ${
                            expenseForm.splitType === "equal"
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                          }`}
                        >
                          Equal Split
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpenseForm((p) => ({ ...p, splitType: "custom" }))}
                          className={`flex-1 py-2 rounded-lg font-medium text-sm ${
                            expenseForm.splitType === "custom"
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                          }`}
                        >
                          Custom Split
                        </button>
                      </div>

                      {expenseForm.splitType === "equal" && expenseForm.amount && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Each person pays ₹{(parseFloat(expenseForm.amount) / members.length).toFixed(2)}
                        </p>
                      )}

                      {expenseForm.splitType === "custom" && (
                        <div className="space-y-2">
                          {members.map((m) => (
                            <div key={m.email} className="flex items-center gap-2">
                              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                {m.name || m.email}
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                value={expenseForm.customSplits[m.email] || ""}
                                onChange={(e) => handleCustomSplitChange(m.email, e.target.value)}
                                placeholder="0.00"
                                className="w-24 px-2 py-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg">
                        Add Expense
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddExpenseOpen(false)}
                        className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-bold py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}