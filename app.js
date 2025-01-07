const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const setupSwagger = require("./config/swagger");
const tourRoutes = require("./routes/tourRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const initializeSocket = require("./socket/socket");

dotenv.config();

const app = express();

// Kết nối cơ sở dữ liệu
connectDB();

// Middleware CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const whitelist = [process.env.FRONTEND_URL || "http://localhost:5173"];
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức HTTP được phép
    allowedHeaders: ["Content-Type", "Authorization"], // Các header được phép
    credentials: true, // Cho phép gửi cookie
  })
);

// Middleware xử lý request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Thiết lập Swagger (nếu sử dụng)
setupSwagger(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/categories", categoryRoutes);
app.use("api/chats", chatRoutes);

// Middleware xử lý lỗi (nếu có lỗi)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Tạo server HTTP
const server = http.createServer(app);

// Tích hợp Socket.IO
initializeSocket(server);

// Khởi động server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
