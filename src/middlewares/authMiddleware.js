import jwt from "jsonwebtoken";
import User from "../models/User.js"; // make sure path & name are correct

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

      // ✅ Token expiry time (exp = seconds since epoch)
    const expiryTime = new Date(decoded.exp * 1000);

    // Ensure ID type matches DB (your DB stores string IDs)
    const user = await User.findOne({
      where: { id: decoded.id.toString() },
      attributes: ["id", "name", "email", "role"],
    });
    console.log("User found:", user);

    if (!user) {
      return res.status(401).json({ message: "Token failed, not authorized" });
    }

    req.user = user;
    req.tokenExpiry = expiryTime;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Token failed, not authorized" });
  }
};

export default protect;
