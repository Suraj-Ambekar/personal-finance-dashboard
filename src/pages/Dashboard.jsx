import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../features/transactionsSlice";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency } from "../utils/formatCurrency";
import Card from "../components/Card";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const transactions = useSelector(
    (state) => state.transactions.transactions || []
  );

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchTransactions({ userId: user.uid }));
    }
  }, [user, dispatch]);

  const totalIncome = transactions
    .filter((t) => t.type.toLowerCase() === "income")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const availableSavings = totalIncome - totalExpenses;

  const expenseData = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((acc, t) => {
      const category = t.category || "Other";
      acc[category] = (acc[category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const chartData = Object.entries(expenseData).map(([key, value]) => ({
    name: key,
    value,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card title="Total Income">{formatCurrency(totalIncome)}</Card>
        <Card title="Total Expenses">{formatCurrency(totalExpenses)}</Card>
        <Card title="Available Savings">
          {formatCurrency(availableSavings)}
        </Card>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Expense Breakdown</h3>
        {chartData.length > 0 ? (
          <PieChart width={400} height={250}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-{index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <p>No expense data available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
