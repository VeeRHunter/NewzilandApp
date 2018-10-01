import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MobxAngularModule } from 'mobx-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { HttpModule } from '@angular/http';
import { AboutPage } from '../pages/about/about';
import { ApplicationConfigurationState } from '../providers/applicationConfigurationState';
import { AuthenticationService } from '../providers/authenticationService';
import { DirectoryService } from '../providers/directoryService';

@NgModule({
  declarations: [
    MyApp,
    HomePage, LoginPage, AboutPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MobxAngularModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage, LoginPage, AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthenticationService,
    DirectoryService,
    ApplicationConfigurationState
  ]
})
export class AppModule { }
