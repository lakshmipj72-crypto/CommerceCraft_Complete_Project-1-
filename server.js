const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA = path.join(__dirname, "data");
const dbFile = path.join(DATA, "store.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

function readDB() {
  return JSON.parse(fs.readFileSync(dbFile, "utf8"));
}
function writeDB(db) {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}
function nextId(items) {
  return items.length ? Math.max(...items.map(x => Number(x.id))) + 1 : 1;
}

app.get("/api/products", (req, res) => {
  const db = readDB();
  let products = db.products;
  const q = String(req.query.q || "").toLowerCase();
  const category = String(req.query.category || "all").toLowerCase();
  if (q) products = products.filter(p => `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q));
  if (category !== "all") products = products.filter(p => p.category.toLowerCase() === category);
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = readDB().products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({message: "Product not found"});
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const db = readDB();
  const {name, price, category, image, description, stock} = req.body;
  if (!name || price == null || !category) return res.status(400).json({message: "name, price and category are required"});
  const product = {id: nextId(db.products), name, price: Number(price), category, image: image || "https://placehold.co/600x450?text=Product", description: description || "", stock: Number(stock ?? 10)};
  db.products.push(product); writeDB(db); res.status(201).json(product);
});

app.put("/api/products/:id", (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({message: "Product not found"});
  Object.assign(product, req.body);
  if (product.price != null) product.price = Number(product.price);
  if (product.stock != null) product.stock = Number(product.stock);
  writeDB(db); res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const db = readDB();
  const before = db.products.length;
  db.products = db.products.filter(p => p.id != req.params.id);
  if (db.products.length === before) return res.status(404).json({message: "Product not found"});
  writeDB(db); res.json({message: "Product deleted"});
});

app.post("/api/orders", (req, res) => {
  const db = readDB();
  const {customer, items, total} = req.body;
  if (!customer || !customer.name || !customer.email || !Array.isArray(items) || !items.length)
    return res.status(400).json({message: "Customer and cart items are required"});
  const order = {
    id: nextId(db.orders),
    customer,
    items,
    total: Number(total || 0),
    status: "Placed",
    createdAt: new Date().toISOString()
  };
  db.orders.push(order);
  items.forEach(item => {
    const p = db.products.find(x => x.id == item.id);
    if (p) p.stock = Math.max(0, p.stock - Number(item.quantity || 1));
  });
  writeDB(db);
  res.status(201).json(order);
});

app.get("/api/orders", (req, res) => res.json(readDB().orders));

app.get("/api/categories", (req, res) => {
  const categories = [...new Set(readDB().products.map(p => p.category))];
  res.json(categories);
});

app.get("/api/health", (req, res) => res.json({status: "ok", project: "CommerceCraft"}));

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "frontend", "index.html")));

app.listen(PORT, () => console.log(`CommerceCraft running at http://localhost:${PORT}`));