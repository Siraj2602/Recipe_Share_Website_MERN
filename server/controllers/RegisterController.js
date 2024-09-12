const User = require("../Schema/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const userId = uuidv4();
    const user = await User.findOne({ userId });

    if (user) {
      return res.json({ error: "User already exists" });
    }

    const token = jwt.sign(email, process.env.SECRET);
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ userId, name, email, password: hash });
    res.json({ newUser, token });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = Register;
