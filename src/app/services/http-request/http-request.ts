import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';

/*
  Generated class for the HttpRequestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({ providedIn: 'root' })
export class HttpRequestProvider {
  
   endpoint = 'http://192.168.43.141/';
  //endpoint = 'https://private-443a5-chargingstation.apiary-mock.com/';
  chargers : any;
  reservations: any;

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, Access-Control-Allow-Origin',
      'Accept': 'application/json',
      'content-type': 'application/json'
    })};

  constructor(public http: HttpClient) {
    console.log('Hello HttpResponse Provider');
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  public makeStationRequest(): Observable<any> {
    return this.http.get(this.endpoint + 'pruebajsoncargador.php').map(this.extractData);
    //return this.http.get(this.endpoint + 'chargers').map(this.extractData);
  }

  public getStations(){
    this.makeStationRequest().subscribe(data => {
      this.chargers = data.next();
      console.log(this.chargers);
      return data;
    }, () => { console.log(this.chargers);
    }); 
  }

  public makeReservationRequest(): Observable<any> {
    return this.http.get(this.endpoint).map(this.extractData);
   // return this.http.get(this.endpoint + 'reservations').map(this.extractData);
  }

  public getReservations(){
    this.makeReservationRequest().subscribe(data => {
      console.log(data);
      this.reservations = data;
      console.log(this.reservations);
      return data;
    }, () => { console.log(this.reservations);
    }); 
  }

  public sendPostRequest(postData: any = {}, path: string) {
    console.log(postData)
    console.log(this.endpoint + path)
    return new Promise((resolve, error) => {
       this.http.post(this.endpoint + path, postData, this.httpOptions)
      .subscribe(data => {
        console.log(data);
        resolve(data);
       }, err => {
        console.log(error);
        error(err);
      });
    });
  }
}


