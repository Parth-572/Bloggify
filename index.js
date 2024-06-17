const express = require("express");
const path = require("path");
const userRouter = require("./router/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/bloggify")
  .then(() => console.log("MongoDB is connected!!!"));

app.use(express.urlencoded({ extended: false }));
app.use("/user", userRouter);
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.set("view engine", "ejs");
app.set(path.resolve("./views"));

app.get("/", (req, res) => {
  res.render("home",{
    user : req.user
  });
});

app.listen(PORT, () => console.log(`Server is Started At PORT : ${PORT}`));
