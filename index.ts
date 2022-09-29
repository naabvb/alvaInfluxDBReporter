import * as dotenv from "dotenv";
dotenv.config();
import { consdata } from "./data";
import { InfluxDbProtocol, InfluxDbSettings } from "./interfaces/InfluxDb";
import { InfluxDbUploader } from "./services/influxDbUploader";

const influxSettings: InfluxDbSettings = {
  host: process.env.INFLUXDB_HOST || "localhost",
  port: process.env.INFLUXDB_PORT ? parseInt(process.env.INFLUXDB_PORT) : 8086,
  protocol: process.env.INFLUXDB_PROTOCOL as InfluxDbProtocol,
  database: process.env.INFLUXDB_DATABASE || "Electricity",
  username: process.env.INFLUXDB_USERNAME,
  password: process.env.INFLUXDB_PASSWORD,
};

const influx = new InfluxDbUploader(influxSettings);

const [cons] = consdata.Consumptions;
const data = cons.Series.Data as [number, number][];
influx.writeDataPoint(data).then(() => console.log("done"));
