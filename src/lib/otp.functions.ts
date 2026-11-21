import { createServerFn } from "@tanstack/react-start";

export const sendOtp = createServerFn({ method: "POST" })
  .validator((data: { mobile: string }) => data)
  .handler(async ({ data }) => {
    const { sendOtpSms } = await import("@/lib/blacksms.server");
    try {
      await sendOtpSms(data.mobile);
      return { sent: true as const };
    } catch (error) {
      return { sent: false as const, error: error instanceof Error ? error.message : "Could not send the OTP." };
    }
  });

export const verifyOtp = createServerFn({ method: "POST" })
  .validator((data: { mobile: string; otp: string }) => data)
  .handler(async ({ data }) => {
    const { verifyOtpSms } = await import("@/lib/blacksms.server");
    try {
      await verifyOtpSms(data.mobile, data.otp);
      return { verified: true as const };
    } catch (error) {
      return { verified: false as const, error: error instanceof Error ? error.message : "Incorrect OTP." };
    }
  });
