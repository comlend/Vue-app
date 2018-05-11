import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { NewServiceRequestPage } from '../new-service-request/new-service-request';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ServiceReqDetailsPage } from '../service-req-details/service-req-details';
import { GlobalsProvider } from '../../providers/globals/globals';

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
  loading: any; 
  userType: any;
  noServReq: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public firebase: FirebaseProvider, public events: Events, public zone: NgZone, public loadingCtrl: LoadingController, public globals: GlobalsProvider) {
    // this.getAllReq();
    this.loading = this.loadingCtrl.create({ content: 'Loading all service requests..' });
    this.userType = this.globals.userData.userType;
    console.log('this user is - ',this.userType)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceCenterPage');
  }
  ionViewWillEnter(){
    
    if (this.userType != 'admin') {
      this.getAllReq();
    }
    else if (this.userType == 'admin') {
      this.getAllServiceReq();
    }
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
      // console.log(this.allRequests);
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

  getAllServiceReq() {
    this.loading.present();
    this.firebase.loadAllAdminSupportReqs().then((data) => {
      this.allRequests = data;
      console.log('all service reqs',this.allRequests);
      this.loading.dismiss();
      this.filterReq();
    }, (error) => {
      this.noServReq = true;
      this.loading.dismiss();
    });
  }
  filterReq() {
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
    console.log(this.inProgressReqs);
  }
  // fullCompletedReqArrayAdmin() {
  //   this.completedArrayLength = this.completedReqs.length;
  //   this.allCompletedReqsShown = true;
  // }
  // fullInProgressReqArrayAdmin() {
  //   this.inProgArrayLength = this.inProgressReqs.length;
  //   this.allInProgressReqsShown = true;
  // }

}
