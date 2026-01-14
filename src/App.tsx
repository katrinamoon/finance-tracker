import React, { useState, useEffect } from "react";

interface Transaction {
  id: number;
  name: string;
  amount: number;
  category: string;
}

function App() {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("Еда");
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('my_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const expensesSum = transactions.reduce((acc, item) => acc + item.amount, 0);

  useEffect(() => {
    localStorage.setItem('my_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    const newTransaction: Transaction = {
      id: Date.now(),
      name: name,
      amount: +amount,
      category: category,
    };
    

    setTransactions([newTransaction, ...transactions]);
    setName("");
    setAmount("");


    console.log("Текущий список транзакций:", [
      ...transactions,
      newTransaction,
    ]);

  };

  return (
    <div className="container">
      <h1>Мои расходы</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Сумма"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Еда">Еда</option>
          <option value="Транспорт">Транспорт</option>
          <option value="Шоппинг">Шоппинг</option>
          <option value="Развлечения">Развлечения</option>
          <option value="Лекарства">Лекарства</option>
        </select>
        <button type="submit">Добавить операцию</button>
      </form>
      <ul>
        {transactions.map((item) => (
          <li key={item.id}>
            {item.name} — {item.amount} ₽ ({item.category})
          </li>
        ))}
      </ul>
      <p><strong>Сумма расходов:</strong> {expensesSum} ₽</p>
    </div>
  );
}

export default App;
