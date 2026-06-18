import { supabase } from "./supabase";

/**
 * Create a new group
 */
export async function createGroup(name, createdBy) {
  const { data, error } = await supabase
    .from("groups")
    .insert([{ name, created_by: createdBy }])
    .select();

  if (error) throw error;

  const group = data?.[0];

  // Automatically add the creator as a member
  await addGroupMember(group.id, createdBy, null);

  return group;
}

/**
 * Get all groups a user belongs to
 */
export async function getUserGroups(userEmail) {
  const { data: memberships, error: memberError } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("email", userEmail);

  if (memberError) throw memberError;

  const groupIds = memberships.map((m) => m.group_id);
  if (groupIds.length === 0) return [];

  const { data: groups, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .in("id", groupIds)
    .order("created_at", { ascending: false });

  if (groupError) throw groupError;
  return groups || [];
}

/**
 * Get a single group with its members and expenses
 */
export async function getGroupDetails(groupId) {
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (groupError) throw groupError;

  const { data: members, error: memberError } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .order("added_at", { ascending: true });

  if (memberError) throw memberError;

  const { data: expenses, error: expenseError } = await supabase
    .from("group_expenses")
    .select("*")
    .eq("group_id", groupId)
    .order("date", { ascending: false });

  if (expenseError) throw expenseError;

  return {
    group,
    members: members || [],
    expenses: (expenses || []).map((e) => ({ ...e, amount: parseFloat(e.amount) })),
  };
}

/**
 * Add a member to a group by email
 */
export async function addGroupMember(groupId, email, name = null) {
  const { data, error } = await supabase
    .from("group_members")
    .insert([{ group_id: groupId, email, name }])
    .select();

  if (error) throw error;
  return data?.[0];
}

/**
 * Remove a member from a group
 */
export async function removeGroupMember(groupId, email) {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("email", email);

  if (error) throw error;
}

/**
 * Add an expense to a group.
 * splits = { email: amountOwedByThatPerson }
 */
export async function addGroupExpense(groupId, { description, amount, paidBy, splitType, splits, date }) {
  const { data, error } = await supabase
    .from("group_expenses")
    .insert([
      {
        group_id: groupId,
        description,
        amount: parseFloat(amount),
        paid_by: paidBy,
        split_type: splitType,
        splits,
        date: date || new Date().toISOString().split("T")[0],
      },
    ])
    .select();

  if (error) throw error;
  return data?.[0];
}

/**
 * Delete a group expense
 */
export async function deleteGroupExpense(expenseId) {
  const { error } = await supabase
    .from("group_expenses")
    .delete()
    .eq("id", expenseId);

  if (error) throw error;
}

/**
 * Delete an entire group
 */
export async function deleteGroup(groupId) {
  const { error } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId);

  if (error) throw error;
}

/**
 * THE DEBT CALCULATION ENGINE
 *
 * For each expense: the person who paid is owed money by everyone
 * else according to their split share. We net this out per pair.
 *
 * Returns an array of { from, to, amount } meaning
 * "from" owes "to" that amount.
 */
export function calculateDebts(expenses, members) {
  // balances[email] = how much that person is owed overall (+) or owes (-)
  const balances = {};
  members.forEach((m) => {
    balances[m.email] = 0;
  });

  expenses.forEach((expense) => {
    const { paid_by, amount, splits } = expense;

    // The payer is owed the full amount initially
    balances[paid_by] = (balances[paid_by] || 0) + parseFloat(amount);

    // Each person (including the payer, if they owe their own share)
    // loses their split share from their balance
    Object.entries(splits).forEach(([email, owedAmount]) => {
      balances[email] = (balances[email] || 0) - parseFloat(owedAmount);
    });
  });

  // Now net out balances into pairwise debts.
  // People with negative balance owe; people with positive balance are owed.
  const debtors = Object.entries(balances)
    .filter(([, bal]) => bal < -0.01)
    .map(([email, bal]) => ({ email, amount: -bal }));

  const creditors = Object.entries(balances)
    .filter(([, bal]) => bal > 0.01)
    .map(([email, bal]) => ({ email, amount: bal }));

  const settlements = [];

  let i = 0;
  let j = 0;

  // Greedily match debtors to creditors
  const debtorsCopy = debtors.map((d) => ({ ...d }));
  const creditorsCopy = creditors.map((c) => ({ ...c }));

  while (i < debtorsCopy.length && j < creditorsCopy.length) {
    const debtor = debtorsCopy[i];
    const creditor = creditorsCopy[j];
    const settledAmount = Math.min(debtor.amount, creditor.amount);

    if (settledAmount > 0.01) {
      settlements.push({
        from: debtor.email,
        to: creditor.email,
        amount: Math.round(settledAmount * 100) / 100,
      });
    }

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return settlements;
}

/**
 * Get a per-member summary: how much each person owes/is owed overall
 */
export function calculateBalances(expenses, members) {
  const balances = {};
  members.forEach((m) => {
    balances[m.email] = 0;
  });

  expenses.forEach((expense) => {
    const { paid_by, amount, splits } = expense;
    balances[paid_by] = (balances[paid_by] || 0) + parseFloat(amount);

    Object.entries(splits).forEach(([email, owedAmount]) => {
      balances[email] = (balances[email] || 0) - parseFloat(owedAmount);
    });
  });

  return balances;
}