import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // check if product exists
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // check if already in cart
    let cartItem = await Cart.findOne({ where: { userId: req.user.id, productId } });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId: req.user.id,
        productId,
        quantity: quantity || 1,
      });
    }

    // ✅ re-fetch with relations (Product + Category)
    const cartWithProduct = await Cart.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: "Product", // 👈 alias mandatory
          attributes: ["id", "name", "price", "image"],
          include: [
            {
              model: Category,
              as: "Category",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    res.json(cartWithProduct);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          as: "Product", // 👈 alias use karo
          attributes: ["id", "name", "price", "image"],
          include: [
            {
              model: Category,
              as: "Category", // 👈 Product->Category alias
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });
    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findByPk(req.params.id);

    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    if (cartItem.userId !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findByPk(req.params.id);

    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    if (cartItem.userId !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    await cartItem.destroy();
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing from cart", error });
  }
};
