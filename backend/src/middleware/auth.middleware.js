import jwt from "jsonwebtoken";

//Token được cho lúc login, frontend tự lưu lại
//Token này để mỗi khi thăng frontend muốn req gì cũng phải gửi kèm token để xác thực
// Middleware này sẽ lấy trong header
// Trong header nào cũng phải có Authorization: Bearer <token>


export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log("Missing Authorization header");
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const parts = authHeader.split(" ");
  
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.error("Invalid token format in Authorization header:", authHeader);
    return res.status(401).json({ 
      message: "Invalid token format." 
    });
  }

  const token = parts[1];

  // Validate JWT format (should have exactly 2 dots: header.payload.signature)
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    console.error("Malformed token - Expected 3 parts, got:", tokenParts.length);
    console.error("Token structure:", {
      parts: tokenParts.length,
      preview: token.substring(0, 50) + "..."
    });
    return res.status(401).json({ 
      message: "Malformed token. Please login again to get a new token.",
      details: `Token has ${tokenParts.length} parts instead of 3` 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", {
        error: err.message,
        name: err.name,
        tokenPreview: token.substring(0, 30) + "..."
      });
      return res.status(403).json({ 
        message: "Token is invalid or expired. Please login again." 
      });
    }

    // Kiểm tra userId nếu route yêu cầu
    // Ví dụ: nếu URL có :userId hoặc body có userId để đảm bảo token khớp với user
    if (req.body.userId && req.body.userId !== decoded.userId) {
      return res.status(403).json({ message: "User ID mismatch" });
    }

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
