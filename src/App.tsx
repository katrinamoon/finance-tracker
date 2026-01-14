import React, { useState, useEffect } from "react";

interface Transaction {
  id: number;
  name: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

function App() {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("Еда");
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("my_transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [type, setType] = useState<"income" | "expense">("expense");

  const balance = transactions.reduce(
    (acc, item) =>
      item.type === "income" ? acc + item.amount : acc - item.amount,
    0
  );

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + item.amount, 0);

  useEffect(() => {
    localStorage.setItem("my_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const deleteItem = (id: number) => {
    const filteredTransactions = transactions.filter((item) => item.id !== id);
    setTransactions(filteredTransactions);
  };

  const clearAll = () => {
    setTransactions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    const newTransaction: Transaction = {
      id: Date.now(),
      name: name,
      amount: +amount,
      category: category,
      type: type,
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
      <h1>Трекер личных финансов</h1>
      <h2>{type === "income" ? "История доходов" : "История расходов"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="type-toggle">
          <button
            type="button"
            className={type === "income" ? "active-income" : ""}
            onClick={() => setType("income")}
          >
            Доходы
          </button>
          <button
            type="button"
            className={type === "expense" ? "active-expenses" : ""}
            onClick={() => setType("expense")}
          >
            Расходы
          </button>
        </div>
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
          <option value="Работа">Работа</option>
          <option value="Транспорт">Транспорт</option>
          <option value="Шоппинг">Шоппинг</option>
          <option value="Развлечения">Развлечения</option>
          <option value="Лекарства">Лекарства</option>
        </select>
        <button type="submit">Добавить операцию</button>
        <ul>
          {transactions
            .filter((item) => item.type === type)
            .map((item) => (
              <li key={item.id}>
                {item.name} — {item.amount} ₽ ({item.category})
                <div className="tooltip-wrapper">
                  <button
                    className="delete-btn"
                    onClick={() => deleteItem(item.id)}
                  >
                    &times;
                  </button>
                  <span className="tooltip-text">Удалить</span>
                </div>
              </li>
            ))}
        </ul>
        <p>
          <strong>
            {type === "income" ? "Сумма доходов: " : "Сумма расходов: "}
          </strong>
          <span>{type === 'income' ? totalIncome : totalExpenses}</span>
          <span> ₽</span>
        </p>
        <button className="clear-btn" onClick={clearAll}>
          Очистить список транзакций
        </button>
      </form>
      <p>
        <strong>Баланс:</strong> {balance} ₽
      </p>
    </div>
  );
}

export default App;
