const nodemailer = require("nodemailer");
const ejs = require("ejs");
const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name;
    this.url = url;
    this.from = `Facebook <${process.env.EMAIL_FROM}>`;
  }

  // eslint-disable-next-line class-methods-use-this
  newTransport() {
    if (process.env.NODE_ENV === "PRODUCTION") {
      // Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    const html = await ejs.renderFile(
      `${__dirname}/../views/emails/${template}.ejs`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: "Optional text format...",
      text: convert(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Facebook Family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (expires in 10 minutes)"
    );
  }

  async sendAccountVerification() {
    await this.send(
      "verification",
      "Account Activation Link (expires in 10 minutes)"
    );
  }
};
