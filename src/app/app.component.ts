import { Component, OnInit } from '@angular/core';
import { TrainService } from './services/train.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private title = 'train-app';
  public customSelected: string;
  private stations: any[];

  constructor(private trainService: TrainService) {}

  ngOnInit() {
    this.lopetaJooko();
  }

  private async lopetaJooko() {
    this.stations = await this.trainService.getStations()[0];
    console.log(this.stations[0]);
  }
}
