import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  const apiKey = process.env.MAILERCLOUD_API_KEY;

  const transporter = nodemailer.createTransport({
    service: "mailercloud",
    auth: {
      user: "apikey",
      pass: apiKey,
    },
  });

  const mailOptions = {
    from: "your_email@example.com",
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
