import * as argon2 from 'argon2';

describe('Password hashing', () => {
  const password = 'MonMotDePasse123!';

  it('should hash a password without storing it in plain text', async () => {
    const hash = await argon2.hash(password);

    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$argon2id\$/);
  });

  it('should verify a correct password', async () => {
    const hash = await argon2.hash(password);

    const isValid = await argon2.verify(hash, password);

    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const hash = await argon2.hash(password);

    const isValid = await argon2.verify(hash, 'MauvaisMotDePasse123!');

    expect(isValid).toBe(false);
  });
});
