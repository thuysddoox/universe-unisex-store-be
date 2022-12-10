const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  // service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: "dothuy302000@gmail.com",
    pass: "sslqqodizrhwtaxo",
  },
});

module.exports = {
  mailTransporter,
};
