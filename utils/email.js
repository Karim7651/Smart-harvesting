import nodemailer from "nodemailer";
export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  const mailOptions = {
    from: "Smart-Harvesting<no-reply@ecommerce.com>", 
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:");
  } catch (error) {
    console.error("Error sending email:");
  }
};