import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import { loadRecords, saveRecords } from "./utils/storage";
import RecordForm from "./components/RecordForm";
import RecordCard from "./components/RecordCard";
import Summary from "./components/Summary";
import FilterBar from "./components/FilterBar";
import * as XLSX from "xlsx";
import Sidebar from "./components/Sidebar"; // 新增 Sidebar 元件
import Topbar from "./components/Topbar"; // 新增 Topbar 元件
import { cleanData } from "./utils/dataCleaning"; // 引入資料清洗工具
import IngredientList from "./components/IngredientList";
import IngredientEdit from "./components/IngredientEdit";

const INGREDIENTS_KEY = "ledger_ingredients_v1";

// 新增：預設食材清單
const DEFAULT_INGREDIENTS = [
  { name: "小棒腿", sellPrice: 15, unit: "支" },
  { name: "紅蘿蔔", sellPrice: 25, unit: "份" },
  { name: "豆芽菜", sellPrice: 30, unit: "份" },
  { name: "雞翅", sellPrice: 25, unit: "支" },
  { name: "白蘿蔔", sellPrice: 25, unit: "份" },
  { name: "茼蒿（冬季）", sellPrice: 30, unit: "份" },
  { name: "鴨胗", sellPrice: 30, unit: "個" },
  { name: "香菇", sellPrice: 30, unit: "份" },
  { name: "菠菜（冬季）", sellPrice: 30, unit: "份" },
  { name: "鴨心", sellPrice: 35, unit: "3顆" },
  { name: "靑椒", sellPrice: 30, unit: "份" },
  { name: "玉米筍", sellPrice: 40, unit: "份" },
  { name: "豬腱", sellPrice: 35, unit: "兩" },
  { name: "水蓮", sellPrice: 30, unit: "份" },
  { name: "牛肚", sellPrice: 45, unit: "兩" },
  { name: "櫛瓜", sellPrice: 30, unit: "份" },
  { name: "豬大腸", sellPrice: 45, unit: "兩" },
  { name: "洋蔥", sellPrice: 30, unit: "份" },
  { name: "豬肉片", sellPrice: 45, unit: "份" },
  { name: "金針菇", sellPrice: 30, unit: "份" },
  { name: "板條", sellPrice: 20, unit: "份" },
  { name: "牛肉片", sellPrice: 45, unit: "份" },
  { name: "杏鮑菇", sellPrice: 30, unit: "份" },
  { name: "冬粉", sellPrice: 20, unit: "份" },
  { name: "牛腱", sellPrice: 50, unit: "兩" },
  { name: "高麗菜", sellPrice: 30, unit: "份" },
  { name: "寬冬粉", sellPrice: 20, unit: "份" },
  { name: "雞爪", sellPrice: 50, unit: "6支" },
  { name: "大陸妹", sellPrice: 30, unit: "份" },
  { name: "王子麵", sellPrice: 20, unit: "份" },
  { name: "煙燻豬頭皮", sellPrice: 60, unit: "份" },
  { name: "空心菜", sellPrice: 30, unit: "份" },
  { name: "刀削麵", sellPrice: 25, unit: "份" },
  { name: "無骨雞腿排", sellPrice: 85, unit: "份" },
  { name: "娃娃菜", sellPrice: 30, unit: "份" },
  { name: "蒸煮麵", sellPrice: 25, unit: "份" },
  { name: "黑木耳", sellPrice: 30, unit: "份" },
  { name: "大甲乾麵", sellPrice: 25, unit: "份" },
  { name: "小黃瓜", sellPrice: 30, unit: "份" },
  { name: "韓式拉麵", sellPrice: 35, unit: "份" },
  { name: "花椰菜", sellPrice: 30, unit: "份" },
  { name: "寶寶烏龍麵", sellPrice: 40, unit: "份" },
  // 4個30
  { name: "魚餃", sellPrice: 30, unit: "4個" },
  { name: "燕餃", sellPrice: 30, unit: "4個" },
  { name: "蛋餃", sellPrice: 30, unit: "4個" },
  { name: "水晶餃", sellPrice: 30, unit: "4個" },
  { name: "蟹肉棒", sellPrice: 30, unit: "4個" },
  { name: "蒟蒻絲", sellPrice: 30, unit: "4個" },
  { name: "鑫鑫腸", sellPrice: 30, unit: "4個" },
  { name: "魚豆腐", sellPrice: 30, unit: "4個" },
  // 3個35
  { name: "魚包蛋", sellPrice: 35, unit: "3個" },
  { name: "原味貢丸", sellPrice: 35, unit: "3個" },
  { name: "香菇貢丸", sellPrice: 35, unit: "3個" },
  { name: "龍蝦沙拉", sellPrice: 35, unit: "3個" },
  { name: "章魚腳蝦球", sellPrice: 35, unit: "3個" },
  { name: "起司麻吉燒", sellPrice: 35, unit: "3個" },
  { name: "芝麻麻吉燒", sellPrice: 35, unit: "3個" },
  { name: "花生麻吉燒", sellPrice: 35, unit: "3個" },
  // 其他
  { name: "海帶", sellPrice: 10, unit: "個" },
  { name: "大溪豆乾", sellPrice: 25, unit: "塊" },
  { name: "小豆干", sellPrice: 10, unit: "2個" },
  { name: "皮蛋", sellPrice: 30, unit: "顆" },
  { name: "甜不辣", sellPrice: 15, unit: "2個" },
  { name: "大豆皮", sellPrice: 30, unit: "份" },
  { name: "鳥蛋", sellPrice: 20, unit: "3顆" },
  { name: "小豆皮", sellPrice: 30, unit: "份" },
  { name: "黑輪", sellPrice: 20, unit: "條" },
  { name: "凍豆腐", sellPrice: 30, unit: "4個" },
  { name: "素腰花", sellPrice: 20, unit: "3個" },
  { name: "招牌鴨血", sellPrice: 30, unit: "份" },
  { name: "芋頭條", sellPrice: 20, unit: "條" },
  { name: "德式香腸", sellPrice: 30, unit: "條" },
  { name: "干貝燒", sellPrice: 20, unit: "份" },
  { name: "年糕條", sellPrice: 20, unit: "份" },
  { name: "蛋白", sellPrice: 35, unit: "份" },
  { name: "百葉豆腐", sellPrice: 20, unit: "個" },
  { name: "撒尿牛丸", sellPrice: 40, unit: "3顆" },
  { name: "素雞", sellPrice: 25, unit: "個" },
  { name: "花干", sellPrice: 25, unit: "片" },
  { name: "素火腿", sellPrice: 25, unit: "片" },
  { name: "炸豆包", sellPrice: 25, unit: "片" },
  { name: "生豆包", sellPrice: 25, unit: "片" },
  { name: "豬血糕", sellPrice: 25, unit: "個" },
  { name: "香魚捲", sellPrice: 25, unit: "條" },
  { name: "糯米腸", sellPrice: 25, unit: "條" },
];

