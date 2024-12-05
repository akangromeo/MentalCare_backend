const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dass42Routes = require("./routes/dass42Routes");
const resultRoutes = require("./routes/resultRoutes");
const authenticate = require("./middleware/authenticate");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// Pastikan Anda menambahkan tanda '/' di depan setiap path rute
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api/test", dass42Routes);
app.use("/api/results", resultRoutes);
app.use("/api/user", userRoutes);

// Pastikan untuk menggunakan port yang sudah diatur di file .env atau default 3000
sequelize
  .sync()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Error connecting to database:", error));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
