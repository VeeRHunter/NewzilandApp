import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// tslint:disable-next-line:no-import-side-effect
import 'rxjs/add/operator/map';

/*
  Generated class for the ServerinfoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServerinfoProvider {

  constructor(public http: Http) {
    // tslint:disable-next-line:no-console
    console.log('Hello PeopleproviderProvider Provider');
  }

  login(serverURL, netParam) {

    return new Promise((resolve, reject) => {

      this.http.post(serverURL, (netParam)).subscribe(res => {
        resolve(res.json());
      }, err => {
        reject(err);
      });

    });
  }

  getCompanyList(serverURL) {

    return new Promise((resolve, reject) => {

      this.http.get(serverURL).subscribe(res => {
        resolve(res.json());
      }, err => {
        reject(err);
      });

    });
  }

}
