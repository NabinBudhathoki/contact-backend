const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("Hello world form the server router.js");
});

//using promises

// router.post("/register", (req, res) => {
//   const { name, email, phone, work, password, cpassword } = req.body;

//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({ error: "plz fill all the property" });
//   }

//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "Email already exist" });
//       }

//       const user = new User({ name, email, phone, work, password, cpassword });

//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "user registered successfully" });
//         })
//         .catch((err) =>
//           res.status(500).json({ error: "Failed to registered" })
//         );
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

//using async- await
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body; //object distructing

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "plz fill all the property" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password are not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      // here middleware
      await user.save();

      res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

//login route
router.post("/signin", async (req, res) => {
  // console.log(req.body);
  // res.json({ message: "awesome" });

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "plz filled the data" });
    }

    const userLogin = await User.findOne({ email: email });

    // console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        // user: userLogin,
      });

      if (!isMatch) {
        res.status(400).json({ error: "invalid credientials pass" });
      } else {
        res.json({ message: "user signin successfully" });
      }
    } else {
      res.status(400).json({ error: "invalid credientials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// about us 
router.get("/about", authenticate, (req, res) => {
  console.log(`hello my about`);
  res.send(req.rootUser);
});

// get user data in contact
router.get("/getdata", authenticate, (req, res) => {
  console.log(`hello my about`);
  res.send(req.rootUser);
});

// logout 
router.get("/logout", (req, res) => {
  console.log(`hello my logout page`);
  res.clearCookie('jwtoken', {path:'/'})
  res.status(200).send('user logout');
});

module.exports = router;
