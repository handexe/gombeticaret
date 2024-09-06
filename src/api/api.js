const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Veritabanı bağlantı havuzu oluşturma
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "myshop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const SECRET_KEY = "hwFTz6/QNcTIa3Oo3BDa4QSqT/iswxBybTb7sfP7tbM="; // JWT için gizli anahtar

// Kayıt route'u
app.post("/register", async (req, res) => {
  const { name, surname, number, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [results] = await db.query(
      "INSERT INTO users (name, surname, number, email, password) VALUES (?, ?, ?, ?, ?)",
      [name, surname, number, email, hashedPassword]
    );

    const userId = results.insertId; // Yeni kullanıcı ID'si
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" }); // Bir JWT oluştur
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Giriş route'u
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    }); // Kullanıcı ID'si ile JWT oluştur
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// JWT doğrulama middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    req.user = user;
    next();
  });
};

// Korunan route
app.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "You have access to this protected route!",
    userId: req.user.userId,
  });
});

// Get all items
app.get("/api/items", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM items");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get selected items
app.get("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query("SELECT * FROM items WHERE id = ?", [id]);
    if (results.length === 0)
      return res.status(404).json({ error: "Item not found" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new item
app.post("/api/items", async (req, res) => {
  const { name, price, image, favorites, category } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO items (name, price, image, favorites, category) VALUES (?, ?, ?, ?, ?)",
      [name, price, image, favorites, category]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an item
app.put("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const [existingItemResults] = await db.query(
      "SELECT * FROM items WHERE id = ?",
      [id]
    );
    if (existingItemResults.length === 0)
      return res.status(404).json({ message: "Item not found" });

    const existingItem = existingItemResults[0];
    const oldPrice = existingItem.price;

    const updatedItem = {
      name: updatedData.name || existingItem.name,
      price: updatedData.price || existingItem.price,
      image: updatedData.image || existingItem.image,
      favorites:
        updatedData.favorites !== undefined
          ? updatedData.favorites
          : existingItem.favorites,
      category: updatedData.category || existingItem.category,
    };

    await db.query("UPDATE items SET ? WHERE id = ?", [updatedItem, id]);

    if (updatedData.price && updatedData.price !== oldPrice) {
      await db.query(
        "INSERT INTO price_history (item_id, old_price, new_price, change_date) VALUES (?, ?, ?, NOW())",
        [id, oldPrice, updatedData.price]
      );
    }

    res.status(200).json({ id, ...updatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get discounted items
app.get("/api/items/discounted", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT items.*, price_history.old_price, price_history.new_price
      FROM items
      JOIN (
        SELECT item_id, MAX(change_date) AS latest_change_date
        FROM price_history
        GROUP BY item_id
      ) latest_price
      ON items.id = latest_price.item_id
      JOIN price_history
      ON latest_price.item_id = price_history.item_id
      AND latest_price.latest_change_date = price_history.change_date
      WHERE price_history.new_price < price_history.old_price
    `);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an item
app.delete("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM items WHERE id = ?", [id]);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search for items
app.get("/api/search", async (req, res) => {
  const { query } = req.query;
  try {
    const [results] = await db.query(
      "SELECT * FROM items WHERE name LIKE ? OR category LIKE ?",
      [`%${query}%`, `%${query}%`]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Arama yapılamadı" });
  }
});

// Sepete ürün ekleme
app.post("/cart/add", async (req, res) => {
  const { productId, quantity, userId, name, image, price } = req.body;
  try {
    // Önce sepette aynı ürün var mı kontrol et
    const [existing] = await db.query(
      "SELECT * FROM cartitems WHERE ProductID = ? AND UserID = ?",
      [productId, userId]
    );

    if (existing.length > 0) {
      // Eğer varsa miktarı güncelle
      await db.query(
        "UPDATE cartitems SET Quantity = Quantity + ? WHERE ProductID = ? AND UserID = ?",
        [quantity, productId, userId]
      );
    } else {
      // Yoksa yeni bir kayıt oluştur
      await db.query(
        "INSERT INTO cartitems (ProductID, Quantity, UserID ,name, price , image ) VALUES (?, ?, ?, ?, ?, ?)",
        [productId, quantity, userId, name, price, image]
      );
    }

    res.status(200).json({ message: "Product added to cart successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put('/cart/update', async (req, res) => {
  const { ProductID,  QuantityUserID, } = req.body;

  try {
    // Mevcut ürün miktarını bul
    const [existingCartItem] = await db.query(
      'SELECT Quantity FROM cartitems WHERE ProductID = ? AND UserID = ?',
      [ProductID, UserID]
    );

    if (existingCartItem) {
      // Yeni miktar: mevcut miktara ekleme yapılıyor
      const newQuantity = existingCartItem.Quantity + Quantity;

      // Ürün miktarını güncelle
      await db.query(
        'UPDATE cartitems SET Quantity = ? WHERE ProductID = ? AND UserID = ?',
        [newQuantity, ProductID, UserID]
      );

      res.status(200).json({ message: 'Cart item updated successfully' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating cart item' });
  }
});

// Sepetteki ürünleri gösterme
app.get("/cart/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const [result] = await db.query(
      "SELECT * FROM cartitems WHERE UserID = ?",
      [userId]
    );
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
