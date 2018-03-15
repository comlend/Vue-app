import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { Facebook } from '@ionic-native/facebook';
import * as firebase from 'firebase';
import { FbprofilePage } from '../fbprofile/fbprofile';
import { TabsPage } from '../tabs/tabs';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FCM } from '@ionic-native/fcm';
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  userProfile: any = null;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private facebook: Facebook, public loadingCtrl: LoadingController, public events: Events, public globals: GlobalsProvider, private fcm: FCM) {
   
  }

  ionViewWillEnter() {
    this.getDeviceFcmToken();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  register() {
    this.navCtrl.push(RegisterPage);
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
  facebookLogin() {

    this.facebook.login(['email']).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          // console.log("Firebase success: " + JSON.stringify(success));
          this.userProfile = success;
          console.log('User Profile ', this.userProfile);
          this.loading.dismiss().then(() => {
            // this.navCtrl.push(FbprofilePage, { 'fbdata': this.userProfile });

            firebase.database().ref('/users/').once('value', (data) => {

              console.log('User Exists ', data.child(this.userProfile.uid).exists());
              if (data.child(this.userProfile.uid).exists() == true) {
                this.navCtrl.setRoot(TabsPage);
                // this.events.publish('fbloggedin',true);
                // this.storage.set('FbLoginComplete', true);
              }
              else if (data.child(this.userProfile.uid).exists() == false) {
                // this.events.publish('fbloggedin', false);

                this.navCtrl.push(FbprofilePage, { 'fbdata': this.userProfile });
                this.globals.FbLoginComplete = false;
               
              }


            });

          });

        })
        .catch((error) => {
          this.loading.dismiss().then(() => {
            console.log("Firebase failure: " + JSON.stringify(error));
          });

        });

    }).catch((error) => { console.log(error) });
    this.loading = this.loadingCtrl.create({ content: 'Signing you in..' });
    this.loading.present();
  }

  getDeviceFcmToken() {
    if (this.globals.cordovaPlatform) {
      // Get Device Token
      this.fcm.getToken().then(token => {
        console.log('Device Token ', token);
        this.globals.fcmToken = token;
      });
    }
  }
}
