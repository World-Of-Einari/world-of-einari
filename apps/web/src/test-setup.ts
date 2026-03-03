import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv();

const originalError = console.error;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const first = args[0] as any;

    const msg = typeof first === 'string' ? first : (first?.message ?? '');

    // JSDOM CSS parser noise (Angular Material/CDK overlays inject @layer CSS)
    if (typeof msg === 'string' && msg.includes('Could not parse CSS stylesheet')) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    originalError(...(args as any));
  });
});
