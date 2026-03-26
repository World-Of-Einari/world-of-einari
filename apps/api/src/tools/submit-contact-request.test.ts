import { describe, it, expect } from 'vitest';
import { validateContactRequest } from './submit-contact-request';

describe('validateContactRequest', () => {
  const valid = {
    name: 'Einari',
    email: 'einari@example.com',
    message: 'Hello there!',
  };

  it('passes for valid input', () => {
    expect(() => validateContactRequest(valid)).not.toThrow();
  });

  describe('name', () => {
    it('throws when name is empty', () => {
      expect(() => validateContactRequest({ ...valid, name: '' })).toThrow('Invalid name');
    });

    it('throws when name is only whitespace', () => {
      expect(() => validateContactRequest({ ...valid, name: '   ' })).toThrow('Invalid name');
    });

    it('throws when name exceeds 200 characters', () => {
      expect(() =>
        validateContactRequest({ ...valid, name: 'a'.repeat(201) }),
      ).toThrow('Invalid name');
    });

    it('passes when name is exactly 200 characters', () => {
      expect(() =>
        validateContactRequest({ ...valid, name: 'a'.repeat(200) }),
      ).not.toThrow();
    });
  });

  describe('email', () => {
    it('throws when email is empty', () => {
      expect(() => validateContactRequest({ ...valid, email: '' })).toThrow('Invalid email');
    });

    it('throws when email is only whitespace', () => {
      expect(() => validateContactRequest({ ...valid, email: '   ' })).toThrow('Invalid email');
    });

    it('throws when email has no @', () => {
      expect(() =>
        validateContactRequest({ ...valid, email: 'notanemail.com' }),
      ).toThrow('Invalid email');
    });

    it('throws when email has no domain part', () => {
      expect(() =>
        validateContactRequest({ ...valid, email: 'user@' }),
      ).toThrow('Invalid email');
    });

    it('throws when email has no TLD', () => {
      expect(() =>
        validateContactRequest({ ...valid, email: 'user@domain' }),
      ).toThrow('Invalid email');
    });

    it('throws when email exceeds 200 characters', () => {
      const longEmail = `${'a'.repeat(195)}@b.com`;
      expect(() =>
        validateContactRequest({ ...valid, email: longEmail }),
      ).toThrow('Invalid email');
    });

    it('passes for valid email formats', () => {
      const emails = [
        'user@example.com',
        'user+tag@sub.example.org',
        'a@b.co',
      ];
      for (const email of emails) {
        expect(() => validateContactRequest({ ...valid, email })).not.toThrow();
      }
    });
  });

  describe('message', () => {
    it('throws when message is empty', () => {
      expect(() => validateContactRequest({ ...valid, message: '' })).toThrow('Invalid message');
    });

    it('throws when message is only whitespace', () => {
      expect(() =>
        validateContactRequest({ ...valid, message: '   ' }),
      ).toThrow('Invalid message');
    });

    it('throws when message exceeds 2000 characters', () => {
      expect(() =>
        validateContactRequest({ ...valid, message: 'a'.repeat(2001) }),
      ).toThrow('Invalid message');
    });

    it('passes when message is exactly 2000 characters', () => {
      expect(() =>
        validateContactRequest({ ...valid, message: 'a'.repeat(2000) }),
      ).not.toThrow();
    });
  });
});
