import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterBusinessPage } from '../register-business/register-business';
import { RegisterRentingPage } from '../register-renting/register-renting';
import { RegisterOwnerPage } from '../register-owner/register-owner';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
  back(){
  	this.navCtrl.pop();
  }
  owner(){
  	this.navCtrl.push(RegisterOwnerPage);
  }
  business(){
  	this.navCtrl.push(RegisterBusinessPage);
  }
  renting(){
  	this.navCtrl.push(RegisterRentingPage);
  }

}
