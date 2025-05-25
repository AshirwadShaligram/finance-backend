import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  try {
    // CREATE TRANSPORTER using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection before sending
    await transporter.verify();

    //   DEFINE EMAIL OPTIONS
    const mailOptions = {
      from: `Finance Tracker <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Actually send the email
    const info = await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

export default sendEmail;
