import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';

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
  allComments: any;
  noComments: boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App,public firebase:FirebaseProvider, public globals: GlobalsProvider) {
    this.newsDetails = this.navParams.get('news');
    console.log(this.newsDetails);
    this.getAllComments();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsDetailsPage');
  }
  back(){
    this.app.getRootNav().pop();
  }
  addComment(){
    this.firebase.addCommentToNews(this.newsDetails, this.globals.userData, this.comment).then((data) => {
      console.log('comment added');
      this.getAllComments();
      this.comment = ''; 
      this.noComments = false;
      // this.navCtrl.pop();
    });
  }

  addLike(){
    this.firebase.addLikeToNews(this.globals.userData,this.newsDetails).then((data) => {
      console.log('like added');
      // this.navCtrl.pop();
    });
  }

  getAllComments(){
    this.firebase.getAllComments(this.newsDetails.id).then((data) => {
      this.allComments = data;
     
    },(error) =>{
      console.log(error);
      this.noComments = true;
    });
  }

}
