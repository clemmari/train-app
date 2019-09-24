import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { TrainService } from 'src/app/services/train.service';
import { find } from 'lodash';
import { Schelude, Arrive } from './../../models/schelude.model';
import { parseISO, toDate, getMinutes, differenceInMinutes } from 'date-fns';
import { Station } from 'src/app/models/station.model';

@Component({
  selector: 'app-schelude-table',
  templateUrl: './schelude-table.component.html',
  styleUrls: ['./schelude-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheludeTableComponent implements OnInit {
  @Input()
  public station: any;
  public customSelected: string;
  private scheludes: Schelude[] = [];
  private stations: any[] = [];

  constructor(private trainService: TrainService) {}

  ngOnInit() {
    this.prepareSchelude();
  }

  private async prepareSchelude() {
    if (this.station) {
      const temp = await this.trainService.getTrainsForStation(
        this.station.stationShortCode
      );
      if (temp) {
        this.createSchelude(temp, this.station);
      }
    }
  }

  private createSchelude(trains: any, station: string): void {
    console.log(this.station);
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

  private sortByDueDate(): void {
    this.scheludes.sort((a: any, b: any) => {
      if (a.arrives.scheludedTime) {
        return (
          toDate(parseISO(a.arrives.scheludedTime)).getTime() -
          toDate(parseISO(b.arrives.scheludedTime)).getTime()
        );
      }
    });
    console.log('asd', this.scheludes);
  }

  private getFullStationName(short: string): string {
    console.log(this.station);
    const name = find(this.station.stationShortCode, (o: any) => {
      return o.stationShortCode === short;
    });
    return name.stationName.split(' ')[0];
  }

  private getLastStation(train: any): string {
    return this.getFullStationName(
      train.timeTableRows[train.timeTableRows.length - 1].stationShortCode
    );
  }

  private schelude(train: any, station: string): Arrive {
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
}
