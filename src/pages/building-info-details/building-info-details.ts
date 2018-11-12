import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-building-info-details',
  templateUrl: 'building-info-details.html',
})
export class BuildingInfoDetailsPage {
  details: any;
  pdfList:any =[];
  pdfUrl = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitize: DomSanitizer, public iab: InAppBrowser) {

    this.details = this.navParams.get('detail');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuildingInfoDetailsPage');
  }
  back(){
    this.navCtrl.pop(); 
  }
  openPdf(pdfUrl) {
    // window.open(pdfUrl, '_blank', 'EnableViewPortScale=yes');
    const browser = this.iab.create(pdfUrl, '', 'transitionstyle=crossdissolve,location=no,presentationstyle=pagesheet,enableViewportScale=yes,zoom=yes');
  }
}
