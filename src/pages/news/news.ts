import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { AddNewsPage } from '../add-news/add-news';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { NewsDetailsPage } from '../news-details/news-details';
import { MessagePage } from '../message/message';

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
  news: any;
  searchQuery: string = '';
  userId: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public firebase: FirebaseProvider, public global: GlobalsProvider, public events: Events, public zone: NgZone) {
    this.userId = this.global.userId;
    
    this.news = this.global.news;

    this.events.subscribe('newsupdated', () => {

      this.zone.run(() => {
        this.news = this.global.news;
      });

    });
    
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }

  ionViewWillEnter(){
  }
  
  addNews(){
    this.app.getRootNav().push(AddNewsPage);
  }

  newsDetails(newsData){
    this.app.getRootNav().push(NewsDetailsPage, {'news': newsData});
  }

  goToMessage(newsData){
    this.app.getRootNav().push(MessagePage, { 'neighbour': newsData });
  }


}
