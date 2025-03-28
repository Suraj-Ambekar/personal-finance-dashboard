import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../features/transactionsSlice";
import { fetchSavingGoals, addSavingGoal } from "../features/savingsSlice";
import { useAuth } from "../hooks/useAuth";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const SavingsGoals = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const transactions = useSelector(
    (state) => state.transactions.transactions || []
  );
  const savingsGoals = useSelector((state) => state.savings.savingsGoals || []);
  const loading = useSelector((state) => state.savings.loading);

  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchTransactions({ userId: user.uid }));
      dispatch(fetchSavingGoals({ userId: user.uid }));
    }
  }, [user, dispatch]);

  // Fix: Convert transaction amounts to numbers
  const totalIncome = transactions
    .filter((t) => t.type.toLowerCase() === "income") // Fix case sensitivity
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type.toLowerCase() === "expense") // Fix case sensitivity
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const availableSavings = totalIncome - totalExpenses;

  // ✅ Function to Add a Savings Goal
  const handleAddGoal = () => {
    if (!goalName || !goalAmount) return;

    const newGoal = {
      userId: user.uid,
      name: goalName,
      amount: Number(goalAmount),
      saved: 0,
    };

    dispatch(addSavingGoal(newGoal));
    setGoalName("");
    setGoalAmount("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Savings Goals</h2>

      {/* Display Financial Summary */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold">Financial Overview</h3>
        <p>
          <strong>Total Income:</strong> {totalIncome.toFixed(2)}
        </p>
        <p>
          <strong>Total Expenses:</strong> {totalExpenses.toFixed(2)}
        </p>
        <p>
          <strong>Available Savings:</strong> {availableSavings.toFixed(2)}
        </p>
      </div>

      {/* ✅ Form to Add New Savings Goal */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-2">Add a New Savings Goal</h3>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Goal Name"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Target Amount"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
          />
          <Button onClick={handleAddGoal}>Add Goal</Button>
        </div>
      </div>

      {/* Show savings goals */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Your Savings Goals</h3>

        {loading ? (
          <p>Loading savings goals...</p>
        ) : savingsGoals.length === 0 ? (
          <p>No savings goals yet. Add one to start saving!</p>
        ) : (
          savingsGoals.map((goal) => {
            const goalTarget = Number(goal.amount) || 0;
            const progress =
              goalTarget === 0
                ? 0
                : Math.max(
                    0,
                    Math.min((availableSavings / goalTarget) * 100, 100)
                  );

            return (
              <div key={goal.id} className="mb-4 p-4 border rounded-lg">
                <h4 className="font-bold">{goal.name}</h4>
                <p>
                  <strong>Target:</strong> {goalTarget.toFixed(2)}
                </p>
                <p>
                  <strong>Saved:</strong> {availableSavings.toFixed(2)}
                </p>
                <Progress value={progress} max={100} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavingsGoals;
