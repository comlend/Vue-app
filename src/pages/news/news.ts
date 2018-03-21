import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AddNewsPage } from '../add-news/add-news';
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
  news: any;
  searchQuery: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public firebase: FirebaseProvider) {
    // this.getNews();
    this.firebase.getAllNews().then((data) => {
      console.log('news data', data);
      this.news = data;
      // this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }

  ionViewWillEnter(){
    this.getNews();
  }
  
  addNews(){
    this.app.getRootNav().push(AddNewsPage);
  }

  getNews(){
    this.firebase.getAllNews().then((data) => {
      console.log('news data',data);
      this.news = data;
      // this.navCtrl.pop();
    });
  }


}
