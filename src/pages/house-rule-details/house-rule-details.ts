import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the HouseRuleDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-house-rule-details',
  templateUrl: 'house-rule-details.html',
})
export class HouseRuleDetailsPage {
  details: any;
  pdfList: any = [];
  pdfUrl = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitize: DomSanitizer, public iab: InAppBrowser) {
    this.details = this.navParams.get('detail');
    console.log(this.pdfList)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HouseRuleDetailsPage');
  }
  back() {
    this.navCtrl.pop();
  }
  openPdf(pdfUrl) {
    // window.open(pdfUrl, '_blank', 'EnableViewPortScale=yes');
    const browser = this.iab.create(pdfUrl, '', 'transitionstyle=crossdissolve,location=no,presentationstyle=pagesheet,enableViewportScale=yes,zoom=yes');
  }

}
