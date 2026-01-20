import React from "react";

export default function Topbar({ currentDataset, onImportJson, onImportExcel, onExportJson, onExportExcel }) {
  return (
    <div className="topbar">
      <div className="currentDataset">
        <h2>{currentDataset ? currentDataset.name : "未選擇資料集"}</h2>
        {currentDataset && <span>月份：{currentDataset.month}</span>}
      </div>
      <div className="actions">
        <label className="btn">
          匯入 JSON
          <input type="file" accept=".json" multiple onChange={onImportJson} style={{ display: "none" }} />
        </label>
        <label className="btn">
          匯入 Excel
          <input type="file" accept=".xlsx" multiple onChange={onImportExcel} style={{ display: "none" }} />
        </label>
        <button className="btn" onClick={onExportJson}>
          匯出 JSON
        </button>
        <button className="btn" onClick={onExportExcel}>
          匯出 Excel
        </button>
      </div>
    </div>
  );
}
