import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';

import { MessagePage } from "../message/message";

import * as firebase from 'firebase';
import * as _ from 'lodash';

@IonicPage()
@Component({
	selector: 'page-messages-list',
	templateUrl: 'messages-list.html',
})
export class MessagesListPage {
	chats = [];
	lastMsg: any;
	constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public _zone: NgZone, public events: Events) {
		// this.chats = this.globals.chats;
		
	}

	ionViewWillEnter() {		
		this.getAllChats().then(() => {				
			this.chats = this.globals.chats;
			this.showLastMessage();

			this.unreadMessages();
		});
		// console.log('Chats Available Message ', this.chats);
		// console.log('last message', this.lastMsg);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MessagesListPage');
	}

	showLastMessage() {
		for (let i = 0; i < this.chats.length; i++) {
			var chat = this.chats[i];
			var messages = chat.messages;
			// console.log('Chat ', chat, ' Messages ', messages);
			for (let j = messages.length-1; j >= 0; j--) {
				var message = messages[j];
				// console.log(this.globals.userId, message.sentby);
				if (this.globals.userId != message.sentby) {
					if (message.message.indexOf('http') > -1) {
						// console.log('Last Message ', message);
						chat.lastMsg = 'Image Added';
					} else {
						chat.lastMsg = message.message;
						// this.lastMsg = chat.lastMsg;
					}

				// console.log(chat.lastMsg);
				break;					
				}				
			}			
		}
	}

	getAllChats() {
		return new Promise((resolve, reject) => {
			var userId = this.globals.userId;
			// console.log('User ID ', userId);
			var dbRef = firebase.database().ref('chats').child(userId);
			var chatArr = [];
			dbRef.once('value', (chats) => {
				var chatObj = chats.val();
				for (let chat in chatObj) {
					var chatObjTemp = {};

					chatObjTemp['receiver'] = chat;
					chatObjTemp['messages'] = [];
					if (chatObj.hasOwnProperty(chat)) {
						let chatElement = chatObj[chat];
						// console.log('Chat Eele ', chat, _.toArray(chatElement));

						chatObjTemp['messages'] = _.toArray(chatElement);
					}

					chatArr.push(chatObjTemp);
				}

				this.globals.chats = chatArr;
				console.log('Chat Arr ', chatArr);
				
				this.extractNeighbourData();
				resolve();
			});
		});
	}

	extractNeighbourData() {
		this.globals.neighboursData
		this.globals.chats

		for (let i = 0; i < this.globals.chats.length; i++) {
			let chat = this.globals.chats[i];
			let receiver = chat.receiver;

			for (let j = 0; j < this.globals.neighboursData.length; j++) {
				let eachNeighbour = this.globals.neighboursData[j];
				let neighbourId = eachNeighbour.uId;
				if (receiver == neighbourId) {
					chat.receiverData = eachNeighbour;

					break;
				}
			}

			// console.log('All Chats Modified ', this.global.chats);
		}
	}

	goToChatPage(chat) {
		this.navCtrl.push(MessagePage, { 'neighbour': chat.receiverData, 'unreadCompensation': chat.unreadMessages });
	}

	unreadMessages() {
		var userId = this.globals.userId;
		var totalUnreadMessages = 0;
		for (let i = 0; i < this.chats.length; i++) {
			var chat = this.chats[i];
			chat.unreadMessages = 0;
			var messages = chat.messages;
			// console.log('Chat ', chat, ' Messages ', messages);
			for (let j = messages.length - 1; j >= 0; j--) {
				var message = messages[j];
				// console.log(j + ' ' + message.message + ' ' + message.status);

				if (userId != message.sentby && message.status == 'Delivered') {
					chat.unreadMessages++;
				}
			}
			// console.log('Each Chat Unread Message ', chat.unreadMessages);
			totalUnreadMessages += chat.unreadMessages;
		}
		// console.log('Total Unread Messages ', totalUnreadMessages);

		if (totalUnreadMessages > 0) {
			this.globals.unreadMessages = totalUnreadMessages;
			
			this.events.publish('unread:messages');
		}	
	}

}
