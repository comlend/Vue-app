import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddBlockedUsersPage } from '../add-blocked-users/add-blocked-users';

@IonicPage()
@Component({
	selector: 'page-blocked-users-list',
	templateUrl: 'blocked-users-list.html',
})
export class BlockedUsersListPage {

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BlockedUsersListPage');
	}

	addBlockedUser() {
		this.navCtrl.push(AddBlockedUsersPage);
	}

}
