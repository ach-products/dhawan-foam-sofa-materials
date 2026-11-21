import { createServerFn } from "@tanstack/react-start";

export const sendOtp = createServerFn({ method: "POST" })
  .validator((data: { mobile: string }) => data)
  .handler(async ({ data }) => {
    const { generateOtpCode, createChallenge } = await import("@/lib/otp-challenge.server");
    const { sendOtpCodeSms } = await import("@/lib/blacksms.server");
    try {
      const code = generateOtpCode();
      await sendOtpCodeSms(data.mobile, code);
      return { sent: true as const, token: createChallenge(data.mobile, code) };
    } catch (error) {
      return { sent: false as const, error: error instanceof Error ? error.message : "Could not send the OTP." };
    }
  });

export const verifyOtp = createServerFn({ method: "POST" })
  .validator((data: { mobile: string; otp: string; token: string }) => data)
  .handler(async ({ data }) => {
    const { verifyChallenge } = await import("@/lib/otp-challenge.server");
    if (!verifyChallenge(data.mobile, data.otp, data.token)) {
      return { verified: false as const, error: "Incorrect or expired OTP. Please try again." };
    }
    return { verified: true as const };
  });
