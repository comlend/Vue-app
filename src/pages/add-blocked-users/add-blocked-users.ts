import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';


@IonicPage()
@Component({
	selector: 'page-add-blocked-users',
	templateUrl: 'add-blocked-users.html',
})
export class AddBlockedUsersPage {
	blockedUsers: any;
	neighbours: any = [];
	query: string = '';
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public firebase: FirebaseProvider) {
		this.initializeStartData();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddBlockedUsersPage');
	}

	initializeStartData() {
		this.neighbours = this.globals.neighboursData;
	}

	back() {
		this.navCtrl.pop();
	}

	onInputSearch(event) {
		console.log('Query String ', this.query);
	}
	onCancelSearch(event) {
		this.query = '';
	}

	blockNeighbour(neighbourToBlock) {
		this.firebase.blockNeighbour(neighbourToBlock).then(() => {
			console.log('Blocked');
		}).catch((err) => {
			console.log('Neighbour Block Error => ', err);
		})
	}

}
