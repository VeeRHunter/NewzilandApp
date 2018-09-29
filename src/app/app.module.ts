import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SettingPage } from '../pages/setting/setting';
import { TabsPage } from '../pages/tabs/tabs';
import { ServerinfoProvider } from '../providers/serverinfo/serverinfo';
import { HttpModule } from '@angular/http';

import { Md5 } from 'ts-md5/dist/md5';

@NgModule({
  declarations: [
    MyApp,
    HomePage, LoginPage, SettingPage, TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage, LoginPage, SettingPage, TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen, Md5,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ServerinfoProvider
  ]
})
export class AppModule { }
