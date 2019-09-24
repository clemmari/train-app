import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Station } from '../models/station.model';

@Injectable()
export class TrainService {
  private url = 'http://rata.digitraffic.fi/api/v1/';
  constructor(private http: HttpClient) {}

  public getStations(): Promise<Station[]> {
    return this.http
      .get<Station[]>('https://rata.digitraffic.fi/api/v1/metadata/stations')
      .toPromise();
  }

  public getTrainsForStation(station: string): Promise<any> {
    const url2 = this.url + 'live-trains/station/';
    return this.http
      .get(url2 + station + '?train_categories=Commmuter,Long-distance')
      .toPromise();
  }
}
