import * as Influx from 'influx';
import { DateTime } from 'luxon';
import { InfluxDbSettings } from '../interfaces/InfluxDb';

export class InfluxDbUploader {
  private client: Influx.InfluxDB;

  constructor(settings: InfluxDbSettings) {
    this.client = this.createClient(settings);
  }

  /**
   * Creates client for influxDB.
   * @param settings Settings for influxDB connection built from environment variables and/or defaults
   * @returns InfluxDB client
   */
  createClient = (settings: InfluxDbSettings): Influx.InfluxDB => {
    return new Influx.InfluxDB({
      host: settings.host,
      port: settings.port,
      protocol: settings.protocol,
      username: settings.username,
      password: settings.password,
      database: settings.database,
      schema: [
        {
          measurement: 'consumption',
          fields: {
            kwh: Influx.FieldType.FLOAT,
          },
          tags: ['key'],
        },
      ],
    });
  };

  /**
   * Calculates and corrects timestamp to wanted timezone. Necessary due to Oomi incorrectly reporting UTC+2/UTC+3 timestamps as UTC.
   * @param timestamp Timestamp in milliseconds
   * @returns Shifted timestamp in milliseconds
   */
  shiftTimestamp = (timestamp: number) => {
    const tzDifferenceInMinutes = DateTime.now().setZone(process.env.TZ).offset - DateTime.now().setZone('UTC').offset;
    return DateTime.fromMillis(timestamp).minus({ minutes: tzDifferenceInMinutes }).toMillis();
  };

  /**
   * Writes data points to influxDB. Uses measurement "consumption" by default.
   * @param consumptionPairs Array of [Timestamp, kWh] tuples
   */
  writeDataPoints = async (consumptionPairs: [number, number][]): Promise<void> => {
    const points = consumptionPairs.map(([timestamp, kwh]) => ({
      measurement: 'consumption',
      fields: { kwh: kwh },
      timestamp: new Date(this.shiftTimestamp(timestamp)),
    }));
    return await this.client.writePoints(points);
  };
}
