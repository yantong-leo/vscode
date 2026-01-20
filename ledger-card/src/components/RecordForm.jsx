import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_CATEGORIES = [
  { name: "小棒腿15元/隻", price: 15, cost: 13.2 },
  { name: "雞翅15元", price: 15, cost: 12.0 },
  { name: "雞胗30元", price: 30, cost: 25.0 },
  { name: "鴨心35/3個", price: 35, cost: 30.0 },
];

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function RecordForm({ editing, onSubmit, onCancel }) {
  const isEdit = Boolean(editing);

  const [date, setDate] = useState(todayISO());
  const [category, setCategory] = useState("小棒腿15元/隻");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(15); // 預設金額根據分類計算
  const [cost, setCost] = useState(13.2); // 預設補貨成本（浮點數）
  const [isCostManuallyChanged, setIsCostManuallyChanged] = useState(false); // 判斷補貨成本是否被手動修改
  const [note, setNote] = useState("");
  const [newCategory, setNewCategory] = useState(""); // 用於新增分類的輸入框

  useEffect(() => {
    if (!editing) return;
    setDate(editing.date || todayISO());
    setCategory(editing.category || "小棒腿15元/隻");
    setQuantity(editing.quantity || 1);
    setAmount(editing.amount || 15);
    setCost(parseFloat(editing.cost / (editing.quantity || 1)) || 13.2); // 還原單位補貨成本
    setIsCostManuallyChanged(false); // 重置手動修改狀態
    setNote(editing.note || "");
  }, [editing]);

  // 根據分類和數量自動計算金額與補貨成本
  useEffect(() => {
    const selectedCategory = categories.find((c) => c.name === category);
    if (selectedCategory) {
      setAmount(selectedCategory.price * quantity);
      if (!isCostManuallyChanged) {
        setCost(selectedCategory.cost); // 僅在補貨成本未被手動修改時更新
      }
    }
  }, [category, quantity, isCostManuallyChanged]);

  const canSubmit = useMemo(() => {
    return date && category && quantity > 0 && amount > 0 && cost >= 0;
  }, [date, category, quantity, amount, cost]);

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      id: isEdit ? editing.id : crypto.randomUUID(),
      date,
      category,
      quantity,
      amount,
      cost: parseFloat(cost * quantity).toFixed(2), // 總補貨成本（保留兩位小數）
      note: note.trim(),
      updatedAt: Date.now(),
      createdAt: isEdit ? (editing.createdAt ?? Date.now()) : Date.now(),
    };

    onSubmit(payload);

    if (!isEdit) {
      resetForm();
    }
  };

  const resetForm = () => {
    setQuantity(1);
    setAmount(15);
    setCost(13.2);
    setCategory("小棒腿15元/隻");
    setDate(todayISO());
    setIsCostManuallyChanged(false); // 重置手動修改狀態
    setNote("");
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.some((c) => c.name === newCategory.trim())) {
      setCategories((prev) => [...prev, { name: newCategory.trim(), price: 0, cost: 0 }]);
      setNewCategory("");
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="formHeader">
        <h2 style={{ fontSize: "24px" }}>{isEdit ? "編輯紀錄" : "新增紀錄"}</h2>
        {isEdit ? (
          <button type="button" className="btn ghost" onClick={onCancel}>
            取消編輯
          </button>
        ) : null}
      </div>

      <div className="grid">
        <div className="field">
          <label style={{ fontSize: "18px" }}>日期</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="field">
          <label style={{ fontSize: "18px" }}>分類</label>
          <div className="categoryButtons">
            {categories.map((c) => (
              <button
                key={c.name}
                type="button"
                className={`btn ${category === c.name ? "primary" : ""}`}
                onClick={() => {
                  setCategory(c.name);
                  setIsCostManuallyChanged(false); // 重置手動修改狀態
                }}
                style={{ fontSize: "16px" }}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="addCategory">
            <input
              type="text"
              placeholder="新增分類"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{ fontSize: "16px", marginTop: "8px" }}
            />
            <button type="button" className="btn" onClick={addCategory} style={{ fontSize: "16px" }}>
              新增
            </button>
          </div>
        </div>

        <div className="field">
          <label style={{ fontSize: "18px" }}>數量</label>
          <div className="quantityControls">
            <button
              type="button"
              className="btn"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              style={{ fontSize: "16px" }}
            >
              -
            </button>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              style={{ fontSize: "16px" }}
            />
            <button
              type="button"
              className="btn"
              onClick={() => setQuantity((prev) => prev + 1)}
              style={{ fontSize: "16px" }}
            >
              +
            </button>
          </div>
        </div>

        <div className="field">
          <label style={{ fontSize: "18px" }}>金額</label>
          <input type="number" value={amount} readOnly style={{ fontSize: "16px" }} />
        </div>

        <div className="field">
          <label style={{ fontSize: "18px" }}>補貨成本</label>
          <input
            type="number"
            step="0.01" // 支援小數點輸入
            value={cost}
            onChange={(e) => {
              setCost(parseFloat(e.target.value) || 0);
              setIsCostManuallyChanged(true); // 標記補貨成本已被手動修改
            }}
            style={{ fontSize: "16px" }}
          />
        </div>

        <div className="field span2">
          <label style={{ fontSize: "18px" }}>備註（可空）</label>
          <input
            placeholder="例如：加辣/少冰"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ fontSize: "16px" }}
          />
        </div>
      </div>

      <div className="formActions">
        <button className="btn primary" type="submit" disabled={!canSubmit} style={{ fontSize: "16px" }}>
          {isEdit ? "儲存修改" : "新增"}
        </button>
        <button type="button" className="btn ghost" onClick={resetForm} style={{ fontSize: "16px" }}>
          取消更改
        </button>
      </div>
    </form>
  );
}
