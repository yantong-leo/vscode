import React from "react";
import "./IngredientList.css";

export default function IngredientList({ ingredients, onEdit, onAdd }) {
  const fmt = (n) => new Intl.NumberFormat("zh-TW").format(n);

  return (
    <div className="ingredientList">
      {ingredients.map((ingredient) => {
        const unitCost =
          ingredient.buyQty > 0 ? ingredient.buyPrice / ingredient.buyQty : 0;
        const grossMargin =
          ingredient.sellPrice > 0
            ? ((ingredient.sellPrice - unitCost) / ingredient.sellPrice) * 100
            : 0;

        return (
          <div
            key={ingredient.id}
            className="ingredientCard"
            onClick={() => onEdit(ingredient)}
          >
            <div className="ingredientName">{ingredient.name}</div>
            <div className="ingredientPrices">
              <span className="buyPrice">
                進貨總價: {fmt(ingredient.buyPrice)}
              </span>
              <span className="buyQty">
                進貨數量: {ingredient.buyQty || 0}
              </span>
              <span className="unitCost">
                單位成本: {unitCost.toFixed(2)}
              </span>
              <span className="sellPrice">
                售出價格: {fmt(ingredient.sellPrice)}
              </span>
            </div>
            <div
              className={`grossMargin ${
                grossMargin < 0 ? "loss" : "profit"
              }`}
            >
              毛利率: {grossMargin.toFixed(2)}%
            </div>
          </div>
        );
      })}

      <button className="addButton" onClick={onAdd}>
        +
      </button>
    </div>
  );
}
