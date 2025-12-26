import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

// Managers
const cartManager = new CartManager("./src/data/carts.json");
const productManager = new ProductManager("./src/data/products.json");

// Crear carrito
router.post("/", async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

// Ver Todos los carritos
router.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();
  res.json(carts);
});

// Ver carrito por ID (solo productos)
router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart.products);
});

// Agregar producto al carrito (con validación)
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  // Validar que exista el producto
  const product = await productManager.getProductById(pid);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // Agregar producto al carrito
  const cart = await cartManager.addProductToCart(cid, pid);
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart);
});

export default router;
