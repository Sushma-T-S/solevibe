import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log(" Resend email service initialized");
} else {
  console.warn(" RESEND_API_KEY missing - email disabled");
}

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Validate required fields
    if (!to || !subject || !html) {
      console.error(`Email validation failed: missing required fields. to=${to}, subject=${subject ? 'present' : 'missing'}, html=${html ? 'present' : 'missing'}`);
      return false;
    }

    if (!resend) {
      console.warn(`Email to ${to} skipped (no API key)`);
      return false;
    }

    const { data, error } = await resend.emails.send({
      from: "SoleVibe <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }

    console.log("Email sent to", to);
    return true;

  } catch (error) {
    console.error(`Email failed to ${to}:`, error);
    return false;
  }
};

export { sendEmail };

