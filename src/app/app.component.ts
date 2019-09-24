import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { TrainService } from './services/train.service';
import { Station } from './models/station.model';
import { find } from 'lodash';
import { Schelude, Arrive } from './models/schelude.model';
import { parseISO, toDate, getMinutes, differenceInMinutes } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  public inputSelection: string;
  public selectedStation: any;
  private stations: any[] = [];
  private scheludes: Schelude[] = [];
  private trains: any[] = [];

  constructor(private trainService: TrainService) {}

  ngOnInit() {
    this.fecthStations();
  }

  /**
   * Gets stations for typeahead input from digitraffic
   */
  private async fecthStations() {
    const temp = await this.trainService.getStations();
    if (temp) {
      temp.forEach((o: Station) => {
        if (o.passengerTraffic) {
          this.stations.push(o);
        }
      });
    }
  }

  /**
   * This function deals with selection in search input
   * @param event any
   */
  public search(event: any) {
    this.selectedStation = event.item.stationShortCode;
    this.getTrain(this.selectedStation);
  }

  /**
   * When user selects stations, fecth train for it and start creating table
   * @param station string
   */
  private async getTrain(station: string) {
    const temp = await this.trainService.getTrainsForStation(station);
    if (temp) {
      this.trains = temp;
      this.createSchelude(temp, station);
    }
  }

  /**
   * Here we create object for table from trains
   * TODO: Create model for train
   * @param trains any
   * @param station string
   */
  private createSchelude(trains: any, station: string): void {
    this.scheludes = [];
    for (const item of trains) {
      const single: Schelude = new Schelude();
      single.train = item.trainNumber;
      single.trainType = item.trainType;
      single.depStation = this.getFullStationName(
        item.timeTableRows[0].stationShortCode
      );
      single.endStation = this.getLastStation(item);
      single.arrives = this.schelude(item, station);
      this.scheludes.push(single);
    }
    if (this.scheludes) {
      this.sortByDueDate();
    }
  }

  /**
   * Functions sort schelude array by time
   */
  public sortByDueDate(): void {
    this.scheludes.sort((a: any, b: any) => {
      if (a.arrives.scheludedTime) {
        return (
          toDate(parseISO(a.arrives.scheludedTime)).getTime() -
          toDate(parseISO(b.arrives.scheludedTime)).getTime()
        );
      }
    });
  }

  /**
   * Get stations fullname from stations object and returns string
   * @param short string
   */
  private getFullStationName(short: string): string {
    const name = find(this.stations, (o: any) => {
      return o.stationShortCode === short;
    });
    return name.stationName.split(' ')[0];
  }

  /**
   * Function finds the last station from train scheludes and returns name
   */
  private getLastStation(train: any): string {
    return this.getFullStationName(
      train.timeTableRows[train.timeTableRows.length - 1].stationShortCode
    );
  }

  /**
   * Creates Arrive-model from train scheludes for selected station
   * When train is late (actualTime is presented) we check that it is atleast 1 minute
   */
  public schelude(train: any, station: string): Arrive {
    const arrive = new Arrive();
    for (const time of train.timeTableRows) {
      if (time.stationShortCode === station) {
        if (
          time.actualTime &&
          differenceInMinutes(
            parseISO(time.scheduledTime),
            parseISO(time.actualTime)
          ) >= 1
        ) {
          arrive.actualTime = time.actualTime;
          arrive.scheludedTime = time.scheduledTime;
          return arrive;
        } else {
          arrive.scheludedTime = time.scheduledTime;
          return arrive;
        }
      }
    }
  }
}
