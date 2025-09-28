export type Envs = {
  PORT: Port;
  ENV: Env;
  BASE_URL: BaseUrl;
};

type Port = number;
type Env = "development" | "production";
type BaseUrl = string;
