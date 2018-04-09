import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddBlockedUsersPage } from '../add-blocked-users/add-blocked-users';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';

@Component({
	selector: 'page-blocked-users-list',
	templateUrl: 'blocked-users-list.html',
})
export class BlockedUsersListPage {
	blockedNeighbours: any = [];

	constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, public _zone: NgZone, public globals: GlobalsProvider) {
		this.initializeStartData();
	}
	ionViewWillEnter(){
		this.initializeStartData();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BlockedUsersListPage');
	}
	back(){
		this.navCtrl.pop();
	}

	initializeStartData() {
		this.blockedNeighbours = this.globals.blockedByMe;		
		// this.getBlockedNeighbours();
	}

	/* getBlockedNeighbours() {
		this.firebase.getBlockedNeighbours().then((blockedArr) => {
			console.log('Blocked Neighbours => ', blockedArr);

			this._zone.run(() => {
				this.blockedNeighbours = blockedArr;

			});
		}).catch((err) => {
			console.log('Blocked Users List Err => ', err);
		})
	} */

	addBlockedUser() {
		this.navCtrl.push(AddBlockedUsersPage);
	}

	unblockNeighbour(neighbour) {
		this.firebase.unblockneighbour(neighbour).then((data) => {

		}).catch((err) => {

		});
	}

}
