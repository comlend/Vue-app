import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { Facebook } from '@ionic-native/facebook';
import * as firebase from 'firebase';
import { FbprofilePage } from '../fbprofile/fbprofile';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
   userProfile: any = null;
   loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private facebook: Facebook, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  register()
  {
  	this.navCtrl.push(RegisterPage);
  }

  login(){
  	this.navCtrl.push(LoginPage);
  }
  facebookLogin(){
    this.facebook.login(['email']).then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
            console.log("Firebase success: " + JSON.stringify(success));
            this.userProfile = success;
            console.log(this.userProfile);
            this.loading.dismiss().then(() => {          
            this.navCtrl.push(FbprofilePage, {'fbdata':this.userProfile});
            });
           
            
        })
        .catch((error) => {
          this.loading.dismiss().then(() => {          
            console.log("Firebase failure: " + JSON.stringify(error));
            });
            
        });

    }).catch((error) => { console.log(error) });
    this.loading = this.loadingCtrl.create({content: 'Signing you in..'});
      this.loading.present();
  }

}
