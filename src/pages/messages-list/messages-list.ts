import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';

import { MessagePage } from "../message/message";
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
		this.showLastMessage();
	}

	ionViewWillLoad() {

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MessagesListPage');
	}

	showLastMessage() {
		for (let i = 0; i < this.chats.length; i++) {
			var chat = this.chats[i];
			var messages = chat.messages;
			// console.log('Chat ', messages);
			for (let j = messages.length-1; j >= 0; j--) {
				var message = messages[j];
				// console.log(this.globals.userId, message.sentby);
				if (this.globals.userId != message.sentby) {
					if (message.message.indexOf('http') > -1) {
						// console.log('Last Message ', message);
						chat.lastMsg = 'Image Added';
					} else {
						chat.lastMsg = message.message;
					}
				break;					
				}				
			}			
		}
	}

	goToChatPage(chat) {
		this.navCtrl.push(MessagePage, { 'neighbour': chat.receiverData });
	}

}
