import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = parts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid or expired" });
    }

    // Kiểm tra userId nếu route yêu cầu
    // Ví dụ: nếu URL có :userId hoặc body có userId để đảm bảo token khớp với user
    if (req.params.userId && req.params.userId !== decoded.userId) {
      return res.status(403).json({ message: "User ID mismatch" });
    }

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      fullName: decoded.fullName
    };

    next();
  });
}
