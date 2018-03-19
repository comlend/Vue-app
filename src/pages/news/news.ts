import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseProvider: FirebaseProvider, public app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }
  logout(){
    return new Promise((resolve, reject) => {
      this.firebaseProvider.logOut().then(() => {
        this.app.getRootNav().setRoot(SignupPage);
        resolve();
      });
    });
    
  }

}
