import * as dotenv from 'dotenv';
dotenv.config();
import { influxSettings } from './settings';
import { OomiDownloader } from './services/oomiDownloader';
import { InfluxDbUploader } from './services/influxDbUploader';
import { exit } from 'process';

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
}

if (process.env.OOMI_USERNAME && process.env.OOMI_PASSWORD) {
  console.log('Fetching data from Oomi');
  const oomiDownloader = new OomiDownloader(process.env.OOMI_USERNAME, process.env.OOMI_PASSWORD);
  oomiDownloader
    .getData()
    .then((data) => {
      console.log('Starting influxDB update');
      const influxDbUploader = new InfluxDbUploader(influxSettings);
      influxDbUploader.writeDataPoints(data).then(() => {
        console.log('InfluxDB update complete, exiting');
        exit(0);
      });
    })
    .catch((e) => {
      console.error('Oomi downloader failed: ', e);
      exit(1);
    });
} else {
  console.error('Oomi username or password not configured');
  exit(1);
}
