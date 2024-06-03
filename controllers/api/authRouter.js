const express = require("express");
const { User } = require("../../models");
const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Received registration data:", req.body);

  try {
    const user = await User.findOne({ where: { email } });
    console.log('line 13:', user);
    if (user) {
      return res.render('register');
      
    } else {
      const userData = await User.create(req.body);
      console.log('line 19:',userData);
      
      res.render('/home')
      req.session.save;
    }

    // const userData = await User.create({ name: username, email, password });
    // req.login(userData, (err) => {
    //   if (err) {
    //     return res
    //       .status(500)
    //       .json({ message: "Registration successful, but login failed" });
    //   }
    //   return res
    //     .status(200)
    //     .json({ message: "Registration and login successful" });
    // });
  } catch (error) {
    console.error("Database error:", error); // Log the error details
    res.status(400).json({ message: "User registration failed", error });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    res.redirect("/login");
  });
});

module.exports = router;