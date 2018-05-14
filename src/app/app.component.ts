import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  wetherChange: any;

  handleWetherChange(event) {
    this.wetherChange = event;
    console.log(event);
  }
}
