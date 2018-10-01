import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Platform } from 'ionic-angular';
import { ServerinfoProvider } from '../../providers/serverinfo/serverinfo';

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

  public userData = { "username": "", "password": "", "company": "", "servername": "" };
  public remUsername: boolean;
  public switchState = true;

  public secureCon: boolean;
  public serNameState: boolean;
  public comNameState: boolean;
  public companyListSelected = false;

  public companyList: any[];
  public companyDes = "";
  public serverName = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    public platform: Platform,
    public alertCtrl: AlertController, public apiprovider: ServerinfoProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.secureCon = true;
    this.serNameState = false;
    this.comNameState = false;
    this.companyList = new Array();
    this.serverName = localStorage.getItem("serverName");
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
    this.serverName = localStorage.getItem("serverName");
    if (this.serverName == null || typeof (this.serverName) == "undefined") {
      let alert = this.alertCtrl.create({
        title: "Error",
        message: "Settings have not been set. Please set your settings before attempting to log in.",
        buttons: ["Ok"]
      });
      alert.present();
    } else {
      if (this.userData.username == "" || this.userData.company == "") {
        let alert = this.alertCtrl.create({
          title: "Error",
          message: "Failed to perform online login and offline credentials do not exist",
          buttons: ["Ok"]
        });
        alert.present();
      } else {
        let loading = this.loadingCtrl.create({
          content: "Please wait..."
        });
        loading.present();
        let serverURL = "http://" + this.serverName + "/EquilibriumApi/api/v1/auth/login";
        let netParam = { "database": "", "username": "", "hashedPassword": "", "includeMenuItems": true };
        netParam.database = localStorage.getItem("companyName");
        netParam.username = this.userData.username;
        netParam.hashedPassword = md5(this.userData.password);
        this.apiprovider.login(serverURL, netParam).then(result => {
          console.log(result);
          if (this.remUsername) {
            localStorage.setItem("username", this.userData.username);
            localStorage.setItem("remUsername", JSON.stringify(this.remUsername));
          } else {
            localStorage.setItem("username", "");
            localStorage.setItem("remUsername", JSON.stringify(this.remUsername));
          }
          let alert = this.alertCtrl.create({
            title: "Success",
            message: "You are logged in this app",
            buttons: ["Ok"]
          });
          alert.present();
          loading.dismiss();
        }, error => {
          loading.dismiss();
          let toast = this.toastCtrl.create({
            message: "No Network",
            duration: 2000
          });
          toast.present();
        })
      }
    }
  }

  switchLogin() {
    if (!this.companyListSelected) {
      this.switchState = true;
      console.log(localStorage.getItem("remUsername"));
      if (this.getLocalstorageState("username")) {
        this.userData.username = localStorage.getItem("username");
      }
      if (this.getLocalstorageState("remUsername")) {
        if (localStorage.getItem("remUsername") == "true") {
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
      if (this.getLocalstorageState("serverName")) {
        this.userData.servername = localStorage.getItem("serverName");
      }
      if (this.getLocalstorageState("companyName")) {
        this.userData.company = localStorage.getItem("companyName");
        this.companyList = JSON.parse(localStorage.getItem("companyList"))
        this.companyDes = localStorage.getItem("companyDes");
      }
    }
  }

  getLocalstorageState(value) {
    if (localStorage.getItem(value) != null && localStorage.getItem(value) != ""
      && typeof (localStorage.getItem(value)) != "undefined") {
      return true;
    } else {
      return false;
    }
  }

  clearservername() {
    this.userData.servername = '';
  }
  getCompanyList() {
    if (this.userData.servername == '') {
      this.showCampanyList();
    } else {
      let loading = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loading.present();
      let serverURL = "http://" + this.userData.servername + "/equilibriumdirectory/api/instance/get"
      this.apiprovider.getCompanyList(serverURL).then(result => {
        console.log(result);
        this.companyList = new Array();
        for (let list of Object(result)) {
          this.companyList.push(list);
        }
        this.showCampanyList();
        this.companyDes = this.companyList[0].description;
        this.userData.company = this.companyList[0].key;
        loading.dismiss();
      }, error => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: "No Network",
          duration: 2000
        });
        toast.present();
        this.showCampanyList();
      });
    }
  }

  getCompanyFocusOn() {
    console.log("aisjdhfajsdhfl");
  }


  getCompanyFocusOut() {
    if (this.userData.servername == '') {
      this.serNameState = true;
    } else {
      this.serNameState = false;
    }
  }

  onEmpSelected() {
    console.log(this.userData);
  }

  saveSetting() {
    console.log(this.userData);
    localStorage.setItem("serverName", this.userData.servername);
    localStorage.setItem("companyName", this.userData.company);
    localStorage.setItem("companyDes", this.companyDes);
    localStorage.setItem("companyList", JSON.stringify(this.companyList));
    let toast = this.toastCtrl.create({
      message: "Settings have been saved",
      duration: 1500
    });
    toast.present();
  }

  clearOffline() {
    localStorage.setItem("companyName", "");
    localStorage.setItem("companyList", "");
    localStorage.setItem("companyDes", "");
    this.userData.company = "";
    this.companyList = new Array();
    setTimeout(() => {
      if (this.userData.servername != "") {
        // this.getCompanyList();
      }
    }, 500);
    let toast = this.toastCtrl.create({
      message: "Offline data has been cleared",
      duration: 1500
    });
    toast.present();
  }

  showCampanyList() {
    this.companyListSelected = true;
  }

  getCompanyListState() {
    if (this.companyList.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  cancelCampany() {
    this.companyListSelected = false;
  }

  selectCompany(index) {
    console.log(this.companyList[index]);
    this.userData.company = this.companyList[index].key;
    this.companyDes = this.companyList[index].description;
    this.cancelCampany();
  }

}
