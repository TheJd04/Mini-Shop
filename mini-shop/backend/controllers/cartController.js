const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Always work with a populated cart and a computed total so the frontend
// never has to re-derive pricing itself.
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const serializeCart = async (cart) => {
  await cart.populate('items.product');
  const items = cart.items
    .filter((item) => item.product) // drop items whose product was deleted
    .map((item) => ({
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      lineTotal: Math.round(item.product.price * item.quantity * 100) / 100,
    }));
  const subtotal = Math.round(items.reduce((sum, i) => sum + i.lineTotal, 0) * 100) / 100;
  return { items, subtotal };
};

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(await serializeCart(cart));
  } catch (err) {
    next(err);
  }
};

// POST /api/cart/items  { productId, quantity }
const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find((i) => i.product.toString() === productId);

    const newQuantity = (existing?.quantity || 0) + Number(quantity);
    if (newQuantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} left in stock` });
    }

    if (existing) {
      existing.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    res.status(201).json(await serializeCart(cart));
  } catch (err) {
    next(err);
  }
};

// PUT /api/cart/items/:itemId  { quantity }
const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((i) => i._id.toString() === req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const product = await Product.findById(item.product);
    if (product && quantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} left in stock` });
    }

    item.quantity = quantity;
    await cart.save();
    res.json(await serializeCart(cart));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart/items/:itemId
const removeItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await cart.save();
    res.json(await serializeCart(cart));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json(await serializeCart(cart));
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
