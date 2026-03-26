import { describe, expect, it } from 'vitest';
import { AppError, resolveHttpError } from './resolve-http-error';

describe('AppError', () => {
  it('sets statusCode, message, and name', () => {
    const err = new AppError(404, 'Not found');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Not found');
    expect(err.name).toBe('AppError');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('resolveHttpError', () => {
  it('returns statusCode and message from AppError', () => {
    const err = new AppError(403, 'Forbidden');
    expect(resolveHttpError(err)).toEqual({ statusCode: 403, message: 'Forbidden' });
  });

  it('uses .status field when it is a valid HTTP error code', () => {
    expect(resolveHttpError({ status: 400, message: 'Bad Request' })).toEqual({
      statusCode: 400,
      message: 'Bad Request',
    });
  });

  it('uses .statusCode field when it is a valid HTTP error code', () => {
    expect(resolveHttpError({ statusCode: 422, message: 'Unprocessable' })).toEqual({
      statusCode: 422,
      message: 'Unprocessable',
    });
  });

  it('prefers .status over .statusCode when both are present', () => {
    expect(resolveHttpError({ status: 401, statusCode: 500, message: 'Unauthorized' })).toEqual({
      statusCode: 401,
      message: 'Unauthorized',
    });
  });

  it('falls back to "Error" when message is missing', () => {
    expect(resolveHttpError({ status: 404 })).toEqual({ statusCode: 404, message: 'Error' });
  });

  it('falls back to 500 when status is below 400', () => {
    expect(resolveHttpError({ status: 301, message: 'Moved' })).toEqual({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  });

  it('falls back to 500 when status is above 599', () => {
    expect(resolveHttpError({ status: 600, message: 'Weird' })).toEqual({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  });

  it('falls back to 500 for a plain Error', () => {
    expect(resolveHttpError(new Error('oops'))).toEqual({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  });

  it('falls back to 500 for null', () => {
    expect(resolveHttpError(null)).toEqual({ statusCode: 500, message: 'Internal Server Error' });
  });

  it('falls back to 500 for a non-numeric status', () => {
    expect(resolveHttpError({ status: '404' })).toEqual({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  });
});
