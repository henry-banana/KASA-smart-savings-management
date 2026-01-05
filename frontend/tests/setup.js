// Jest setup file for component tests
import { TextEncoder } from "util";

global.TextEncoder = TextEncoder;

// Mock the app config file to avoid import.meta issues
jest.mock(
  "@/config/app.config",
  () => ({
    APP_CONFIG: {
      apiUrl: "http://localhost:3000",
      devMode: true,
      enableLogger: true,
    },
    USE_MOCK: true,
    IS_DEV: true,
  }),
  { virtual: true }
);
