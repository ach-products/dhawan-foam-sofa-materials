import { createServerFn } from "@tanstack/react-start";

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { checkAdminCredentials, createAdminSessionToken } = await import("@/lib/admin-auth.server");
    try {
      if (!checkAdminCredentials(data.username, data.password)) {
        return { ok: false as const, error: "Incorrect username or password." };
      }
    } catch {
      return { ok: false as const, error: "Admin login is not configured." };
    }
    const { token, exp } = createAdminSessionToken();
    return { ok: true as const, token, exp };
  });
