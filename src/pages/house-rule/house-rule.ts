import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { HouseRuleDetailsPage } from '../house-rule-details/house-rule-details';

/**
 * Generated class for the HouseRulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-house-rule',
  templateUrl: 'house-rule.html',
})
export class HouseRulePage {

  houseRules: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider) {
    this.firebase.getHouseRules().then((data) => {
      this.houseRules = data;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HouseRulePage');
  }
  back() {
    this.navCtrl.pop();
  }
  details(info) {
    this.navCtrl.push(HouseRuleDetailsPage, { detail: info });
  }

}
