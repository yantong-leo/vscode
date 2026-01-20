export function cleanData(records) {
  return records
    .filter((record) => record.date && record.type && record.amount) // 過濾必要欄位缺失的資料
    .map((record) => ({
      id: record.id || crypto.randomUUID(),
      date: record.date || "",
      type: record.type === "income" ? "income" : "expense", // 預設為支出
      category: record.category || "未分類",
      amount: Number(record.amount) || 0, // 金額非數字則設為 0
      note: record.note || "",
      updatedAt: Date.now(),
      createdAt: record.createdAt || Date.now(),
    }));
}
