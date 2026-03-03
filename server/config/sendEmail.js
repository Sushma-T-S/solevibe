import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

// Create resend instance only if API key exists
let resend = null;

if (process.env.RESEND_API) {
  resend = new Resend(process.env.RESEND_API);
} else {
  console.log("⚠ RESEND_API not found in .env file");
}

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    // If resend is not configured
    if (!resend) {
      console.log("Email service not configured. Skipping email.");
      return null;
    }

    const { data, error } = await resend.emails.send({
    //   from: "solevibe <noreply@yourdomain.com>", // change later to verified domain
      from: "solevibe <onboarding@resend.dev>",  // ✅ use this for now
      to: sendTo,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend error:", error);
      return null;
    }

    console.log("Email sent successfully");
    return data;

  } catch (error) {
    console.error("Email send failed:", error);
    return null;
  }
};

export default sendEmail;