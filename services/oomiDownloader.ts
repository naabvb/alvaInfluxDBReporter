import { parse } from 'node-html-parser';
import url from 'url';
import { fetch } from './fetch';
import { defaultHeaders } from '../settings';

export class OomiDownloader {
  private oomiUsername: string;
  private oomiPassword: string;

  constructor(oomiUsername: string, oomiPassword: string) {
    this.oomiUsername = oomiUsername;
    this.oomiPassword = oomiPassword;
  }

  handler = async () => {
    await this.login();
    await this.getData();
    await this.logout();
  };

  login = async () => {
    const res = await fetch('https://online.oomi.fi/eServices/Online/IndexNoAuth');
    const body = await res.text();
    const parsed = parse(body);
    const verificationToken = parsed.querySelector('input[name=__RequestVerificationToken]')?.attributes.value;
    if (verificationToken) {
      const params = {
        __RequestVerificationToken: verificationToken,
        UserName: this.oomiUsername,
        Password: this.oomiPassword,
      };
      await fetch('https://online.oomi.fi/eServices/Online/Login', {
        method: 'POST',
        body: new url.URLSearchParams(params),
        headers: defaultHeaders,
      });
    } else {
      throw 'no toks';
    }
  };

  getData = async () => {
    const body = {
      customerCode: process.env.OOMI_CUSTOMER_CODE,
      networkCode: process.env.OOMI_NETWORK_CODE,
      meteringPointCode: process.env.OOMI_METERING_POINT_CODE,
      enableTemperature: 'true',
      enablePriceSeries: 'false',
      enableTemperatureCorrectedConsumption: 'true',
      mpSourceCompanyCode: '',
      activeTarificationId: '',
    };
    const res = await fetch('https://online.oomi.fi/Reporting/CustomerConsumption/GetHourlyConsumption', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { ...defaultHeaders, 'Content-Type': 'application/json' },
    });
    console.log(res);
    const result = await res.json();
    console.log(result);
  };

  logout = async () => {
    await fetch('https://online.oomi.fi/eServices/Online/Logout', { headers: defaultHeaders });
  };
}
