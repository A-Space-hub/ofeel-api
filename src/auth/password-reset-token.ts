import { createHash, randomBytes } from 'node:crypto';

export function hashPasswordResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generatePasswordResetToken() {
  const token = randomBytes(32).toString('hex');
  const tokenHash = hashPasswordResetToken(token);

  return {
    token,
    tokenHash,
  };
}
