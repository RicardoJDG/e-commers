const pool = require("../db");
const router = require("express").Router();
const validInfo = require("../middleware/validInfo");
const bcrypt = require("bcrypt");
const express = require("express");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");
const { json } = require("express");

//REGISTER NEW USER
router.post("/register", validInfo, async (req, res) => {
  const { username, email, password } = req.body;
  const now = new Date();
  try {
    const verificationQuery = "SELECT * FROM customers WHERE email=$1";
    const insertQuery =
      "INSERT INTO customers (first_name, email, password) VALUES ($1, $2, $3) RETURNING id";
    const userOrderQuery =
      "INSERT INTO orders (open_date, customer_id, open) VALUES ($1, $2, true)";

    const user = await pool.query(verificationQuery, [email]);

    if (user.rows.length != 0) {
      return res.status(401).json("A user with that email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptpassword = await bcrypt.hash(password, salt);

    pool
      .query(insertQuery, [username, email, bcryptpassword])
      .then((response) => {
        if (response) {
          pool
            .query(userOrderQuery, [now, response.rows[0].id])
            .then((orderResponse) => {
              console.log("Got in the order pool");
              return res.status(200).json("User created successfully");
            })
            .catch((err) => {
              console.error(err);
              return res.status(500).json("User could not be created");
            });
        }
      });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Something went wrong");
  }
});

//LOGIN FOR EXISTING USER
router.post("/login", validInfo, async (req, res) => {
  const { email, password } = req.body;

  const dbquery = "SELECT * FROM customers WHERE email=$1";

  try {
    const user = await pool.query(dbquery, [email]);

    if (user.rows.length === 0) {
      return res.status(401).json("Email not found in database");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Invalid password");
    }

    const token = jwtGenerator(user.rows[0].id);
    return res.json({ token });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Something went wrong");
  }
});

//VERIFICATION ROUTE. GETS CALLED ON EACH RENDER
router.post("/verify", authorize, (req, res) => {
  try {
    return res.json(true);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});

//USED TO GET THE USER NAME
router.get("/dashboard", authorize, async (req, res) => {
  try {
    const { id } = req.user;
    const nameQuery = "SELECT first_name FROM customers WHERE id=$1";
    const name = await pool.query(nameQuery, [id]);

    return res.json(name.rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server error");
  }
});

module.exports = router;
