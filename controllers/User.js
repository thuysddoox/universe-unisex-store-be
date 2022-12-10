const Comment = require("../models/Comment");
const User = require("../models/User");
const { mailTransporter } = require("../utils/email");
const bcrypt = require("bcryptjs");
const { APIfeatures } = require("../utils/filter");
exports.getAllUser = async (req, res, next) => {
  try {
    if (req.user && req.user.idAdmin || req.user.role === 2) {
      const features = new APIfeatures(User.find(), req.query).paginating().sorting().searching();
      const users = await features.query;
      const total = await User.countDocuments();
      res.status(200).send({
        responseData: users,
        page: +features.queryString.pageIndex || 1,
        page_size: features.queryString.pageSize * 1 || 12,
        total: total,
      })
    }
    else res.status(400).send({
      message: "You don't allow to do that!"
    });

  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = User.findOne({ _id: req.params.id });
    if (!user) res.status(404).send({ message: "User isn't exist!" });
    else {
      for (let key in user)
        if (req.body[key] && key != "role") user[key] = req.body[key];
      await user.save();
      res.status(200).send({
        responseData: { user },
        status: 200,
        message: "User is updated successfully!",
      });
    }
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

exports.disableUser = async (req, res, next) => {
  try {
    const user = User.findOne({ _id: req.params.id });
    if (!user) res.status(404).send({ message: "User isn't exist!" });
    else {
      user.isActive = !user.isActive;
      await user.save();
      res.status(200).send({
        message: `User is ${user.isActive ? "actived" : "unactived"
          } successfully!`,
      });
    }
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    if (!user) res.status(404).send({ message: "User isn't exist!" });
    else {
      await Comment.deleteMany({ owner: req.user._id });
      res.status(200).send({ message: "User is deleted successfully!" });
    }
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;
  console.log(email)
  try {
    const userInfo = await User.findOne({ email: email });
    console.log(userInfo)

    if (userInfo)
      await mailTransporter.sendMail(
        {
          from: "dothuy302000@gmail.com",
          to: `${email}`,
          subject: "Reset password - Unisex Universe Store",
          text: "the first email sended by nodemailer",
          html: `<div style="
        width: 100%;
        background-color: gray;
        padding: 4rem 0;
      "
    >
      <div style="width:50%;margin:0 auto;background-color:white;padding:1rem;">
        <div
          style="
            width: 100%;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid gray;
            padding-bottom: 1rem;
            align-items: center;
          "
        >
          <h2>THUYSDDOOX</h2>
          <h1>UNIS</h1>
        </div>
        <div
          style="
            width: 100%;
            margin-top: 1rem;
            border-bottom: 1px solid gray;
            padding-bottom: 2rem;
          "
        >
          <p>Dear, ${userInfo?.fullname ?? userInfo?.username}}</p>
          <br />
          <p>      
            The password reset request has been linked to this email address. You can change your password by following the link below:
          </p>
          <button
            style="
              border: none;
              outline: none;
              padding: 1rem;
              background-color: teal;
              margin-top: 2rem;
              border-radius: 0.5rem;
            "
          >
            <a
              href="http://localhost:3001/reset-pass?idReset=${userInfo._id}"
              style="color: #fff; text-decoration: none"
              >Reset Password</a
            >
          </button>
        </div>
        <div style="width: 100%; height: 3rem; margin-top: 1rem">
          <p> Store</p>
        </div>
      </div>
    </div>`,
        },
        (err) => {
          if (err) {
            console.log(err)
            res.status(400).send({ mesage: "Error has occured!", err });
          } else {
            res
              .status(200)
              .send({ responseData: { message: `Sent mail successfully to ${email}}`, isSent: true } });
          }
        }
      );
    else
      return res
        .status(500)
        .send({ message: "Email doesn't exist in system!" });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { newPassword, currentPassword, userId } = req.body;
    const user = req.user || await User.findById(userId);
    if (user) {
      if (currentPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          throw new Error("Current Password is not correct!!!");
        }
      }
      user.password = newPassword;
      await user.save();
      res.status(200).send({ responseData: { message: `Updated password successfully!`, isUpdated: true } });
    } else
      return res.status(500).send({ message: "User doesn't exist in system!" });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};
