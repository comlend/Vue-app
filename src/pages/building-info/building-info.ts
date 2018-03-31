import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BuildingInfoDetailsPage } from '../building-info-details/building-info-details';

/**
 * Generated class for the BuildingInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-building-info',
  templateUrl: 'building-info.html',
})
export class BuildingInfoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuildingInfoPage');
  }
  back(){
    this.navCtrl.pop();
  }
  dishwasher(){
    this.navCtrl.push(BuildingInfoDetailsPage);
  }

}
