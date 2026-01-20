import React from "react";

export default function Sidebar({ datasets, selectedDatasets, setSelectedDatasets }) {
  const toggleDataset = (id) => {
    setSelectedDatasets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="sidebar">
      <h3>資料集</h3>
      {datasets.length === 0 ? (
        <p>尚未匯入任何資料集</p>
      ) : (
        <ul>
          {datasets.map((dataset) => (
            <li key={dataset.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedDatasets.includes(dataset.id)}
                  onChange={() => toggleDataset(dataset.id)}
                />
                <span>{dataset.name}</span>
              </label>
              <div className="datasetMeta">
                <span>匯入時間：{dataset.importedAt}</span>
                <span>記錄筆數：{dataset.records.length}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
