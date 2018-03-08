import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';

@IonicPage()
@Component({
	selector: 'page-messages-list',
	templateUrl: 'messages-list.html',
})
export class MessagesListPage {
	chats = [];
	constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public _zone: NgZone) {
		this.chats = this.globals.chats;
		console.log('Chats Available ', this.globals.chats);
	}

	ionViewWillLoad() {

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MessagesListPage');
	}

}
