import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PdfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pdf',
  templateUrl: 'pdf.html',
})
export class PdfPage {
  pdf: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pdf = this.navParams.get('pdf');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PdfPage');
  }

}
