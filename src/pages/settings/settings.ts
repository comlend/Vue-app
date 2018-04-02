import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { SignupPage } from '../signup/signup';
import { GlobalsProvider } from '../../providers/globals/globals';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { TncPage } from '../tnc/tnc';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  profileurl: any;
  userData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseProvider: FirebaseProvider, public app: App, public globals:GlobalsProvider) {
    this.userData = this.globals.userData;
    this.profileurl = this.globals.userData.profileurl;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  back(){
    this.navCtrl.pop();
  }
  logOut(){
    return new Promise((resolve, reject) => {
            this.firebaseProvider.logOut().then(() => {
              this.app.getRootNav().setRoot(SignupPage);
                // resolve();
              });
    });
  }

  editProfile(){
    this.navCtrl.push(EditProfilePage);
  }
  TncPage(){
    this.navCtrl.push(TncPage);
  }
}
