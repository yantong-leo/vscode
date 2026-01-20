import React, { useState, useEffect } from "react";
import "./IngredientEdit.css";

export default function IngredientEdit({ ingredient, onSave, onCancel }) {
  const [name, setName] = useState(ingredient?.name || "");
  const [buyPrice, setBuyPrice] = useState(ingredient?.buyPrice || 0);
  const [buyQty, setBuyQty] = useState(ingredient?.buyQty || 1);
  const [sellPrice, setSellPrice] = useState(ingredient?.sellPrice || 0);
  const [lastUpdated, setLastUpdated] = useState(ingredient?.updatedAt || "未更改");

  useEffect(() => {
    if (ingredient?.updatedAt) {
      const date = new Date(ingredient.updatedAt);
      setLastUpdated(date.toLocaleString("zh-TW"));
    }
  }, [ingredient]);

  const unitCost = buyQty > 0 ? buyPrice / buyQty : 0;

  const handleSave = () => {
    onSave({
      ...ingredient,
      name,
      buyPrice: parseFloat(buyPrice),
      buyQty: parseInt(buyQty, 10) || 1,
      sellPrice: parseFloat(sellPrice),
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="ingredientEdit">
      <div className="field">
        <label>名稱</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="field">
        <label>進貨總價</label>
        <input
          type="number"
          step="0.01"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
        />
      </div>

      <div className="field">
        <label>進貨數量</label>
        <input
          type="number"
          min="1"
          step="1"
          value={buyQty}
          onChange={(e) => setBuyQty(e.target.value)}
        />
      </div>

      <div className="field">
        <label>單位成本（自動計算）</label>
        <input type="number" value={unitCost.toFixed(2)} readOnly />
      </div>

      <div className="field">
        <label>售出價格</label>
        <input
          type="number"
          step="0.01"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
        />
      </div>

      <div className="field">
        <label>上次更改日期</label>
        <div className="lastUpdated">{lastUpdated}</div>
      </div>

      <div className="actions">
        <button className="btn" onClick={onCancel}>
          返回
        </button>
        <button className="btn danger" onClick={onCancel}>
          取消
        </button>
        <button className="btn primary" onClick={handleSave}>
          儲存變更
        </button>
      </div>
    </div>
  );
}
