import {Component, Output, EventEmitter} from '@angular/core';
import {WeatherService} from '../weather.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    @Output() wetherChange = new EventEmitter;

    serchQ: any;

    constructor(private weatherService: WeatherService) {
    }

    onSubmit() {
        this.weatherService.getWeatherForecast(this.serchQ)
            .subscribe(data => {
                    this.wetherChange.emit(data);
                },
                error => console.warn(error)
            );
    }


}
