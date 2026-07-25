import { Resend } from "resend";
import { FakeStatus } from "../error/error";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (
  email: string,
  rawToken: string,
): Promise<void> => {
  const forntendUrl = process.env.FRONTEND_URL;
  if (!forntendUrl) {
    throw new Error("FRONTEND_URL in undefined");
  }
  const resetLink = `${forntendUrl}/reset-password?token=${rawToken}`;
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: ` <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>,`,
    });
  } catch (error) {
    console.error("Failed to send reset email:", error);
  }
};
