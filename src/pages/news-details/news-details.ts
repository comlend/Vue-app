import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

/**
 * Generated class for the NewsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news-details',
  templateUrl: 'news-details.html',
})
export class NewsDetailsPage {
  @ViewChild('NewsComment') myInput: ElementRef;
  newsDetails: any;
  messageRow: number = 1;
  comment: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {
    this.newsDetails = this.navParams.get('news');
    console.log(this.newsDetails);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsDetailsPage');
  }
  back(){
    this.app.getRootNav().pop();
  }
  addComment(){

  }

}
