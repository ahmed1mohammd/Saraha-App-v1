import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
       user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
    },
  });

  const info = await transporter.sendMail({
    from: `"Saraha App" <${process.env.SENDER_EMAIL}>`,
    to,
    subject,
    html,
  });

  return info.accepted.length > 0;
};

export const forgotPasswordotp = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
       user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
    },
  });

  const info = await transporter.sendMail({
    from: `"Saraha App" <${process.env.SENDER_EMAIL}>`,
    to,
    subject,
    html,
  });

  return info.accepted.length > 0;
};
