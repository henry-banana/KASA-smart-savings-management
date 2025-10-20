//file tạm


const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "../data/users.json");

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Thiếu username hoặc password" });
  }

  const users = JSON.parse(fs.readFileSync(usersPath));
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Sai thông tin đăng nhập" });
  }

  // Giả lập token (sau này sẽ thay bằng JWT)
  const fakeToken = `token-${user.id}-${Date.now()}`;
  res.json({ message: "Đăng nhập thành công", token: fakeToken });
}

function signup(req, res) {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
  }

  const users = JSON.parse(fs.readFileSync(usersPath));

  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ message: "Username đã tồn tại" });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    username,
    email,
    password,
    role: role || "user",
  };

  users.push(newUser);
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  res
    .status(201)
    .json({
      message: "Đăng ký thành công",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
}

module.exports = { login, signup };
