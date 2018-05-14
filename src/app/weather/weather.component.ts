import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { WeatherService } from '../weather.service';
import { DatePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnChanges {

  @Input() wetherChange: any;
  @ViewChild(BaseChartDirective) private chartObject;

  weatherToDay: any;

  responseData: any;

  chartState = 'wind';

  chart = {
    barChartOptions: {
      scaleShowVerticalLines: false,
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          display: false,
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: false
          },
          scaleLabel: {
            display: false
          }
        }]
      }
    },
    barChartLabels: [],
    barChartType: 'bar',
    barChartLegend: false,
    barChartData: [
      { data: [] }
    ]
  };

  constructor(
      private weatherService: WeatherService,
      public datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    if (!this.wetherChange) {
      this.weatherService.getWeatherForecast('London')
          .subscribe(data => {
                this.prepareWeatherData(data);
              },
              error => console.log(error)
          );
    }
  }

  ngOnChanges(changeRecord: SimpleChanges): void {
    if (typeof changeRecord.wetherChange !== 'undefined') {
      const currentValue = changeRecord.wetherChange.currentValue;
      this.prepareWeatherData(currentValue);
      console.log(currentValue);
    }
  }

  setProperties(state): void {
    this.chartState = state;
    this.getChart();

    this.chartObject.ngOnChanges({} as SimpleChanges);
  }

  private getweatherToDay(data): void {
    this.weatherToDay = {
      'city': {
        name: data.city.name,
        country: data.city.country,
      },
      'date': new DatePipe('en-US').transform(data.list[0].dt * 1000, 'EEEE, d MMMM'),
      'temp': `${data.list[0].temp.day.toFixed()} &deg;C`,
      'condition': {
        'icon': `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`,
        'description': data.list[0].weather[0].description
      },
      'pressure': data.list[0].pressure.toFixed(),
      'humidity': data.list[0].humidity,
      'speed': `${data.list[0].speed.toFixed(1)} m/s`,
      'clouds': `${data.list[0].clouds}%`,
    };


  }

  private getChart() {
    this.chart.barChartData[0].data = [];
    this.chart.barChartLabels = [];

    this.responseData.list.forEach((obj) => {
      this.chart.barChartLabels.push(this.datePipe.transform(new Date(obj.dt * 1000), 'd MMM'));
      switch (this.chartState ) {
        case 'wind' :
          this.chart.barChartType = 'line',
          this.chart.barChartData[0].data.push( obj.speed.toFixed(1) );
          break;
        case 'temperature' :
          this.chart.barChartType = 'bar',
          this.chart.barChartData[0].data.push( obj.temp.day.toFixed() );
          break;
        case 'pressure' :
          this.chart.barChartType = 'polarArea',
          this.chart.barChartData[0].data.push( obj.pressure.toFixed() );
          break;
        case 'humidity' :
          this.chart.barChartType = 'pie',
          this.chart.barChartData[0].data.push( obj.humidity );
          break;
      }

    });
  }

  private prepareWeatherData(data): void {

    if(data) {
      this.responseData = data;
      this.getweatherToDay(data);
      this.getChart();
    }

  }

}
