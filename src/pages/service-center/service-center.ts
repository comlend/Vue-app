import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { NewServiceRequestPage } from '../new-service-request/new-service-request';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ServiceReqDetailsPage } from '../service-req-details/service-req-details';

/**
 * Generated class for the ServiceCenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-service-center',
  templateUrl: 'service-center.html',
})
export class ServiceCenterPage {
  allRequests: any;
  inProgressReqs: any = [];
  completedReqs: any = [];
  inProgArrayLength: any =3;
  completedArrayLength: any =3;
  allInProgressReqsShown: boolean = false;
  allCompletedReqsShown: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public firebase: FirebaseProvider, public events: Events, public zone: NgZone) {
    // this.getAllReq();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceCenterPage');
  }
  ionViewWillEnter(){
    this.getAllReq();
  }
  back(){
    this.navCtrl.pop();
  }
  newRequest(){
    this.navCtrl.push(NewServiceRequestPage);
  } 
  serviceReqDetail(serviceRequest){
    this.navCtrl.push(ServiceReqDetailsPage, {'serviceRequest':serviceRequest});
  }
  getAllReq() {
    this.firebase.getAllSupportReq().then((data) => {
      this.allRequests = data;
      this.inProgressReqs = [];
      this.completedReqs = [];
      for (let i = 0; i < this.allRequests.length; i++) {
        if (this.allRequests[i].status == "inProgress") {
          this.inProgressReqs.push(this.allRequests[i]);
        }
        else if (this.allRequests[i].status == "completed") {
          this.completedReqs.push(this.allRequests[i]);
        }
        
      }
      console.log(this.allRequests);
    });
  }

  fullCompletedReqArray(){
    this.completedArrayLength = this.completedReqs.length;
    this.allCompletedReqsShown = true;
  }
  fullInProgressReqArray() {
    this.inProgArrayLength = this.inProgressReqs.length;
    this.allInProgressReqsShown = true;
  }

}
