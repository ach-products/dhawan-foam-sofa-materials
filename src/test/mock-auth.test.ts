import { describe, expect, it } from 'vitest';
import { isValidMobile } from '@/lib/mock-auth';
describe('mobile login', () => {
  it('requires a 10-digit Indian mobile', () => { expect(isValidMobile('9876543210')).toBe(true); expect(isValidMobile('12345')).toBe(false); });
});
