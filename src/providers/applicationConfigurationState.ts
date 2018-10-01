import { Injectable } from '@angular/core';
import { autorun } from 'mobx';
import { observable, computed } from 'mobx-angular';
import { UserModel } from '../models/userModel';

@Injectable()
export class ApplicationConfigurationState {
    @observable public loginConfiguration = new LoginConfiguration();
    @observable public offlineUsers = new Array<UserModel>();
    @observable public documentUploadStatistics = new DocumentUploadStatistics();

    constructor() {
        if (localStorage.loginConfiguration) {
            console.debug('Loading baseConfiguration from localstorage');
            this.loginConfiguration = JSON.parse(localStorage.loginConfiguration);
            console.debug('loginConfiguration=', this.loginConfiguration);
        }
        if (localStorage.documentUploadStatistics) {
            console.debug('Loading document upload statistics from localstorage');
            this.documentUploadStatistics = JSON.parse(localStorage.documentUploadStatistics);
            console.debug('documentUploadStatistics=', this.documentUploadStatistics);
        }

        // Will perist each time a property changes, but only after 100ms has passed
        autorun(() => {
            console.debug('Persisting state to local storage');
            localStorage.loginConfiguration = JSON.stringify(this.loginConfiguration);
            localStorage.documentUploadStatistics = JSON.stringify(this.documentUploadStatistics);
        }, { delay: 100 });
    }

    public resetPersistentState(): void {
        this.loginConfiguration = new LoginConfiguration();
    }
}

export class LoginConfiguration {
    public rememberUsername = true;
    public sessionId = '';
    public serverName = '';
    public databaseName = '';
    public companyName = '';
    public username = '';
    public useSsl = true;
    public passwordHash = '';
    // tslint:disable-next-line:no-any
    public serverNameconsole: any;

    @computed public get serverUrl(): string {
        return `${this.protocol}://${this.serverName}`;
    }

    @computed public get protocol(): string {
        return this.useSsl ? 'https' : 'http';
    }
}

export class DocumentUploadStatistics {
    public lastDownloaded?: Date;
    public lastConfirmedProcess?: Date;
    public lastUploaded?: Date;
}
