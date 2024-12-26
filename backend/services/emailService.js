const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

/**
 * Service for handling email-related actions such as sending verification emails,
 * password reset emails, event notifications, etc.
 * @class EmailService
 */
class EmailService {
  /**
   * Initializes the email transporter using SMTP configuration from environment variables.
   * @constructor
   */
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

  /**
   * Loads an HTML email template from the file system.
   * The template is expected to be an HTML file stored in a folder named "emailTemplates".
   * @async
   * @param {string} templateName - The name of the email template file (without extension).
   * @returns {Promise<string>} - The content of the HTML email template.
   */
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

  /**
   * Sends an email to the specified recipient with a specific template and an optional link.
   * @async
   * @param {string} address_to - The recipient's email address.
   * @param {string} emailType - The type of email being sent (e.g., verification, password reset).
   * @param {string} [link=null] - A link to be inserted into the email template (optional).
   * @param {string} [customSubject=null] - A custom subject for the email (optional).
   * @returns {Promise<void>} - Resolves when the email has been sent successfully.
   */
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
