import React, { useState } from "react";
import "./styles.css";
import IngredientList from "./components/IngredientList";
import IngredientEdit from "./components/IngredientEdit";

// 預設食材清單
const DEFAULT_INGREDIENTS = [
  // 肉類/青菜區
  { name: "小棒腿", buyPrice: 0, buyQty: 0, sellPrice: 15, unit: "支" },
  { name: "紅蘿蔔", buyPrice: 0, buyQty: 0, sellPrice: 25, unit: "份" },
  { name: "豆芽菜", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "雞翅", buyPrice: 0, buyQty: 0, sellPrice: 25, unit: "支" },
  { name: "白蘿蔔", buyPrice: 0, buyQty: 0, sellPrice: 25, unit: "份" },
  { name: "茼蒿（冬季）", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "鴨胗", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "個" },
  { name: "香菇", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "菠菜（冬季）", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "鴨心", buyPrice: 0, buyQty: 0, sellPrice: 35, unit: "3顆" },
  { name: "靑椒", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "玉米筍", buyPrice: 0, buyQty: 0, sellPrice: 40, unit: "份" },
  { name: "豬腱", buyPrice: 0, buyQty: 0, sellPrice: 35, unit: "兩" },
  { name: "水蓮", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "牛肚", buyPrice: 0, buyQty: 0, sellPrice: 45, unit: "兩" },
  { name: "櫛瓜", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "豬大腸", buyPrice: 0, buyQty: 0, sellPrice: 45, unit: "兩" },
  { name: "洋蔥", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  // 麵類
  { name: "豬肉片", buyPrice: 0, buyQty: 0, sellPrice: 45, unit: "份" },
  { name: "金針菇", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "板條", buyPrice: 0, buyQty: 0, sellPrice: 20, unit: "份" },
  { name: "牛肉片", buyPrice: 0, buyQty: 0, sellPrice: 45, unit: "份" },
  { name: "杏鮑菇", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "冬粉", buyPrice: 0, buyQty: 0, sellPrice: 20, unit: "份" },
  { name: "牛腱", buyPrice: 0, buyQty: 0, sellPrice: 50, unit: "兩" },
  { name: "高麗菜", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "寬冬粉", buyPrice: 0, buyQty: 0, sellPrice: 20, unit: "份" },
  { name: "雞爪", buyPrice: 0, buyQty: 0, sellPrice: 50, unit: "6支" },
  { name: "大陸妹", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "王子麵", buyPrice: 0, buyQty: 0, sellPrice: 20, unit: "份" },
  { name: "煙燻豬頭皮", buyPrice: 0, buyQty: 0, sellPrice: 60, unit: "份" },
  { name: "空心菜", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "刀削麵", buyPrice: 0, buyQty: 0, sellPrice: 25, unit: "份" },
  { name: "無骨雞腿排", buyPrice: 0, buyQty: 0, sellPrice: 85, unit: "份" },
  { name: "娃娃菜", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "蒸煮麵", buyPrice: 0, buyQty: 0, sellPrice: 25, unit: "份" },
  { name: "黑木耳", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "大甲乾麵", buyPrice: 0, buyQty: 0, sellPrice: 25, unit: "份" },
  { name: "小黃瓜", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "韓式拉麵", buyPrice: 0, buyQty: 0, sellPrice: 35, unit: "份" },
  { name: "花椰菜", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "份" },
  { name: "寶寶烏龍麵", buyPrice: 0, buyQty: 0, sellPrice: 40, unit: "份" },
  // 火鍋料精選區（僅部分示例，請依需求補齊）
  { name: "魚餃", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "4個" },
  { name: "燕餃", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "4個" },
  { name: "蛋餃", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "4個" },
  { name: "水晶餃", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "4個" },
  { name: "蟹肉棒", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "4個" },
  { name: "蒟蒻絲", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "4個" },
  { name: "鑫鑫腸", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "4個" },
  { name: "魚豆腐", buyPrice: 0, buyQty: 0, sellPrice: 30, unit: "4個" },
  { name: "魚包蛋", buyPrice: 0, buyQty: 0, sellPrice: 35, unit: "3個" },
  { name: "原味貢丸", buyPrice: 0, buyQty: 0, sellPrice: 35, unit: "3個" },
  { name: "香菇貢丸", buyPrice: 0, buyQty: 0, sellPrice: 35, unit: "3個" },
  { name: "龍蝦沙拉", buyPrice: 0, buyQty: 0, sellPrice: 35, unit: "3個" },
  { name: "章魚腳蝦球", buyPrice: 0, buyQty: 0, sellPrice: 35, unit: "3個" },
  { name: "起司麻吉燒", buyPrice: 0, buyQty: 0, sellPrice: 35, unit: "3個" },
  { name: "芝麻麻吉燒", buyPrice: 0, buyQty: 0, sellPrice: 35, unit: "3個" },
  { name: "花生麻吉燒", buyPrice: 0, buyQty: 0, sellPrice: 35, unit: "3個" },
  // ...可依需求繼續補齊...
];

function loadIngredients() {
  try {
    const raw = localStorage.getItem("ledger_ingredients_v1");
    if (!raw) {
      // localStorage 沒資料時自動載入預設
      return DEFAULT_INGREDIENTS.map(item => ({
        ...item,
        id: crypto.randomUUID(),
        updatedAt: Date.now(),
      }));
    }
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length === 0) {
      return DEFAULT_INGREDIENTS.map(item => ({
        ...item,
        id: crypto.randomUUID(),
        updatedAt: Date.now(),
      }));
    }
    return data;
  } catch {
    return DEFAULT_INGREDIENTS.map(item => ({
      ...item,
      id: crypto.randomUUID(),
      updatedAt: Date.now(),
    }));
  }
}

