import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, Events } from 'ionic-angular';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { TabsPage } from '../tabs/tabs';
// import { Storage } from '@ionic/storage';

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
  firstName: any;
  lastName: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public event: Events) {
  	this.fbData = this.navParams.get('fbdata');
    console.log("fbdata",this.fbData.uid);
    // this.userProfile = this.fbData.photoURL;
    var fullname = this.fbData.displayName;
    if (!(fullname.indexOf(' ') >= 0)) {
      this.firstName = fullname.substr(fullname.indexOf(' ') + 1);
      this.lastName = " ";
    } else {
      this.firstName = fullname.substr(0, fullname.indexOf(' '));
      this.lastName = fullname.substr(fullname.indexOf(' ') + 1);
    }
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
          firstName: this.firstName,
          lastName: this.lastName,
          displayName: this.fbData.displayName,
          createdAt: createdAt,
          profileurl: this.fbData.photoURL,
          uId: this.fbData.uid,
          userType: this.userType,
          unit: this.unit
          
          }, () => {
            console.log('Success');
            this.loading.dismiss().then(() => { 

              console.log('Dismiss Work');
              // this.storage.set('FbLoginComplete', true);
              // this.event.publish('fbloggedin',true);
            this.navCtrl.setRoot(TabsPage);
            });
           
          });

    this.loading = this.loadingCtrl.create({content: 'Updating Profile'});
      this.loading.present();
  	
  }

}
