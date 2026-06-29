const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders  { shippingAddress }
// Converts the user's current cart into an order. This is a *simulated*
// checkout — no real payment is processed, but stock is genuinely
// decremented and the cart is genuinely cleared, so the data flow is real.
const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    const required = ['fullName', 'addressLine', 'city', 'postalCode', 'country'];
    const missing = required.filter((f) => !shippingAddress?.[f]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing shipping fields: ${missing.join(', ')}` });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Verify stock for every item before committing to anything
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({ message: 'One of your cart items is no longer available' });
      }
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `Only ${item.product.stock} of "${item.product.name}" left in stock`,
        });
      }
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const total = Math.round(
      orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100
    ) / 100;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      total,
    });

    // Decrement stock for each purchased product
    await Promise.all(
      cart.items.map((item) =>
        Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } })
      )
    );

    // Empty the cart now that the order is placed
    cart.items = [];
    await cart.save();

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders — the logged-in user's order history
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only view your own orders' });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById };
