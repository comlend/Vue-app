import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the BuildingInfoDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-building-info-details',
  templateUrl: 'building-info-details.html',
})
export class BuildingInfoDetailsPage {
  details: any;
  pdfList:any =[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitize: DomSanitizer) {

    this.details = this.navParams.get('detail');
    this.pdfList = this.sanitize.bypassSecurityTrustResourceUrl(this.details.pdf[0].pdf);

    // for (let i = 0; i < this.details.pdf.length; i++) {
    //   let pdf = this.sanitize.bypassSecurityTrustResourceUrl(this.details.pdf[i].pdf)
    //   this.pdfList.push(pdf);
    // }
    console.log(this.pdfList)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuildingInfoDetailsPage');
  }
  back(){
    this.navCtrl.pop(); 
  }

}
