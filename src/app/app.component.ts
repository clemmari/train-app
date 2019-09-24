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

  public stationNames: { name: string; shortName: string }[] = [];

  constructor(private trainService: TrainService) {}

  ngOnInit() {
    this.fecthStations();
  }

  public search(event: any) {
    this.selectedStation = event.item.stationShortCode;
    this.getTrain(this.selectedStation);
  }

  private async getTrain(station: string) {
    const temp = await this.trainService.getTrainsForStation(station);
    if (temp) {
      this.trains = temp;
      this.createSchelude(temp, station);
    }
  }

  private async fecthStations() {
    const temp = await this.trainService.getStations();
    if (temp) {
      temp.forEach((o: Station) => {
        if (o.passengerTraffic) {
          this.stationNames.push({
            name: o.stationName,
            shortName: o.stationShortCode
          });
          this.stations.push(o);
        }
      });
    }
  }

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

  public sortByDueDate(): void {
    this.scheludes.sort((a: any, b: any) => {
      if (a.arrives.scheludedTime) {
        return (
          toDate(parseISO(a.arrives.scheludedTime)).getTime() -
          toDate(parseISO(b.arrives.scheludedTime)).getTime()
        );
      }
    });
    console.log(this.scheludes);
  }

  private getFullStationName(short: string): string {
    const name = find(this.stations, (o: any) => {
      return o.stationShortCode === short;
    });
    return name.stationName.split(' ')[0];
  }

  public getLastStation(train: any): string {
    return this.getFullStationName(
      train.timeTableRows[train.timeTableRows.length - 1].stationShortCode
    );
  }

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
