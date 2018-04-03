import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ServiceReqDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-service-req-details',
  templateUrl: 'service-req-details.html',
})
export class ServiceReqDetailsPage {
  serviceReqDetails: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.serviceReqDetails = this.navParams.get('serviceRequest');
    console.log(this.serviceReqDetails)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceReqDetailsPage');
  }
  back() {
    this.navCtrl.pop();
  }

}
