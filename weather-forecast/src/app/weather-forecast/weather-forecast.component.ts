import { Component } from '@angular/core';
import { WeatherForecastService } from '../services/weather-forecast.service';
import { WeatherData } from '../models/weather-data.model';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.css']
})
export class WeatherForecastComponent {
  weatherData: WeatherData[] = [];
  weatherChart!: Chart;
  cityName: string = '';
  errorMessage: string = '';
  showErrorMessage: Boolean = false;

  constructor(private weatherService: WeatherForecastService) {
    Chart.register(...registerables);
  }

  fetchWeatherForecast(cityName: string): void {
    this.weatherService.getWeatherForecast(cityName).subscribe(
      (response) => {
        this.showErrorMessage = false;
        this.weatherData = this.processWeatherForecastResponse(response);
        // Handle the response from the API
        console.log(response);
        console.log(this.weatherData);
        this.createWeatherChart();
      },
      (error) => {
        // Handle any error that occurred
        console.error('Error fetching weather forecast:', error);
        this.errorMessage = 'Error fetching weather forecast';
        this.showErrorMessage = true;
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

  createWeatherChart(): void {
    const chartData = this.weatherData.map((data) => data.temperature);
    const chartLabels = this.weatherData.map((data) => data.date);

    const canvas = document.getElementById('weatherChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (this.weatherChart) {
      this.weatherChart.destroy();
    }

    if (ctx) {

      this.weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: 'Temperature',
              data: chartData,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Temperature',
              },
            },
          },
        },
      });
    }
  }

  showForecastClick() {
    this.fetchWeatherForecast(this.cityName);
  }
}
