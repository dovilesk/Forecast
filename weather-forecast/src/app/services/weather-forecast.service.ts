import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WeatherForecastService {

  private apiKey = 'da24cc7aca15efc760df2211a80c876a';

  constructor() { }

  getWeatherForecast(cityName: string): Observable<any> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.apiKey}&units=metric`;
    return from(axios.get(url)) as Observable<AxiosResponse<any>>;
  }
}
