import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigurationState, LoginConfiguration } from './applicationConfigurationState';
import { CompanyModel } from '../models/CompanyModel';

@Injectable()
export class DirectoryService {
    constructor(
        private http: Http,
        private configurationState: ApplicationConfigurationState
    ) {
    }

    public getCompanyList(): Promise<CompanyModel[]> {
        // const serverUrl = `${this.configurationState.loginConfiguration.serverUrl}/EquilibriumDirectory/api/get`;

        const serverUrl = new LoginConfiguration().serverUrl + this.configurationState.loginConfiguration.serverName + `/equilibriumdirectory/api/instance/get`;

        // const serverUrl = 'http://c9f97d3f.ngrok.io/equilibriumdirectory/api/instance/get';

        return new Promise((resolve, reject) => {
            this.http.get(serverUrl).subscribe(res => {
                resolve(res.json() as CompanyModel[]);
            }, (err) => {
                reject(err);
            });
        });
    }
}
