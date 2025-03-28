import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "../features/transactionsSlice";
import { useAuth } from "../hooks/useAuth";

const categories = [
  "Food",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Transport",
  "Other",
];
const transactionTypes = ["Income", "Expense"];

const Transactions = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.transactions);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState("");
  const [type, setType] = useState(transactionTypes[0]);
  const [editingId, setEditingId] = useState(null);

  // Filter states
  const [filterDateOrder, setFilterDateOrder] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions({ userId: user.uid }));
    }
  }, [user, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    const transactionData = {
      userId: user.uid,
      amount,
      description,
      category,
      date,
      type,
    };
    if (editingId) {
      dispatch(
        updateTransaction({ id: editingId, updatedData: transactionData })
      );
      setEditingId(null);
    } else {
      dispatch(addTransaction(transactionData));
    }
    setAmount("");
    setDescription("");
    setCategory(categories[0]);
    setDate("");
    setType(transactionTypes[0]);
  };

  const handleDelete = (id) => {
    dispatch(deleteTransaction(id));
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setAmount(transaction.amount);
    setDescription(transaction.description);
    setCategory(transaction.category);
    setDate(transaction.date);
    setType(transaction.type);
  };

  // Filter and sort logic
  const filteredTransactions = transactions
    .filter((transaction) => {
      return (
        (!filterCategory || transaction.category === filterCategory) &&
        (!filterType || transaction.type === filterType)
      );
    })
    .sort((a, b) => {
      return filterDateOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Transaction Management</h2>
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-4 rounded-lg shadow-md"
      >
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 border rounded mb-3"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          {transactionTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2 border rounded mb-3"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          {editingId ? "Update Transaction" : "Add Transaction"}
        </button>
      </form>

      {/* Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Filter Transactions</h3>
        <select
          value={filterDateOrder}
          onChange={(e) => setFilterDateOrder(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="asc">Date Ascending</option>
          <option value="desc">Date Descending</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="">All Types</option>
          {transactionTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Date</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="border p-2">{transaction.date}</td>
              <td className="border p-2">{transaction.description}</td>
              <td className="border p-2">{transaction.amount}</td>
              <td className="border p-2">{transaction.category}</td>
              <td className="border p-2">{transaction.type}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(transaction)}
                  className="mr-2 text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
