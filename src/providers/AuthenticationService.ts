import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApplicationConfigurationState, LoginConfiguration } from './applicationConfigurationState';
import { LoginResponseModel } from '../models/loginResponseModel';
import { md5 } from './md5-ts';
import { UserModel } from '../models/userModel';

@Injectable()
export class AuthenticationService {
  constructor(
    private http: Http,
    private configurationState: ApplicationConfigurationState
  ) {
  }

  // First try to login online. If online login fails, then attempt offline login
  public login(username: string, password: string, databaseName: string): Promise<LoginResponseModel> {
    const loginModel = new LoginModel(username, md5(password), databaseName, true);

    const serverUrl = new LoginConfiguration().serverUrl + this.configurationState.loginConfiguration.serverName + `/EquilibriumApi/api/v1/auth/login`;

    return new Promise<LoginResponseModel>((resolve, reject) => {
      this.http.post(serverUrl, loginModel)
        .subscribe(res => {
          resolve(res.json() as LoginResponseModel);
        }, (err) => {
          // Online login failed. Attempt to login offline
          if (err == 'Network error:Unauthorized') {
            reject('Incorrect username / password');
            return;
          }

          if (this.configurationState.loginConfiguration.passwordHash != null) {
            reject('Failed to perform online login and offline credentials do not exist');
            return;
          }

          console.info('Offline user data exists - perform login offline');
          this.offlineLogin(username, password, databaseName);
        });
    });
  }

  public offlineLogin(username: string, password: string, databaseName: string): boolean {
    if (password == null) {
      password = '';
    }

    if (databaseName == '') {
      throw new Error('Database name cannot be empty');
    }

    password = password.toLowerCase();
    // we will pass the hashed password to the server
    const hashedPassword = md5(password);

    const user: UserModel = this.configurationState.offlineUsers.find(x => x.username.toLowerCase() == username.toLowerCase() && x.databaseName == databaseName);
    if (user == null) {
      throw new Error('User is not available offline');
    }

    if (user.hashedPassword == hashedPassword) { return true; }

    throw new Error('Invalid username / password');
  }

  public allowFeature(user: UserModel, featureId: number) {
    return user.menuItems.indexOf(featureId) >= 0;
  }

}

class LoginModel {
  constructor(public username: string, public password: string, public database: string, public includeMenuItems: boolean) {
  }
}

export class SecuredFeatures {
  public customers = 10000001;
  public invoicing = 10000002;
  public IBO = 10000003;
  public stock = 10000004;
  public priceMaster = 10000005;
  public reporting = 10000006;
  public deliveries = 10000007;
  public logistics = 10000008;
}