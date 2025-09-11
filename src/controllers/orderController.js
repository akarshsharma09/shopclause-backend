import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Category from "../models/Category.js";
import { sequelize } from "../config/db.js";

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // JWT se aayega
   const orders = await Order.findAll({
  where: { userId },
  include: [
    {
      model: OrderItem,
      as: "OrderItems",   // ✅ match with Order.hasMany
      attributes: ["id", "quantity", "price"],
      include: [
        {
          model: Product,
          as: "Product",   // ✅ match with OrderItem.belongsTo
          attributes: ["id", "name", "price", "image"],
          include: [
            {
              model: Category,
              as: "Category",   // ✅ check Product.belongsTo(Category, { as: "Category" })
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    },
  ],
  order: [["createdAt", "DESC"]],
});

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const checkout = async (req, res) => {
  const t = await sequelize.transaction(); // start transaction
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const { paymentMode, address, city, state, pincode } = req.body;

    if (!paymentMode || !address || !city || !state || !pincode) {
      return res
        .status(400)
        .json({ message: "All Fields are required" });
    }

    // 1️⃣ Get cart items
    const cartItems = await Cart.findAll({
      where: { userId },
        include: [
    {
      model: Product,
      as: "Product",   // 👈 alias यहाँ देना जरूरी है
    }
  ],
      transaction: t,
    });
     console.log("req.user:", req.user);
     console.log("req.body:", req.body);
    if (!cartItems.length) {
      await t.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2️⃣ Calculate total amount
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.Product.price,
      0
    );

    // 3️⃣ Create order
    const order = await Order.create(
      {
        userId,
        totalAmount,
        status: "Pending",
        paymentMode,
        address,
        city,
        state,
        pincode,
      },
      { transaction: t }
    );

    // 4️⃣ Create order items
    const orderItems = await Promise.all(
      cartItems.map((item) =>
        OrderItem.create(
          {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.Product.price,
          },
          { transaction: t }
        )
      )
      
    );

    // 5️⃣ Clear cart
    await Cart.destroy({ where: { userId }, transaction: t });

    // ✅ Commit transaction
    await t.commit();

    return res.status(201).json({
      message: "Order placed successfully",
      order,
      orderItems,
      totalAmount,
    });
  } catch (error) {
    // ❌ Rollback transaction if anything fails
    await t.rollback();
    console.error(error);
    return res.status(500).json({ message: "Checkout failed", error: error.message });
  }
};