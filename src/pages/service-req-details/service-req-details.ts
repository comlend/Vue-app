import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

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
  allNotes: any;
  reqhasNotes: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, public events: Events, public zone: NgZone) {
    this.serviceReqDetails = this.navParams.get('serviceRequest');
    // newNoteAdded
    this.getAllNotes();

    this.events.subscribe('newNoteAdded', () => {
      this.zone.run(() => {
        this.getAllNotes();
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceReqDetailsPage');
  }
  back() {
    this.navCtrl.pop();
  }
  getAllNotes() {
    this.firebase.getAllServiceReqNotes(this.serviceReqDetails.id).then((data) => {
      if (data) {
        this.allNotes = data;
      }
     
      // console.log('all notes',this.allNotes);
    }).catch((err) => {
      console.log(err);
    });
  }

}
