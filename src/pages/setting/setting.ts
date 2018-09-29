import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { ServerinfoProvider } from '../../providers/serverinfo/serverinfo';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  public userData = { "servername": "", "company": "" };
  public secureCon: boolean;
  public serNameState: boolean;
  public comNameState: boolean;

  public companyList: any[];


  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    public alertCtrl: AlertController, public apiprovider: ServerinfoProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
    this.secureCon = true;
    this.serNameState = false;
    this.comNameState = false;
    this.companyList = new Array();
  }

  clearUsername() {
    this.userData.servername = '';
  }

  clearPassword() {
    this.userData.company = '';
  }

  getCompanyList() {
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loading.present();
    // this.serverName = "https://" + "c9f97d3f.ngrok.io/api/v1/auth/";
    let serverURL = "http://" + this.userData.servername + "/equilibriumdirectory/api/instance/get"
    this.apiprovider.getCompanyList(serverURL).then(result => {
      console.log(result);
      this.companyList = new Array();
      for (let list of Object(result)) {
        this.companyList.push(list);
      }
      loading.dismiss();
    }, error => {
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: "No Network",
        duration: 2000
      });
      toast.present();
    });
  }

  getCompanyFocusOn() {
    console.log("aisjdhfajsdhfl");
  }


  getCompanyFocusOut() {
    if (this.userData.servername == '') {
      this.serNameState = true;
    } else {
      this.serNameState = false;
      this.getCompanyList();
    }
  }

  onEmpSelected() {
    console.log(this.userData);
  }

  saveSetting() {
    console.log(this.userData);
    localStorage.setItem("serverName", this.userData.servername);
    localStorage.setItem("companyName", this.userData.company);
    let toast = this.toastCtrl.create({
      message: "Settings have been saved",
      duration: 1500
    });
    toast.present();
  }

  clearOffline() {
    localStorage.setItem("serverName", "");
    localStorage.setItem("companyName", "");
    let toast = this.toastCtrl.create({
      message: "Offline data has been cleared",
      duration: 1500
    });
    toast.present();
  }

}
