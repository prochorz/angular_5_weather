import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';




@Injectable()
export class WeatherService {

  constructor(private _http: HttpClient) {

  }

  getWeatherForecast(data) {
    let type;
    if (typeof data === 'number') {
      type = `zip=${data}`;
    } else if (typeof data === 'string') {
      type = `q=${data}`;
    }
    const url = `${environment.baseUrl}forecast/daily?${type}&APPID=${environment.appId}&units=${environment.units}&cnt=${environment.cnt}`;

    return this._http.get(url).map(result => result);
  }

}