function loadIngredients() {
  try {
    const raw = localStorage.getItem(INGREDIENTS_KEY);
    if (!raw) {
      // 若 localStorage 無資料，載入預設清單
      return DEFAULT_INGREDIENTS.map(item => ({
        id: crypto.randomUUID(),
        name: item.name,
        buyPrice: 0,
        buyQty: 0,
        sellPrice: item.sellPrice,
        unit: item.unit,
        updatedAt: null,
        history: [],
      }));
    }
    const data = JSON.parse(raw);
    // 這裡加一行：如果是空陣列也載入預設
    if (!Array.isArray(data) || data.length === 0) {
      return DEFAULT_INGREDIENTS.map(item => ({
        id: crypto.randomUUID(),
        name: item.name,
        buyPrice: 0,
        buyQty: 0,
        sellPrice: item.sellPrice,
        unit: item.unit,
        updatedAt: null,
        history: [],
      }));
    }
    return data;
  } catch {
    // 若解析失敗也載入預設清單
    return DEFAULT_INGREDIENTS.map(item => ({
      id: crypto.randomUUID(),
      name: item.name,
      buyPrice: 0,
      buyQty: 0,
      sellPrice: item.sellPrice,
      unit: item.unit,
      updatedAt: null,
      history: [],
    }));
  }
}

