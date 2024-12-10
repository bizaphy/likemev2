const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: "",
  host: "localhost",
  database: "likeme",
  password: "",
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Obtener todos los posts
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch {
    res.status(500).send("Error al obtener los posts");
  }
});

// Crear posts
app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion } = req.body;

  if (!titulo || !url || !descripcion) {
    return res.status(400).send("Datos incompletos");
  }
  try {
    const img = url;
    const likes = 0;
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo, img, descripcion, likes]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).send("Error al crear post");
  }
});

// Eliminar post
app.delete("/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    res.json({ message: "Post eliminado" });
  } catch {
    res.status(500).send("Error servidor. No se logro eliminar post");
  }
});

// aumentar likes
app.put("/posts/like/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({
      message: "Like +1",
      data: result.rows[0],
    });
  } catch {
    res.status(500).send("Error servidor. No se pudo incrementar likes");
  }
});
// INICIO DE SERVER
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
