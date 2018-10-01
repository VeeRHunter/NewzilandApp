import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) public nav: Nav;
  // tslint:disable-next-line:no-any
  public rootPage: any = LoginPage;
  // tslint:disable-next-line:no-any
  public pages: { title: string, component: any, image: string }[];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.ionicInit();
    });
  }

  public ionicInit() {

    this.pages = [
      { title: 'Login', component: LoginPage, image: 'login' },
      { title: 'About', component: AboutPage, image: 'about' },
      // { title: 'my_devices', component: MyDevicesPage, image: "devices" }
    ];

  }

  public openPage(page) {
    // console.log(localStorage.getItem('pageName'));
    // tslint:disable-next-line:no-empty
    if (localStorage.getItem('pageName') === page.title) {
    } else {
      localStorage.setItem('pageName', page.title);
      this.nav.push(page.component);
    }
  }
}
