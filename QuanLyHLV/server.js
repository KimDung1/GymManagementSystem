const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const DB = "./packages.json";

// Đọc DB
function readDB() {
  if (!fs.existsSync(DB)) fs.writeFileSync(DB, "[]");
  return JSON.parse(fs.readFileSync(DB));
}

// Ghi DB
function writeDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// GET all
app.get("/api/packages", (req, res) => {
  res.json(readDB());
});

// POST create
app.post("/api/packages", (req, res) => {
  const list = readDB();
  const item = { id: Date.now(), ...req.body };
  list.push(item);
  writeDB(list);
  res.json(item);
});

// PUT update
app.put("/api/packages/:id", (req, res) => {
  const list = readDB();
  const id = Number(req.params.id);
  const index = list.findIndex(p => p.id === id);

  list[index] = { ...list[index], ...req.body };
  writeDB(list);

  res.json(list[index]);
});

// DELETE
app.delete("/api/packages/:id", (req, res) => {
  const list = readDB();
  const id = Number(req.params.id);
  const newList = list.filter(p => p.id !== id);
  writeDB(newList);

  res.json({ success: true });
});

app.listen(3000, () => console.log("API đang chạy tại http://localhost:3000"));
