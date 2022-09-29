export interface InfluxDbSettings {
  host: string;
  port: number;
  protocol: InfluxDbProtocol;
  database: string;
  username?: string;
  password?: string;
}

export enum InfluxDbProtocol {
  HTTPS = "https",
  HTTP = "http",
}
