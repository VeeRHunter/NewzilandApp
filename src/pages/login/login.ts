import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Platform } from 'ionic-angular';
import { DirectoryService } from '../../providers/directoryService';

import { ApplicationConfigurationState, LoginConfiguration } from '../../providers/applicationConfigurationState';
import { CompanyModel } from '../../models/CompanyModel';
import { AuthenticationService } from '../../providers/authenticationService';
import { observable } from 'mobx-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  // Much more efficient change detection. Mobx automatically pushes updates to observable properties
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  public model = new Model();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public platform: Platform,
    public alertCtrl: AlertController,
    public directoryService: DirectoryService,
    public authenticationService: AuthenticationService,
    public loadingCtrl: LoadingController,
    public applicationConfigurationState: ApplicationConfigurationState,
    public cdRef: ChangeDetectorRef) {

    this.model.username = applicationConfigurationState.loginConfiguration.username;
    this.model.useSsl = applicationConfigurationState.loginConfiguration.useSsl;
    this.model.databaseName = applicationConfigurationState.loginConfiguration.databaseName;
    this.model.companyName = applicationConfigurationState.loginConfiguration.companyName;
    this.model.serverName = applicationConfigurationState.loginConfiguration.serverName;
  }

  public ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  public clearUsername() {
    this.model.username = '';
  }

  public clearPassword() {
    this.model.password = '';
  }

  public clearServerName() {
    this.model.serverName = '';
  }

  public login() {
    if (this.applicationConfigurationState.loginConfiguration == null) {
      const alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Settings have not been set. Please set your settings before attempting to log in.',
        buttons: ['Ok']
      });
      alert.present();
    } else {
      if (this.model.username == '') {
        const alert = this.alertCtrl.create({
          title: 'Error',
          message: '"Please input valid username',
          buttons: ['Ok']
        });
        alert.present();
      } else {
        const loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loading.present();

        this.applicationConfigurationState.loginConfiguration.serverName = this.model.serverName;
        this.applicationConfigurationState.loginConfiguration.useSsl = this.model.useSsl;
        this.applicationConfigurationState.loginConfiguration.companyName = this.model.companyName;

        this.authenticationService.login(this.model.username, this.model.password, this.model.databaseName)
          .then(result => {
            console.info('authentication result', result);
            loading.dismiss();

            // TODO : Save username etc into the configuration
            // Add the user to the list of offline users, so we can use it to login offline in the future

          }, error => {
            console.error('error logging in:', error);

            loading.dismiss();
            const toast = this.toastCtrl.create({
              // TODO : Show correct error message
              message: 'Login Failed:' + error,
              duration: 2000
            });
            toast.present();
          });
      }
    }
  }

  public selectLoginTab() {
    if (!this.model.companyListSelected) {
      this.model.activeTab = 0;
    }
  }

  public selectSettingsTab() {
    if (!this.model.companyListSelected) {
      this.model.activeTab = 1;
    }
  }

  public getCompanyList() {
    // tslint:disable-next-line:no-empty
    // this.cdRef.detectChanges();
    if (this.model.serverName == '') {
      this.showCampanyList();
    } else {
      const loading = this.loadingCtrl.create({
        content: 'Please company list'
      });
      loading.present();

      this.applicationConfigurationState.loginConfiguration.serverName = this.model.serverName;

      this.directoryService.getCompanyList()
        .then((result: CompanyModel[]) => {
          console.log('Obtained company list:', result);
          loading.dismiss();

          this.model.companyList = result;
          if (this.model.databaseName == '') {
            this.model.databaseName = this.model.companyList[0].key;
            this.model.companyName = this.model.companyList[0].description;
          }
          this.showCampanyList();
          console.log(this.model.companyList);
        }, error => {
          console.error('Error obtaining company list:', error);
          loading.dismiss();
          this.showCampanyList();

          const toast = this.toastCtrl.create({
            message: 'No Network',
            duration: 2000
          });
          toast.present();
        });
    }
  }

  public clearOffline() {
    this.applicationConfigurationState.resetPersistentState();
    this.model.databaseName = '';
    const toast = this.toastCtrl.create({
      message: 'Offline data has been cleared',
      duration: 1500
    });
    toast.present();
  }

  public saveSetting() {
    const toast = this.toastCtrl.create({
      message: 'Settings have been saved',
      duration: 1500,
    });
    toast.present();
  }

  public showCampanyList() {
    this.model.companyListSelected = true;
    this.getCompanyListState();
  }

  public getCompanyListState() {
    // tslint:disable-next-line:prefer-conditional-expression
    if (this.model.companyList.length > 0) {
      this.model.companyListState = false;
    } else {
      this.model.companyListState = true;
    }
    this.cdRef.detectChanges();
  }

  public cancelCampany() {
    this.model.companyListSelected = false;
  }

  public selectCompany(index) {
    this.model.databaseName = this.model.companyList[index].key;
    this.model.companyName = this.model.companyList[index].description;
    this.applicationConfigurationState.loginConfiguration.databaseName = this.model.databaseName;

    this.cancelCampany();
  }
}

class Model {
  @observable public username = '';
  @observable public password = '';
  @observable public companyList = new Array<CompanyModel>();
  @observable public serverName = '';
  @observable public databaseName = '';
  @observable public companyName = '';
  @observable public useSsl = true;
  @observable public companyListSelected = false;
  @observable public companyListState = false;

  @observable public activeTab = 0;
}