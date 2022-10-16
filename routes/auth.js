const express = require("express");
const router = express.Router();

const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "asdsadhy3t363th3gjdads@$#%$%$Ddsscdsf";

router.post("/api/change-password", (req, res) => {
   const { token, newpassword: plainTextPassword } = req.body;

   if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
   }
   if (plainTextPassword.length < 5) {
      return res.json({
         status: "error",
         error: "Password shoulb be 6 characters",
      });
   }

   try {
      const user = jwt.verify(token, JWT_SECRET);
      // console.log(user)

      const _id = user.id;
      const password = bcrypt.hash(plainTextPassword, 10);
      User.updateOne(
         { _id },
         {
            $set: { password },
         }
      );
      res.json({ status: "ok" });
   } catch (error) {
      res.json({ status: "error", error: "error" });
      console.log(error);
   }

   res.json({ status: "ok" });
});

router.post("/api/login", async (req, res) => {
   const { username, password } = req.body;

   const user = await User.findOne({ username }).lean();

   if (!user) {
      return res.json({ status: "error", error: "User not found" });
   }

   if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
         { id: user._id, username: user.username },
         JWT_SECRET
      );
      return res.json({ status: "ok", data: token });
   }

   res.json({ status: "error", error: "Invalid" });
});

router.post("/api/register", async (req, res) => {
   //   console.log(req.body)

   const { username, password: plainTextPassword } = req.body;
   const password = await bcrypt.hash(plainTextPassword, 10);

   if (!username || typeof username !== "string") {
      return res.json({ status: "error", error: "Invalid username" });
   }
   if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
   }
   if (plainTextPassword.length < 5) {
      return res.json({
         status: "error",
         error: "Password shoulb be 6 characters",
      });
   }

   try {
      const result = await User.create({ username, password });
      console.log(result);
   } catch (error) {
      if (error.code === 11000) {
         return res.json({ status: "error", error: "Username already in use" });
      }
      throw error;
   }

   // console.log(await bcrypt.hash(password, 10));
});

module.exports = router;
