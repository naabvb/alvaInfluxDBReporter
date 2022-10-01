import * as dotenv from 'dotenv';
import { OomiDownloader } from './services/oomiDownloader';
dotenv.config();
import { consdata } from './data';
import { influxSettings } from './settings';
import { InfluxDbUploader } from './services/influxDbUploader';

const influx = new InfluxDbUploader(influxSettings);

const [cons] = consdata.Consumptions;
const data = cons.Series.Data as [number, number][];
//influx.writeDataPoint(data).then((promises) => console.log(promises));
if (process.env.OOMI_USERNAME && process.env.OOMI_PASSWORD) {
  const oomi = new OomiDownloader(process.env.OOMI_USERNAME, process.env.OOMI_PASSWORD);
  oomi.handler().then(() => console.log('d'));
}
