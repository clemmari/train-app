import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class TrainService {
  private url = 'http://rata.digitraffic.fi/api/v1/trains/latest/1/';
  constructor(private http: HttpClient) {}

  public getStations() {
    return this.http
      .get('https://rata.digitraffic.fi/api/v1/metadata/stations')
      .toPromise();
  }

  public getTrainsForStation(station: string): Promise<any> {
    const asd = this.url + '/live-trains/station/';
    return this.http
      .get(asd + station.toUpperCase() + '?include_nonstopping=false')
      .toPromise();
  }
}
