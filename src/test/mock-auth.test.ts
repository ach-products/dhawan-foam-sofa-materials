import { describe, expect, it } from 'vitest';
import { checkOtp, isValidMobile } from '@/lib/mock-auth';
describe('mock OTP login', () => {
  it('accepts only the demo OTP 123456', () => { expect(checkOtp('123456')).toBe(true); expect(checkOtp('000000')).toBe(false); });
  it('requires a 10-digit Indian mobile', () => { expect(isValidMobile('9876543210')).toBe(true); expect(isValidMobile('12345')).toBe(false); });
});
