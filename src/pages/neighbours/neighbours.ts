import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, public globals: GlobalsProvider) {
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

}
