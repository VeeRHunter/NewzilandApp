import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
// import { ServerinfoProvider } from '../../providers/serverinfo/serverinfo';

import { AuthenticationService } from '../../providers/AuthenticationService';
import { md5 } from '../../providers/md5-ts';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  userData = { 'username': '', 'password': '', 'company': '', 'servername': '' };
  remUsername: boolean;
  switchState = true;

  secureCon: boolean;
  serNameState: boolean;
  comNameState: boolean;
  companyListSelected = false;

  companyList: any[];
  companyDes = '';
  serverName = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    public platform: Platform,
    public alertCtrl: AlertController, public authService: AuthenticationService, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    // tslint:disable-next-line:no-console
    console.log('ionViewDidLoad LoginPage');
    this.secureCon = true;
    this.serNameState = false;
    this.comNameState = false;
    this.companyList = new Array();
    this.serverName = localStorage.getItem('serverName');
    this.switchSetting();
    this.switchLogin();
  }

  clearUsername() {
    this.userData.username = '';
  }

  clearPassword() {
    this.userData.password = '';
  }

  login() {
    this.serverName = localStorage.getItem('serverName');
    if (this.serverName === undefined || typeof (this.serverName) === 'undefined') {
      const alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Settings have not been set. Please set your settings before attempting to log in.',
        buttons: ['Ok'],
      });
      alert.present();
    } else {
      if (this.userData.username === '' || this.userData.company === '') {
        const alert = this.alertCtrl.create({
          title: 'Error',
          message: 'Failed to perform online login and offline credentials do not exist',
          buttons: ['Ok'],
        });
        alert.present();
      } else {
        const loading = this.loadingCtrl.create({
          content: 'Please wait...',
        });
        loading.present();
        const serverURL = 'http://' + this.serverName + '/EquilibriumApi/api/v1/auth/login';
        const netParam = { 'database': '', 'username': '', 'hashedPassword': '', 'includeMenuItems': true };
        netParam.database = localStorage.getItem('companyName');
        netParam.username = this.userData.username;
        netParam.hashedPassword = md5(this.userData.password);
        this.authService.login(serverURL, netParam).then(result => {
          // tslint:disable-next-line:no-console
          console.log(result);
          if (this.remUsername) {
            localStorage.setItem('username', this.userData.username);
            localStorage.setItem('remUsername', JSON.stringify(this.remUsername));
          } else {
            localStorage.setItem('username', '');
            localStorage.setItem('remUsername', JSON.stringify(this.remUsername));
          }
          const alert = this.alertCtrl.create({
            title: 'Success',
            message: 'You are logged in this app',
            buttons: ['Ok'],
          });
          alert.present();
          loading.dismiss();
        }, error => {
          loading.dismiss();
          const toast = this.toastCtrl.create({
            message: 'No Network',
            duration: 2000,
          });
          toast.present();
        });
      }
    }
  }

  switchLogin() {
    if (!this.companyListSelected) {
      this.switchState = true;
      if (this.getLocalstorageState('username')) {
        this.userData.username = localStorage.getItem('username');
      }
      if (this.getLocalstorageState('remUsername')) {
        // tslint:disable-next-line:prefer-conditional-expression
        if (localStorage.getItem('remUsername') === 'true') {
          this.remUsername = true;
        } else {
          this.remUsername = false;
        }
      }
    }
  }

  switchSetting() {
    if (!this.companyListSelected) {
      this.switchState = false;
      if (this.getLocalstorageState('serverName')) {
        this.userData.servername = localStorage.getItem('serverName');
      }
      if (this.getLocalstorageState('companyName')) {
        this.userData.company = localStorage.getItem('companyName');
        this.companyList = JSON.parse(localStorage.getItem('companyList'));
        this.companyDes = localStorage.getItem('companyDes');
      }
    }
  }

  getLocalstorageState(value) {
    if (localStorage.getItem(value) !== undefined && localStorage.getItem(value) !== ''
      && typeof (localStorage.getItem(value)) !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  clearservername() {
    this.userData.servername = '';
  }
  getCompanyList() {
    if (this.userData.servername === '') {
      this.showCampanyList();
    } else {
      const loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      loading.present();
      const serverURL = 'http://' + this.userData.servername + '/equilibriumdirectory/api/instance/get';
      this.authService.getCompanyList(serverURL).then(result => {
        this.companyList = new Array();
        for (const list of Object(result)) {
          this.companyList.push(list);
        }
        this.showCampanyList();
        this.companyDes = this.companyList[0].description;
        this.userData.company = this.companyList[0].key;
        loading.dismiss();
      }, error => {
        loading.dismiss();
        const toast = this.toastCtrl.create({
          message: 'No Network',
          duration: 2000,
        });
        toast.present();
        this.showCampanyList();
      });
    }
  }

  getCompanyFocusOn() {
    // console.log('aisjdhfajsdhfl');
  }

  getCompanyFocusOut() {
    // tslint:disable-next-line:prefer-conditional-expression
    if (this.userData.servername === '') {
      this.serNameState = true;
    } else {
      this.serNameState = false;
    }
  }

  onEmpSelected() {
    // console.log(this.userData);
  }

  saveSetting() {
    // console.log(this.userData);
    localStorage.setItem('serverName', this.userData.servername);
    localStorage.setItem('companyName', this.userData.company);
    localStorage.setItem('companyDes', this.companyDes);
    localStorage.setItem('companyList', JSON.stringify(this.companyList));
    const toast = this.toastCtrl.create({
      message: 'Settings have been saved',
      duration: 1500,
    });
    toast.present();
  }

  clearOffline() {
    localStorage.setItem('companyName', '');
    localStorage.setItem('companyList', '');
    localStorage.setItem('companyDes', '');
    this.userData.company = '';
    this.companyList = new Array();
    setTimeout(() => {
      if (this.userData.servername !== '') {
        // this.getCompanyList();
      }
    }, 500);
    const toast = this.toastCtrl.create({
      message: 'Offline data has been cleared',
      duration: 1500,
    });
    toast.present();
  }

  showCampanyList() {
    this.companyListSelected = true;
  }

  getCompanyListState() {
    if (this.companyList.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  cancelCampany() {
    this.companyListSelected = false;
  }

  selectCompany(index) {
    // console.log(this.companyList[index]);
    this.userData.company = this.companyList[index].key;
    this.companyDes = this.companyList[index].description;
    this.cancelCampany();
  }

}
