import crypto from "crypto";

// Excludes 0/O and 1/I/L so codes are unambiguous when an employee types
// one in by hand.
const CODE_CHARSET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE_LENGTH = 8;

export function generateCampaignCode(): string {
  let code = "";
  const bytes = crypto.randomBytes(CODE_LENGTH);
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARSET[bytes[i] % CODE_CHARSET.length];
  }
  return code;
}

export function generateUniqueCampaignCodes(count: number): string[] {
  const codes = new Set<string>();
  while (codes.size < count) {
    codes.add(generateCampaignCode());
  }
  return Array.from(codes);
}
