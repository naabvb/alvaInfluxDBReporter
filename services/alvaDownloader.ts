import { parse } from 'node-html-parser';
import url from 'url';
import { fetch } from './fetch';
import { alvaConsumptionRequest, defaultHeaders } from '../settings';
import { ConsumptionResponse } from '../interfaces/Alva';

export class AlvaDownloader {
  private alvaUsername: string;
  private alvaPassword: string;

  constructor(alvaUsername: string, alvaPassword: string) {
    this.alvaUsername = alvaUsername;
    this.alvaPassword = alvaPassword;
  }

  getData = async (): Promise<[number, number][]> => {
    await this.login();
    const consumption = await this.getConsumption();
    await this.logout();
    return consumption;
  };

  login = async (): Promise<void> => {
    const loginParameters = {
      __RequestVerificationToken: await this.parseVerificationToken(
        'https://asiakas.alva.fi/eServices/Online/Login?ReturnUrl=/eServices/Online'
      ),
      UserName: this.alvaUsername,
      Password: this.alvaPassword,
      RememberMe: 'false',
    };
    await fetch('https://asiakas.alva.fi/eServices/Online/Login?ReturnUrl=/eServices/Online', {
      method: 'POST',
      body: new url.URLSearchParams(loginParameters),
      headers: defaultHeaders,
    });
  };

  parseVerificationToken = async (url: string): Promise<string> => {
    const indexResponse = await fetch(url);
    const responseBody = await indexResponse.text();
    const parsedHtml = parse(responseBody);
    const token = parsedHtml.querySelector('input[name=__RequestVerificationToken]')?.attributes.value;
    if (token) {
      return token;
    }
    throw new Error('Could not parse verification token');
  };

  getConsumption = async (): Promise<[number, number][]> => {
    const params = {
      ...alvaConsumptionRequest,
      __RequestVerificationToken: await this.parseVerificationToken('https://asiakas.alva.fi/eServices/Online'),
    };
    const res = await fetch('https://asiakas.alva.fi/Reporting/SessionlessConsumption/GetMpConsumptionModel', {
      method: 'POST',
      body: new url.URLSearchParams(params),
      headers: defaultHeaders,
    });
    const result: ConsumptionResponse = await res.json();
    const [consumption] = result.Data.Hours.Consumptions;
    return consumption.Series.Data;
  };

  logout = async (): Promise<void> => {
    await fetch('https://asiakas.alva.fi/eServices/Online/Logout', { headers: defaultHeaders });
  };
}
