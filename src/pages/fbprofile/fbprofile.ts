import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the FbprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fbprofile',
  templateUrl: 'fbprofile.html',
})
export class FbprofilePage {
	fbData: any;
	unit: string;
	userType: any;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
  	this.fbData = this.navParams.get('fbdata');
    console.log("fbdata",this.fbData.uid);
  	// this.userProfile = this.fbData.photoURL;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FbprofilePage');
  }

  back(){
    this.navCtrl.pop();
  }

  signupUser() {
    var createdAt = moment().format();

    firebase.database().ref('/users').child(this.fbData.uid).set({
          email: this.fbData.email,
          firstName: this.fbData.displayName,
          // lastName: lastName,
          createdAt: createdAt,
          profileurl: this.fbData.photoURL,
          uId: this.fbData.uid,
          userType: this.userType,
          unit: this.unit
          
          }, () => {
            console.log('Success');
            this.loading.dismiss().then(() => {          
            this.navCtrl.setRoot(TabsPage);
            });
           
          });

    this.loading = this.loadingCtrl.create({content: 'Updating Profile'});
      this.loading.present();
  	
  }

}