function saveIngredients(ingredients) {
  try {
    localStorage.setItem("ledger_ingredients_v1", JSON.stringify(ingredients));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("saveIngredients failed:", err);
  }
}

function formatMoney(n) {
  return new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD" }).format(Number(n));
}

export default function App() {
  const [ingredients, setIngredients] = useState(() => loadIngredients());
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState("list"); // "list" | "settlement"
  const [settlementSellQty, setSettlementSellQty] = useState({});
  const [search, setSearch] = useState(""); // 新增搜尋狀態

  // 儲存時自動存 localStorage
  React.useEffect(() => {
    saveIngredients(ingredients);
  }, [ingredients]);

  // 監聽 localStorage 變動（多分頁/視窗同步）
  React.useEffect(() => {
    function onStorage(e) {
      if (e.key === "ledger_ingredients_v1") {
        setIngredients(loadIngredients());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 搜尋過濾
  const filteredIngredients = ingredients.filter(i =>
    i.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  // 結算頁面
  if (page === "settlement") {
    // 售價、單位成本、售出數量、毛利率
    const revenueByQty = ingredients.reduce((sum, it) => {
      const q = Number(settlementSellQty[it.id] || 0);
      return sum + (it.sellPrice || 0) * q;
    }, 0);
    const costByQty = ingredients.reduce((sum, it) => {
      const sellQ = Number(settlementSellQty[it.id] || 0);
      const unitCost = it.buyQty > 0 ? it.buyPrice / it.buyQty : 0;
      return sum + unitCost * sellQ;
    }, 0);
    const profitByQty = revenueByQty - costByQty;
    const marginByQty = revenueByQty > 0 ? (profitByQty / revenueByQty) * 100 : 0;

    return (
      <div className="page fade-in" style={{ minHeight: "100vh", background: "#181818", padding: 32, position: "relative" }}>
        <div style={{ width: "100%", maxWidth: 900, color: "#fff", marginBottom: 12 }}>
          <h2 style={{ color: "#fff", marginBottom: 8 }}>結算 - 售出數量統計</h2>
          <p style={{ color: "#aaa", marginTop: 0 }}>請為每項食材輸入本次售出數量（整數、手動輸入）</p>
        </div>
        <div style={{ width: "100%", maxWidth: 900 }}>
          <div className="settlementGrid">
            {ingredients.map((it) => {
              const unitCost = it.buyQty > 0 ? it.buyPrice / it.buyQty : 0;
              const profit = it.sellPrice - unitCost;
              const margin = it.sellPrice > 0 ? (profit / it.sellPrice) * 100 : 0;
              return (
                <div key={it.id} className="settlementCard">
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{it.name || "未命名"}</div>
                  <div style={{ color: "#27ae60" }}>售價：{formatMoney(it.sellPrice)}</div>
                  <div style={{ color: "#fff" }}>單位成本：{formatMoney(unitCost)}</div>
                  <div style={{ color: margin < 0 ? "#e74c3c" : "#fff" }}>
                    毛利率：{margin.toFixed(2)}%
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <label>售出數量</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={settlementSellQty[it.id] ?? 0}
                      onChange={(e) => {
                        const v = Math.max(0, parseInt(e.target.value, 10) || 0);
                        setSettlementSellQty((s) => ({ ...s, [it.id]: v }));
                      }}
                      style={{
                        width: "100%",
                        marginTop: 6,
                        padding: "8px 10px",
                        fontSize: 16,
                        borderRadius: 6,
                        border: "1px solid #444",
                        background: "#1b1b1b",
                        color: "#fff",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="settlementSummary">
            <div style={{ color: "#fff", fontSize: 18, marginBottom: 8 }}>結算摘要</div>
            <div style={{ color: "#fff" }}>總收入：{formatMoney(revenueByQty)}</div>
            <div style={{ color: "#fff" }}>總成本：{formatMoney(costByQty)}</div>
            <div style={{ color: profitByQty < 0 ? "#e74c3c" : "#fff" }}>
              毛利：{formatMoney(profitByQty)}
            </div>
            <div style={{ color: marginByQty < 0 ? "#e74c3c" : "#fff" }}>毛利率：{marginByQty.toFixed(2)}%</div>
          </div>
        </div>
        {/* 固定右下角的「編輯完成」按鈕，與主頁按鈕同一 row/位置 */}
        <div style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          display: "flex",
          flexDirection: "row",
          gap: 16,
          zIndex: 100,
        }}>
          <button
            className="settlementDoneBtn"
            onClick={() => setPage("list")}
          >
            編輯完成
          </button>
        </div>
      </div>
    );
  }

  // 食材管理頁
  return (
    <div className="app" style={{ minHeight: "100vh", background: "#181818", position: "relative" }}>
      <div className="topbar" style={{
        display: "flex",
        gap: 24,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "28px 32px 10px 32px"
      }}>
        <h1 style={{
          color: "#fff",
          fontWeight: 900,
          letterSpacing: "1px",
          fontSize: 32,
          textShadow: "0 2px 12px #0008"
        }}>食材管理系統</h1>
        {/* 新增關鍵字搜尋 */}
        <input
          type="text"
          placeholder="搜尋食材名稱"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            fontSize: 18,
            padding: "10px 24px",
            borderRadius: 24,
            border: "1.5px solid #444",
            background: "#232323",
            color: "#fff",
            minWidth: 220,
            boxShadow: "0 2px 12px #0004",
            outline: "none",
            transition: "box-shadow 0.2s",
          }}
        />
      </div>
      <div className="container" style={{ marginTop: 0 }}>
        {!editing && (
          <IngredientList
            ingredients={filteredIngredients}
            onEdit={setEditing}
            onAdd={() =>
              setEditing({
                id: crypto.randomUUID(),
                name: "",
                buyPrice: 0,
                buyQty: 1,
                sellPrice: 0,
                updatedAt: null,
              })
            }
          />
        )}
        {editing && (
          <IngredientEdit
            ingredient={editing}
            onSave={ing => {
              setIngredients(prev =>
                prev.some(i => i.id === ing.id)
                  ? prev.map(i => (i.id === ing.id ? { ...ing, updatedAt: Date.now() } : i))
                  : [...prev, { ...ing, updatedAt: Date.now() }]
              );
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </div>
      {/* 固定右下角的「開始結算」和「+」按鈕 */}
      {!editing && (
        <div style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          display: "flex",
          flexDirection: "row",
          gap: 20,
          zIndex: 100,
        }}>
          <button
            className="btn"
            style={{
              background: "#ff9800",
              color: "#fff",
              fontSize: 22,
              borderRadius: "32px",
              width: 120,
              height: 64,
              boxShadow: "0 6px 24px #000a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              fontWeight: 700,
              letterSpacing: "1px",
              border: "none",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onClick={() => {
              const sellInit = {};
              ingredients.forEach((it) => { sellInit[it.id] = 0; });
              setSettlementSellQty(sellInit);
              setPage("settlement");
            }}
          >
            開始結算
          </button>
          <button
            className="fab"
            aria-label="新增食材"
            style={{
              width: 64,
              height: 64,
              fontSize: 40,
              borderRadius: "50%",
              boxShadow: "0 6px 24px #000a",
              border: "none",
              background: "orange",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onClick={() =>
              setEditing({
                id: crypto.randomUUID(),
                name: "",
                buyPrice: 0,
                buyQty: 1,
                sellPrice: 0,
                updatedAt: null,
              })
            }
          >
            ＋
          </button>
        </div>
      )}
    </div>
  );
}