function saveIngredients(ingredients) {
  try {
    localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(ingredients));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("saveIngredients failed:", err);
  }
}

function monthOf(dateISO) {
  return (dateISO || "").slice(0, 7);
}

function safeStr(v) {
  return typeof v === "string" ? v : "";
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function calcProfitMargin(buyPrice, sellPrice) {
  if (!sellPrice || sellPrice <= 0) return 0;
  return ((sellPrice - buyPrice) / sellPrice) * 100;
}

function formatMoney(n) {
  return `$${Number(n).toFixed(2)}`;
}

function formatDateTime(ts) {
  if (!ts) return "未修改";
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.position = "fixed";
  toast.style.right = "32px";
  toast.style.bottom = "32px";
  toast.style.background = "#222";
  toast.style.color = "#fff";
  toast.style.padding = "16px 32px";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "18px";
  toast.style.zIndex = 9999;
  toast.style.boxShadow = "0 4px 16px #0008";
  toast.style.transition = "opacity 300ms ease, transform 200ms ease";
  toast.style.opacity = "1";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 900);
}

// 新增：取得最近 N 個月份（格式 "YYYY-MM"）
function getLastNMonths(n) {
  const now = new Date();
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

// 新增：將 records 聚合為每月收入/成本/毛利
function aggregateByMonth(records, months) {
  const map = {};
  months.forEach((m) => (map[m] = { income: 0, cost: 0, profit: 0 }));
  for (const r of records || []) {
    const key = (r?.date || "").slice(0, 7);
    if (!key || !map[key]) continue;
    const amt = Number(r?.amount) || 0;
    const c = Number(r?.cost) || 0;
    if (r?.type === "income") {
      map[key].income += amt;
      map[key].cost += c;
    } else {
      map[key].profit -= amt; // treat expense lowers profit
    }
  }
  // profit = income - cost + expense(negative already)
  months.forEach((m) => {
    map[m].profit = map[m].income - map[m].cost + map[m].profit;
  });
  return months.map((m) => ({ month: m, ...map[m] }));
}

// 新增：簡單 SVG 折線圖元件
function LineChart({ labels, series, colors = [], height = 160, padding = 24 }) {
  if (!labels || labels.length === 0) return null;
  const allValues = series.flatMap((s) => s.data);
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = max - min || 1;
  const w = Math.max(320, labels.length * 60);
  const cx = (i, v) => {
    const x = padding + (i * (w - padding * 2)) / (labels.length - 1 || 1);
    const y = padding + (1 - (v - min) / range) * (height - padding * 2);
    return [x, y];
  };

  return (
    <div className="chartContainer" style={{ overflowX: "auto" }}>
      <svg width={w} height={height}>
        {/* grid horizontal lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
          const y = padding + t * (height - padding * 2);
          return <line key={idx} x1={padding} x2={w - padding} y1={y} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
        })}
        {/* series polylines */}
        {series.map((s, si) => {
          const points = s.data.map((v, i) => cx(i, v).join(",")).join(" ");
          return (
            <g key={si}>
              <polyline points={points} fill="none" stroke={colors[si] || "#fff"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {s.data.map((v, i) => {
                const [x, y] = cx(i, v);
                return <circle key={i} cx={x} cy={y} r={3.2} fill={colors[si] || "#fff"} />;
              })}
            </g>
          );
        })}
        {/* x labels */}
        {labels.map((lab, i) => {
          const [x] = cx(i, 0);
          return (
            <text key={i} x={x} y={height - 6} fontSize="11" fill="rgba(255,255,255,0.7)" textAnchor="middle">
              {lab.slice(5)}
            </text>
          );
        })}
      </svg>

      <div className="chartLegend" style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {series.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", color: "#fff" }}>
            <span style={{ width: 12, height: 12, background: colors[i] || "#fff", display: "inline-block", borderRadius: 3 }} />
            <span style={{ color: "rgba(255,255,255,0.9)" }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [records, setRecords] = useState(() => {
    const r = loadRecords();
    return r.sort((a, b) => {
      const ad = safeStr(a?.date);
      const bd = safeStr(b?.date);
      if (ad !== bd) return bd.localeCompare(ad);
      return (b?.updatedAt || 0) - (a?.updatedAt || 0);
    });
  });

  const [editing, setEditing] = useState(null);

  const [filters, setFilters] = useState({
    month: "",
    type: "all",
    category: "",
    q: "",
  });

  const [fileHandle, setFileHandle] = useState(null); // 用於儲存本地檔案的句柄
  const [datasets, setDatasets] = useState([]); // 資料集清單
  const [selectedDatasets, setSelectedDatasets] = useState([]); // 勾選的資料集
  const [currentDataset, setCurrentDataset] = useState(null); // 當前資料集

  const [ingredients, setIngredients] = useState(() => loadIngredients());
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [history, setHistory] = useState({}); // { [id]: [history objects] }
  const [showSettlement, setShowSettlement] = useState(false); // 新增狀態：是否顯示結算畫面
  const [settlementBuyQty, setSettlementBuyQty] = useState({}); // 結算：進貨數量
  const [settlementSellQty, setSettlementSellQty] = useState({}); // 結算：售出數量

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  useEffect(() => {
    saveIngredients(ingredients);
  }, [ingredients]);

  const filtered = useMemo(() => {
    const cat = (filters.category || "").trim().toLowerCase();
    const q = (filters.q || "").trim().toLowerCase();

    return records.filter((r) => {
      if (filters.month && monthOf(r?.date) !== filters.month) return false;
      if (filters.type !== "all" && r?.type !== filters.type) return false;
      if (cat && !(r?.category || "").toLowerCase().includes(cat)) return false;
      if (q) {
        const hay = `${r?.note || ""} ${r?.category || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [records, filters]);

  const handleSubmit = (rec) => {
    setRecords((prev) => {
      const exists = prev.some((x) => x.id === rec.id);
      const next = exists ? prev.map((x) => (x.id === rec.id ? rec : x)) : [rec, ...prev];

      return next.sort((a, b) => {
        const ad = safeStr(a?.date);
        const bd = safeStr(b?.date);
        if (ad !== bd) return bd.localeCompare(ad);
        return (b?.updatedAt || 0) - (a?.updatedAt || 0);
      });
    });

    setEditing(null);
  };

  const handleDelete = (id) => {
    setRecords((prev) => prev.filter((x) => x.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const allRecords = [];
      for (const file of files) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const loadedRecords = json.map((row) => ({
          id: crypto.randomUUID(),
          date: row["日期"] || "",
          type: row["類型"] === "收入" ? "income" : "expense",
          category: row["分類"] || "未分類",
          amount: Number(row["金額"]) || 0,
          note: row["備註"] || "",
          updatedAt: Date.now(),
          createdAt: Date.now(),
        }));
        allRecords.push(...loadedRecords);
      }

      setRecords((prev) => [...prev, ...allRecords]);
      alert("Excel 檔案匯入成功！");
    } catch (error) {
      console.error("匯入 Excel 檔案失敗：", error);
      alert("無法解析 Excel 檔案，請確認檔案格式是否正確！");
    }
  };

  const handleJsonFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const newDatasets = [];
      for (const file of files) {
        const data = await file.text();
        const json = JSON.parse(data);

        if (Array.isArray(json)) {
          const cleanedRecords = cleanData(json); // 清洗資料
          newDatasets.push({
            id: crypto.randomUUID(),
            name: file.name,
            importedAt: todayISO(),
            records: cleanedRecords,
          });
        }
      }

      setDatasets((prev) => [...prev, ...newDatasets]);
      alert("JSON 檔案匯入成功！");
    } catch (error) {
      console.error("匯入 JSON 檔案失敗：", error);
      alert("無法解析 JSON 檔案，請確認檔案格式是否正確！");
    }
  };

  const updateExcelFile = () => {
    if (!records || records.length === 0) {
      alert("目前沒有記錄可匯出！");
      return;
    }

    const summaryData = [
      { 指標: "收入", 數值: records.filter((r) => r.type === "income").reduce((sum, r) => sum + r.amount, 0) },
      { 指標: "支出", 數值: records.filter((r) => r.type === "expense").reduce((sum, r) => sum + r.amount, 0) },
      { 指標: "補貨成本", 數值: records.filter((r) => r.type === "income").reduce((sum, r) => sum + r.cost, 0) },
      { 指標: "毛利", 數值: records.filter((r) => r.type === "income").reduce((sum, r) => sum + r.amount, 0) -
          records.filter((r) => r.type === "income").reduce((sum, r) => sum + r.cost, 0) },
      { 指標: "毛利率", 數值: records.filter((r) => r.type === "income").reduce((sum, r) => sum + r.amount, 0) > 0
          ? ((records.filter((r) => r.type === "income").reduce((sum, r) => sum + r.amount, 0) -
              records.filter((r) => r.type === "income").reduce((sum, r) => sum + r.cost, 0)) /
            records.filter((r) => r.type === "income").reduce((sum, r) => sum + r.amount, 0)) *
            100
          : 0 },
    ];

    const worksheetSummary = XLSX.utils.json_to_sheet(summaryData);
    const worksheetRecords = XLSX.utils.json_to_sheet(records);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetSummary, "Summary");
    XLSX.utils.book_append_sheet(workbook, worksheetRecords, "Records");

    const blob = new Blob([XLSX.write(workbook, { bookType: "xlsx", type: "array" })], {
      type: "application/octet-stream",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${todayISO()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJson = () => {
    if (!records || records.length === 0) {
      alert("目前沒有記錄可匯出！");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${todayISO()}.json`; // 使用當日日期作為檔名
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDatasetImport = (newDataset) => {
    setDatasets((prev) => [...prev, newDataset]);
  };

  const handleAdd = () => {
    setEditingIngredient({ id: crypto.randomUUID(), name: "", buyPrice: 0, sellPrice: 0 });
  };

  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient);
  };

  const handleSave = (updatedIngredient) => {
    setIngredients((prev) =>
      prev.some((i) => i.id === updatedIngredient.id)
        ? prev.map((i) => (i.id === updatedIngredient.id ? updatedIngredient : i))
        : [...prev, updatedIngredient]
    );
    setEditingIngredient(null);
  };

  const handleCancel = () => {
    setEditingIngredient(null);
  };

  // 結算畫面
  if (showSettlement) {
    // 結算畫面：列出所有食材並可輸入進貨數量（手動），右下角顯示「編輯完成」
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

    // compute last 6 months aggregates from records
    const months = getLastNMonths(6);
    const agg = aggregateByMonth(records, months);
    const labels = agg.map((a) => a.month);
    const profitSeries = agg.map((a) => Number(a.profit || 0));
    const costSeries = agg.map((a) => Number(a.cost || 0));

    return (
      <div
        className="page fade-in"
        style={{
          minHeight: "100vh",
          background: "#181818",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 32,
        }}
      >
        <div style={{ width: "100%", maxWidth: 900, color: "#fff", marginBottom: 12 }}>
          <h2 style={{ color: "#fff", marginBottom: 8 }}>結算 - 編輯進貨數量</h2>
          <p style={{ color: "#aaa", marginTop: 0 }}>請為每項食材輸入本次進貨數量（整數、手動輸入）</p>
        </div>

        {/* 新增：折線圖（毛利 vs 月份 & 進貨成本 vs 月份） */}
        <div style={{ width: "100%", maxWidth: 900, marginBottom: 18 }}>
          <h3 style={{ margin: "8px 0 10px", color: "#fff" }}>過去 6 個月趨勢</h3>
          <LineChart
            labels={labels}
            series={[
              { name: "毛利 (Profit)", data: profitSeries },
              { name: "進貨成本 (Cost)", data: costSeries },
            ]}
            colors={["#ffd54f", "#ff6b6b"]}
            height={200}
          />
        </div>

        <div style={{ width: "100%", maxWidth: 900 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
            {ingredients.map((it) => (
              <div key={it.id} style={{ background: "#232323", padding: 16, borderRadius: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{it.name || "未命名"}</div>
                <div style={{ color: "#e74c3c" }}>進貨總價：{formatMoney(it.buyPrice)}</div>
                <div style={{ color: "#27ae60" }}>售出價格：{formatMoney(it.sellPrice)}</div>
                <div style={{ color: "#fff", marginBottom: 8 }}>進貨數量：{it.buyQty || 0}</div>
                <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <label style={{ color: "#aaa", fontSize: 14 }}>進貨數量</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={settlementBuyQty[it.id] ?? 0}
                      onChange={(e) => {
                        const v = Math.max(0, parseInt(e.target.value, 10) || 0);
                        setSettlementBuyQty((s) => ({ ...s, [it.id]: v }));
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
                  <div>
                    <label style={{ color: "#aaa", fontSize: 14 }}>售出數量</label>
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
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, background: "#232323", padding: 16, borderRadius: 12 }}>
            <div style={{ color: "#fff", fontSize: 18, marginBottom: 8 }}>結算摘要</div>
            <div style={{ color: "#fff" }}>總收入：{formatMoney(revenueByQty)}</div>
            <div style={{ color: "#fff" }}>總成本：{formatMoney(costByQty)}</div>
            <div style={{ color: profitByQty < 0 ? "#e74c3c" : "#fff" }}>
              毛利：{formatMoney(profitByQty)}
            </div>
            <div style={{ color: marginByQty < 0 ? "#e74c3c" : "#fff" }}>毛利率：{marginByQty.toFixed(2)}%</div>
          </div>
        </div>

        {/* 右下角：編輯完成按鈕（固定） */}
        <button
          aria-label="編輯完成"
          style={{
            position: "fixed",
            right: 32,
            bottom: 32,
            width: 140,
            height: 48,
            borderRadius: 24,
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            fontSize: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
            cursor: "pointer",
          }}
          onClick={() => {
            setShowSettlement(false);
            showToast("編輯完成");
          }}
        >
          編輯完成
        </button>
      </div>
    );
  }

  // 主畫面：食材卡片總覽
  if (!editingIngredient) {
    return (
      <div className="page fade-in" style={{ padding: 32, minHeight: "100vh", background: "#181818", position: "relative" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
          {ingredients.length === 0 && (
            <div style={{ color: "#fff", fontSize: 22, opacity: 0.7, margin: "auto" }}>
              尚無食材，請點右下角「＋」新增
            </div>
          )}
          {ingredients.map((item) => {
            const unitCost = item.buyQty > 0 ? item.buyPrice / item.buyQty : 0;
            const profit = item.sellPrice - unitCost;
            const margin = item.sellPrice > 0 ? (profit / item.sellPrice) * 100 : 0;
            const isLoss = profit < 0;
            return (
              <div
                key={item.id}
                style={{
                  background: "#232323",
                  borderRadius: 20,
                  width: 280,
                  padding: 32,
                  boxShadow: "0 4px 16px #0008",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => {
                  setEditingIngredient(item);
                  setEditDraft(null);
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>{item.name}</div>
                <div style={{ fontSize: 18, color: "#e74c3c", marginBottom: 4 }}>
                  進貨總價：<span>{formatMoney(item.buyPrice)}</span>
                </div>
                <div style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>
                  進貨數量：<span>{item.buyQty || 0}</span>
                </div>
                <div style={{ fontSize: 16, color: "#fff", marginBottom: 8 }}>
                  單位成本：<span>{formatMoney(unitCost)}</span>
                </div>
                <div style={{ fontSize: 20, color: "#27ae60", marginBottom: 8 }}>
                  售出價格：<span>{formatMoney(item.sellPrice)}</span>
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: isLoss ? "#e74c3c" : "#fff",
                    background: isLoss ? "#fff1" : "#fff2",
                    borderRadius: 8,
                    padding: "4px 12px",
                    marginTop: 8,
                  }}
                >
                  毛利率：{margin.toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>
        <button
          aria-label="新增食材"
          style={{
            position: "fixed",
            right: 32,
            bottom: 32,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "orange",
            color: "#fff",
            border: "none",
            fontSize: 40,
            boxShadow: "0 4px 16px #0008",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            setEditingIngredient({
              id: crypto.randomUUID(),
              name: "",
              buyPrice: 0,
              sellPrice: 0,
              updatedAt: null,
              history: [],
            });
            setEditDraft(null);
          }}
        >
          <span style={{ fontSize: 40, color: "#fff" }}>＋</span>
        </button>
        {/* 新增：下方置中「開始結算」按鈕 */}
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <button
            className="btn"
            style={{
              background: "#ff9800",
              color: "#fff",
              fontSize: 22,
              borderRadius: 24,
              padding: "16px 48px",
              margin: "32px 0",
              boxShadow: "0 4px 16px #0008",
              pointerEvents: "auto",
            }}
            onClick={() => {
              // 初始化每項食材的結算數量（預設 0），並進入結算畫面
              const buyInit = {};
              const sellInit = {};
              ingredients.forEach((it) => {
                buyInit[it.id] = 0;
                sellInit[it.id] = 0;
              });
              setSettlementBuyQty(buyInit);
              setSettlementSellQty(sellInit);
              setShowSettlement(true);
            }}
          >
            開始結算
          </button>
        </div>
      </div>
    );
  }

  // 編輯頁面
  const draft = editDraft || editingIngredient;
  const unitCost = draft.buyQty > 0 ? draft.buyPrice / draft.buyQty : 0;
  const profit = draft.sellPrice - unitCost;
  const margin = draft.sellPrice > 0 ? (profit / draft.sellPrice) * 100 : 0;
  const isLoss = profit < 0;
  const prevHistory = history[draft.id] || [];

  return (
    <div
      className="page fade-in"
      style={{
        minHeight: "100vh",
        background: "#181818",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 48,
      }}
    >
      <div
        style={{
          background: "#232323",
          borderRadius: 20,
          width: 400,
          padding: 32,
          boxShadow: "0 4px 16px #0008",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <div style={{ fontSize: 18, color: "#aaa", marginBottom: 16 }}>
          上次修改：{formatDateTime(draft.updatedAt)}
        </div>
        <div className="field" style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 18, marginBottom: 6 }}>食材名稱</label>
          <input
            style={{ fontSize: 20, padding: 8, borderRadius: 8, border: "1px solid #444", width: "100%" }}
            value={draft.name}
            onChange={e => setEditDraft({ ...draft, name: e.target.value })}
          />
        </div>
        <div className="field" style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 18, marginBottom: 6 }}>進貨總價</label>
          <input
            type="number"
            min="0"
            step="0.01"
            style={{ fontSize: 20, padding: 8, borderRadius: 8, border: "1px solid #444", width: "100%" }}
            value={draft.buyPrice}
            onChange={e => setEditDraft({ ...draft, buyPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
          />
        </div>
        <div className="field" style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 18, marginBottom: 6 }}>進貨數量</label>
          <input
            type="number"
            min="1"
            step="1"
            style={{ fontSize: 20, padding: 8, borderRadius: 8, border: "1px solid #444", width: "100%" }}
            value={draft.buyQty || ""}
            onChange={e => setEditDraft({ ...draft, buyQty: Math.max(1, parseInt(e.target.value, 10) || 1) })}
          />
        </div>
        <div className="field" style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 18, marginBottom: 6 }}>單位成本（自動計算）</label>
          <input
            type="number"
            value={unitCost.toFixed(2)}
            readOnly
            style={{ fontSize: 20, padding: 8, borderRadius: 8, border: "1px solid #444", width: "100%", background: "#181818", color: "#fff" }}
          />
        </div>
        <div className="field" style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 18, marginBottom: 6 }}>售出價格</label>
          <input
            type="number"
            min="0"
            step="0.01"
            style={{ fontSize: 20, padding: 8, borderRadius: 8, border: "1px solid #444", width: "100%" }}
            value={draft.sellPrice}
            onChange={e => setEditDraft({ ...draft, sellPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
          />
        </div>
        <div
          style={{
            fontSize: 20,
            color: isLoss ? "#e74c3c" : "#fff",
            background: isLoss ? "#fff1" : "#fff2",
            borderRadius: 8,
            padding: "4px 12px",
            marginBottom: 24,
            alignSelf: "flex-start",
          }}
        >
          毛利率：{margin.toFixed(2)}%
        </div>
        {/* 歷史紀錄顯示 */}
        {prevHistory.length > 0 && (
          <div style={{ marginBottom: 16, color: "#aaa", fontSize: 15 }}>
            歷史紀錄：
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {prevHistory.slice(-3).reverse().map((h, idx) => (
                <li key={idx}>
                  {formatDateTime(h.updatedAt)}｜進貨{formatMoney(h.buyPrice)}｜售出{formatMoney(h.sellPrice)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
          <button
            className="btn"
            style={{ flex: 1, background: "#444", color: "#fff", borderRadius: 8, fontSize: 16 }}
            onClick={() => {
              setEditingIngredient(null);
              setEditDraft(null);
            }}
          >
            返回
          </button>
          <button
            className="btn"
            style={{ flex: 1, background: "#888", color: "#fff", borderRadius: 8, fontSize: 16 }}
            disabled={prevHistory.length === 0}
            onClick={() => {
              if (prevHistory.length > 0) {
                const last = prevHistory[prevHistory.length - 1];
                setEditDraft({ ...last });
                setHistory((h) => ({
                  ...h,
                  [draft.id]: prevHistory.slice(0, -1),
                }));
                showToast("已還原上一筆紀錄");
              }
            }}
          >
            上一步修改
          </button>
          <button
            className="btn"
            style={{ flex: 1, background: "#aaa", color: "#fff", borderRadius: 8, fontSize: 16 }}
            onClick={() => setEditDraft({ ...editingIngredient })}
          >
            取消
          </button>
          <button
            className="btn"
            style={{ flex: 1, background: "#ff9800", color: "#fff", borderRadius: 8, fontSize: 16 }}
            onClick={() => {
              if (!draft.name.trim()) {
                showToast("食材名稱不可為空");
                return;
              }
              // 儲存歷史
              setHistory((h) => ({
                ...h,
                [draft.id]: [...(h[draft.id] || []), { ...editingIngredient }],
              }));
              // 更新食材
              setIngredients((prev) =>
                prev.some((i) => i.id === draft.id)
                  ? prev.map((i) => (i.id === draft.id ? { ...draft, updatedAt: Date.now() } : i))
                  : [...prev, { ...draft, updatedAt: Date.now() }]
              );
              setEditingIngredient(null);
              setEditDraft(null);
              showToast("已儲存變更");
            }}
          >
            儲存變更
          </button>
          <button
            className="btn"
            style={{ flex: 1, background: "#e74c3c", color: "#fff", borderRadius: 8, fontSize: 16 }}
            onClick={() => {
              if (window.confirm("確定要刪除此食材？")) {
                setIngredients((prev) => prev.filter((i) => i.id !== draft.id));
                setEditingIngredient(null);
                setEditDraft(null);
                setHistory((h) => {
                  const nh = { ...h };
                  delete nh[draft.id];
                  return nh;
                });
                showToast("已刪除");
              }
            }}
          >
            刪除
          </button>
        </div>
      </div>
    </div>
  );
}
