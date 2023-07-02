import { Component } from '@angular/core';
import { WeatherForecastService } from '../services/weather-forecast.service';
import { WeatherData } from '../models/weather-data.model';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.css']
})
export class WeatherForecastComponent {
  weatherData: WeatherData[] = [];

  constructor(private weatherService: WeatherForecastService) {

  }

  fetchWeatherForecast(cityName: string): void {
    this.weatherService.getWeatherForecast(cityName).subscribe(
      (response) => {

        this.weatherData = this.processWeatherForecastResponse(response);
        // Handle the response from the API
        console.log(response);
        console.log(this.weatherData);

      },
      (error) => {
        // Handle any error that occurred
        console.error('Error fetching weather forecast:', error);
      }
    );
  }

  processWeatherForecastResponse(response: any): WeatherData[] {
    //const weatherData: WeatherData[] = [];
    this.weatherData = [];
    // Extract the necessary data from the API response and map it to the WeatherData model
    if (response && response.data.list && response.data.list.length > 0) {
      response.data.list.forEach((item: any) => {
        const weather: any = item.weather[0];

        // Extract the date, temperature, humidity, and any other required properties
        const date: string = item.dt_txt;
        const temperature: number = item.main.temp;
        const humidity: number = item.main.humidity;

        // Create a new WeatherData object and push it to the weatherData array
        const weatherItem: WeatherData = {
          date,
          temperature,
          humidity,
          // Add more properties as needed
        };

        this.weatherData.push(weatherItem);
      });
    }

    return this.weatherData;
  }

  ngOnInit(): void {
    const cityName = 'London'; // Replace with the desired city name
    this.fetchWeatherForecast(cityName);
  }
}
