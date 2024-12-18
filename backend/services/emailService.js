const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMPT_ACCOUNT,
        pass: process.env.SMPT_PASSWORD,
      },
    });
  }

  async loadTemplate(templateName) {
    const templatePath = path.join(
      __dirname,
      "emailTemplates",
      `${templateName}.html`
    );
    return fs.promises.readFile(templatePath, "utf-8");
  }

  emailSubjects = {
    verification: "Verification email for volunteer website",
    passwordReset: "Reset your password at volunteer website ",
    eventChanges: "Event Changes Notification",
    eventCanceled: "Event Canceled Notification",
  };

  async SendMail(address_to, emailType, link = null, customSubject = null) {
    const htmlTemplate = await this.loadTemplate(emailType);

    let htmlContent = htmlTemplate;
    if (link) {
      htmlContent = htmlContent.replace("{{link}}", link);
    }

    let subject;

    if (customSubject != null) {
      subject = customSubject;
    } else {
      subject = this.emailSubjects[emailType];
    }

    await this.transporter.sendMail({
      from: process.env.SMTP_ACCOUNT,
      to: address_to,
      subject: subject,
      text: "",
      html: htmlContent,
    });
  }
}

module.exports = new EmailService();
