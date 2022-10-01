import { InfluxDbSettings, InfluxDbProtocol } from './interfaces/InfluxDb';

export const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0',
};

export const influxSettings: InfluxDbSettings = {
  host: process.env.INFLUXDB_HOST || 'localhost',
  port: process.env.INFLUXDB_PORT ? parseInt(process.env.INFLUXDB_PORT) : 8086,
  protocol: process.env.INFLUXDB_PROTOCOL as InfluxDbProtocol,
  database: process.env.INFLUXDB_DATABASE || 'Electricity',
  username: process.env.INFLUXDB_USERNAME,
  password: process.env.INFLUXDB_PASSWORD,
};
