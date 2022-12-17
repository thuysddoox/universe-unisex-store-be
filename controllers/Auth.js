const User = require("../models/User");

exports.register = async (req, res, next) => {
  const newUser = new User({
    ...req.body,
    role: 1,
  });
  try {
    const { password, phone, role, isAdmin = false, ...user } = newUser._doc;
    if (isAdmin || role === '2') {
      res.status(400).json({
        message: "You don't allow to do that!",
      });
    }
    else {
      if (req.user.isAdmin || req.user.role === 2)
        newUser.role = 3
      newUser.isAdmin = false;
      await newUser.save();
      res.status(201).json({
        responseData: { user },
        status: 201,
        message: "Created user successfully!",
      });
    }

  } catch (error) {
    res.status(500).send({ message: error.message });
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const access_token = await user.generateAuthToken();
    if (!user) {
      return res.status(404).send({ message: "User doesn't exist!!!" });
    }
    else if (user?.isActive && !user.isActive) return res.status(200).send({ message: "Your account is disabled. Please login other account!" });
    else {
      const { password, ...newUser } = user._doc;
      return res.status(200).send({
        responseData: { user: { ...newUser }, access_token }
      });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
