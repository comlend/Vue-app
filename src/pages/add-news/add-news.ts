import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the AddNewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-news',
  templateUrl: 'add-news.html',
})
export class AddNewsPage {
  userData: any;
  news: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public firebase: FirebaseProvider, public app: App ) {
    this.userData = this.globals.userData;
    console.log(this.userData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewsPage');
  }
  back(){
    this.app.getRootNav().pop();
  }
  addNews(){
    this.firebase.addNews(this.userData,this.news).then((data) => {
      console.log('news added');
      this.navCtrl.pop();
    });
  }

}
