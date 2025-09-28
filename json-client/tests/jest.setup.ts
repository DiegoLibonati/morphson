import "@testing-library/jest-dom";

import { Config } from "@src/entities/config";

const MOCK_CONFIG: Config = {
  API_URL: "YOUR API URL [OPTIONAL]",
  API_PREFIX: "YOUR API PREFIX [OPTIONAL]",
};

jest.mock("@src/constants/config.ts", () => ({
  get APP_CONFIG() {
    return MOCK_CONFIG;
  },
}));
