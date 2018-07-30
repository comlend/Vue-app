import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BuildingInfoDetailsPage } from '../building-info-details/building-info-details';
import { ContactListPage } from '../contact-list/contact-list';
import { FirebaseProvider } from '../../providers/firebase/firebase';

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
  buildingInfos: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider) {

    this.firebase.getBuildingInfo().then((data)=>{
      this.buildingInfos = data;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuildingInfoPage');
  }
  back(){
    this.navCtrl.pop();
  }
  details(info){
    this.navCtrl.push(BuildingInfoDetailsPage, {detail: info});
  }

}
