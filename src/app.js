require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcryptjs");
const hbs = require("hbs");

const auth = require("./middleware/auth");
const UsersMod = require("./models/user");

hbs.registerPartials(path.join(__dirname, "../templates/partials"));
const app = express();
require("./db/conn");
app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;

// app.use(express.static(path.join(__dirname, "../public")));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/secret", auth, (req, res) => {
  console.log("cookies generated at login time", req.cookies.jwt);

  res.render("secret");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/logout", auth, async (req, res) => {
  try {
    console.log("this is req.token", req.token);

    req.userData.tokens = req.userData.tokens.filter((currElem) => {
      return currElem.token != req.token;
    });
    res.clearCookie("jwt");
    console.log("logout successfully");
    await req.userData.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 8);

    const newUser = new UsersMod({
      email: req.body.email,
      password: hash,
    });

    const token = await newUser.generateAuthToken();

    const data = await newUser.save();
    console.log(data);
    if (data) {
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 50000),
      });

      res.status(201).render("index");
    }
  } catch (error) {
    res.status(400).send("some thing went wrong");
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;

    const password = req.body.password;

    const dbUser = await UsersMod.findOne({ email: email });

    if (bcrypt.compare(password, dbUser.password)) {
      const token = await dbUser.generateAuthToken();

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 50000),
      });

      res.render("index");
    } else {
      res.send("invalid credentials");
    }

    // if (dbUser.password === password) {
    //   res.render("index");
    // } else {
    //   res.send("invalid credentials");
    // }
  } catch (error) {
    res.status(500).send("there is problem in our server");
  }
});

app.listen(port, () => {
  console.log("server is running at port 3001");
});
