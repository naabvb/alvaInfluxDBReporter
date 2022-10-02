import { parse } from 'node-html-parser';
import url from 'url';
import { fetch } from './fetch';
import { defaultHeaders, oomiConsumptionRequest } from '../settings';
import { ConsumptionResponse } from '../interfaces/Oomi';

export class OomiDownloader {
  private oomiUsername: string;
  private oomiPassword: string;

  constructor(oomiUsername: string, oomiPassword: string) {
    this.oomiUsername = oomiUsername;
    this.oomiPassword = oomiPassword;
  }

  getData = async (): Promise<[number, number][]> => {
    await this.login();
    const consumption = await this.getConsumption();
    await this.logout();
    return consumption;
  };

  login = async (): Promise<void> => {
    const indexResponse = await fetch('https://online.oomi.fi/eServices/Online/IndexNoAuth');
    const responseBody = await indexResponse.text();
    const parsedHtml = parse(responseBody);
    const verificationToken = parsedHtml.querySelector('input[name=__RequestVerificationToken]')?.attributes.value;
    if (verificationToken) {
      const loginParameters = {
        __RequestVerificationToken: verificationToken,
        UserName: this.oomiUsername,
        Password: this.oomiPassword,
      };
      await fetch('https://online.oomi.fi/eServices/Online/Login', {
        method: 'POST',
        body: new url.URLSearchParams(loginParameters),
        headers: defaultHeaders,
      });
    } else {
      throw new Error('Could not extract verification token');
    }
  };

  getConsumption = async (): Promise<[number, number][]> => {
    const res = await fetch('https://online.oomi.fi/Reporting/CustomerConsumption/GetHourlyConsumption', {
      method: 'POST',
      body: JSON.stringify(oomiConsumptionRequest),
      headers: { ...defaultHeaders, 'Content-Type': 'application/json' },
    });
    const result: ConsumptionResponse = await res.json();
    const [consumption] = result.Consumptions;
    return consumption.Series.Data;
  };

  logout = async (): Promise<void> => {
    await fetch('https://online.oomi.fi/eServices/Online/Logout', { headers: defaultHeaders });
  };
}
