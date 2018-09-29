import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingPage } from '../pages/setting/setting';
import { AboutPage } from '../pages/about/about';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = TabsPage;
  public pages: Array<{ title: string, component: any, image: string }>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.ionicInit();
    });
  }

  ionicInit() {

    this.pages = [
      { title: 'Login', component: TabsPage, image: "login" },
      { title: 'About', component: AboutPage, image: "about" },
      // { title: 'my_devices', component: MyDevicesPage, image: "devices" }
    ];

  }

  openPage(page) {
    this.nav.push(page.component);
  }
}

