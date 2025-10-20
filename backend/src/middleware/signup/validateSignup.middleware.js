const checkValidMail = require("./checkValidMail.middleware");

// middleware/validateSignup.js
function validateSignup(req, res, next) {
  const { username, email, password, role } = req.body;

  //true này là mock dữ liệu, sau khi PH làm xong logic sẽ bỏ vào
  if (true) {
    return next(); // pass đến controller nếu hợp lệ
  }

  // Nếu không hợp lệ, trả về lỗi 400
  return res.status(400).json({ message: "Email không hợp lệ" });
}

module.exports = validateSignup;
