import * as dotenv from 'dotenv';
dotenv.config();
import { influxSettings } from './settings';
import { AlvaDownloader } from './services/alvaDownloader';
import { InfluxDbUploader } from './services/influxDbUploader';
import { exit } from 'process';

if (process.env.NODE_ENV === 'production') {
  console.debug = () => {};
}

if (process.env.ALVA_USERNAME && process.env.ALVA_PASSWORD) {
  console.debug('Fetching data from Alva');
  const alvaDownloader = new AlvaDownloader(process.env.ALVA_USERNAME, process.env.ALVA_PASSWORD);
  alvaDownloader
    .getData()
    .then((data) => {
      console.debug('Starting influxDB update');
      const influxDbUploader = new InfluxDbUploader(influxSettings);
      influxDbUploader.writeDataPoints(data).then(() => {
        console.debug('InfluxDB update complete, exiting');
        exit(0);
      });
    })
    .catch((e) => {
      console.error('Alva downloader failed: ', e);
      exit(1);
    });
} else {
  console.error('Alva username or password not configured');
  exit(1);
}
