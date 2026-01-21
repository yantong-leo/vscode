import React from "react";

export default function RecordCard({ record, onEdit, onDelete }) {
  const isIncome = record?.type === "income";
  const rawAmount = record?.amount;
  const numAmount = typeof rawAmount === "number" ? rawAmount : Number(rawAmount);
  const safeAmount = Number.isFinite(numAmount) ? numAmount : 0;
  const amountFmt = new Intl.NumberFormat("zh-TW", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(safeAmount);

  const dateText = record?.date || "未填日期";
  const categoryText = record?.category || "未分類";

  return (
    <div className="card">
      <div className="cardTop">
        <div className="tagRow">
          <span className={`pill ${isIncome ? "income" : "expense"}`}>
            {isIncome ? "收入" : "支出"}
          </span>
          <span className="pill subtle">{categoryText}</span>
        </div>

        <div className={`amount ${isIncome ? "incomeText" : "expenseText"}`}>
          {isIncome ? "+ " : "- "}
          {amountFmt}
        </div>
      </div>

      <div className="meta">
        <div className="metaItem">
          <span className="metaLabel">日期</span>
          <span className="metaValue">{dateText}</span>
        </div>
        {record?.note ? (
          <div className="metaItem">
            <span className="metaLabel">備註</span>
            <span className="metaValue" style={{ whiteSpace: "pre-line" }}>{record.note}</span>
          </div>
        ) : null}
      </div>

      <div className="cardActions">
        <button className="btn" onClick={() => onEdit(record)}>
          編輯
        </button>
        <button
          className="btn danger"
          onClick={() => record?.id && onDelete(record.id)}
        >
          刪除
        </button>
      </div>
    </div>
  );
}
