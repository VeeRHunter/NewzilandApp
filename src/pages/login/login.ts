import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
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

  public userData = { "username": "", "password": "" };
  public remUsername: boolean;

  public serverName = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    public alertCtrl: AlertController, public apiprovider: ServerinfoProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.serverName = localStorage.getItem("serverName");

    // console.log(this.md5("abc"));

    // Generate the MD5 hex string
  }

  clearUsername() {
    this.userData.username = '';
  }

  clearPassword() {
    this.userData.password = '';
  }

  login() {
    if (this.serverName == null || typeof (this.serverName) == "undefined") {
      // this.toastCtrl.create({
      //   message: "Settings have not been set. Please set your settings before attempting to log in.",
      //   duration: 2000
      // }).present();
      let alert = this.alertCtrl.create({
        title: "Error",
        message: "Settings have not been set. Please set your settings before attempting to log in.",
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
        console.log("remUsername");
        console.log(this.remUsername);
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
