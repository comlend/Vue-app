import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { MessagePage } from '../message/message'; 
import { BusinessDetailsPage } from '../business-details/business-details';

/**
 * Generated class for the NeighboursPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-neighbours',
  templateUrl: 'neighbours.html',
})
export class NeighboursPage {
  users: any;
  userId: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, public globals: GlobalsProvider, private app: App) {
    this.userId = this.globals.userId;
    this.getAllNeighbours()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NeighboursPage');
  }
  getAllNeighbours(){
    this.firebase.getNeighbours().then((userData) => {
      this.users = userData;
      console.warn(this.users);
    }, error => {
      console.error(error);
    });
  }

  goToNeighbour(neighbour){
    this.app.getRootNav().push(MessagePage, { 'neighbour': neighbour });
    // this.navCtrl.push();
  }
  goToBusiness(business){
    this.app.getRootNav().push(BusinessDetailsPage, { 'business': business });
  }

}
