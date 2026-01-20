import React from "react";

export default function FilterBar({ filters, setFilters }) {
  const set = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div className="filterBar">
      <div className="field">
        <label>月份</label>
        <input
          type="month"
          value={filters.month ? filters.month : ""}
          onChange={(e) => set({ month: e.target.value })}
        />
      </div>

      <div className="field">
        <label>類型</label>
        <select
          value={filters.type ?? "all"}
          onChange={(e) => set({ type: e.target.value })}
        >
          <option value="all">全部</option>
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
      </div>

      <div className="field">
        <label>分類</label>
        <input
          placeholder="例如：飲食"
          value={filters.category ?? ""}
          onChange={(e) => set({ category: e.target.value })}
        />
      </div>

      <div className="field grow">
        <label>關鍵字</label>
        <input
          placeholder="備註搜尋"
          value={filters.q ?? ""}
          onChange={(e) => set({ q: e.target.value })}
        />
      </div>

      <button
        className="btn ghost"
        onClick={() =>
          setFilters({
            month: "",
            type: "all",
            category: "",
            q: "",
          })
        }
      >
        清除
      </button>
    </div>
  );
}
