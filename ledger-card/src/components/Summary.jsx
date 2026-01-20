import React, { useMemo } from "react";

export default function Summary({ records, compareRecords = [] }) {
  const { income, expense, cost, grossProfit, grossMargin } = useMemo(() => {
    if (!records || records.length === 0) {
      return { income: 0, expense: 0, cost: 0, grossProfit: 0, grossMargin: 0 };
    }

    let incomeSum = 0;
    let expenseSum = 0;
    let costSum = 0;

    for (const r of records) {
      const amt = Number(r?.amount) || 0;
      const itemCost = Number(r?.cost) || 0;

      if (r?.type === "income") {
        incomeSum += amt;
        costSum += itemCost;
      } else {
        expenseSum += amt;
      }
    }

    const grossProfit = incomeSum - costSum; // 毛利
    const grossMargin = incomeSum > 0 ? (grossProfit / incomeSum) * 100 : 0; // 毛利率

    return { income: incomeSum, expense: expenseSum, cost: costSum, grossProfit, grossMargin };
  }, [records]);

  const fmt = (n) => new Intl.NumberFormat("zh-TW").format(Math.round(n));

  return (
    <div className="summary">
      <div className="summaryCard">
        <div className="summaryLabel">收入</div>
        <div className="summaryValue">+ {fmt(income)}</div>
      </div>
      <div className="summaryCard">
        <div className="summaryLabel">支出</div>
        <div className="summaryValue">- {fmt(expense)}</div>
      </div>
      <div className="summaryCard">
        <div className="summaryLabel">補貨成本</div>
        <div className="summaryValue">- {fmt(cost)}</div>
      </div>
      <div className="summaryCard">
        <div className="summaryLabel">毛利</div>
        <div className="summaryValue">+ {fmt(grossProfit)}</div>
      </div>
      <div className="summaryCard">
        <div className="summaryLabel">毛利率</div>
        <div className="summaryValue">{grossMargin.toFixed(2)}%</div>
      </div>

      {compareRecords.length > 0 && (
        <div className="comparison">
          <h3>比較結果</h3>
          <table>
            <thead>
              <tr>
                <th>資料集</th>
                <th>收入</th>
                <th>支出</th>
                <th>結餘</th>
              </tr>
            </thead>
            <tbody>
              {compareRecords.map((dataset) => {
                const { income, expense, balance } = dataset;
                return (
                  <tr key={dataset.id}>
                    <td>{dataset.name}</td>
                    <td>{fmt(income)}</td>
                    <td>{fmt(expense)}</td>
                    <td>{fmt(balance)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
