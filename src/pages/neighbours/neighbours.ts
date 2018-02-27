import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider) {
    this.getAllNeighbours()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NeighboursPage');
  }
  getAllNeighbours(){
    this.firebase.getNeighbours().then((data) => {
      console.log(data);
    }, error => {
      console.error(error);
    });
  }

}
