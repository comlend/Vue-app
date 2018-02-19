import { Component } from '@angular/core';
import { NavController,  ViewController } from 'ionic-angular';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController) {

  }

  ionViewDidEnter() {
 
 
  }

}
