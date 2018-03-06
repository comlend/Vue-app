import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
	selector: 'page-message',
	templateUrl: 'message.html',
})
export class MessagePage {
	@ViewChild('content') content: Content;
	neighbourData: any;
	chat: any = '';
	chats: any;

	constructor(public navCtrl: NavController, public firebase: FirebaseProvider, public navParams: NavParams, public zone: NgZone, public events: Events) {

		this.neighbourData = this.navParams.get('neighbour');
		this.scrollto();
		
		this.firebase.getnewMsg(this.neighbourData.uId).then((messages) => {
			this.zone.run(() => {
				this.chats = messages;	
			});
			this.scrollto();							
		});		
		
		this.listenForEvents();

		// this.events.subscribe('newmessage', () => {
		//   this.zone.run(() => {
		//     this.firebase.getneighbourmessages(this.neighbourData.uId).then(success => {
		//       this.chats = success;
		//       console.warn(success);
		//     }, error => {
		//       console.error(error);
		//     });;
		//     console.log(this.chats);
		//     // 
		//   });

		// });


	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MessagePage');
	
		this.firebase.getneighbourmessages(this.neighbourData.uId).then((data) => {
			this.zone.run(() => {
				console.log('counter Message Arr', data);
			});

			
			// this.chats = this.firebase.neighbourmessages;					
			this.chats = data;
		}).catch((err) => {
			console.log('Error ', err);
		});		
	}

	addnewmessage() {
		console.log(this.chat, this.neighbourData.uId);
		this.firebase.addnewmessage(this.chat, this.neighbourData.uId).then(success => {
			// this.chats = userData;
			console.warn(success);
		}, error => {
			console.error(error);
		});
	}

	// getAllMessages() {
	//  this.firebase.getneighbourmessages(this.neighbourData.uId).then(success => {
	//     // console.log(success);
	//     console.warn(success);
	//   }, error => {
	//     console.error(error);
	//   });;
	//       console.log(this.chats);

	// }

	scrollto() {
		setTimeout(() => {
			this.content.scrollToBottom();
		}, 1000);
	}

	listenForEvents() {
		this.events.subscribe('newmessage', () => {
			this.chats = [];
			
			this.firebase.getneighbourmessages(this.neighbourData.uId).then((data) => {
				this.zone.run(() => {
					console.log('counter Message Arr', data);
					this.chats = data;		
					
				});				
				this.scrollto();
				
				// this.chats = this.firebase.neighbourmessages;					
			}).catch((err) => {
				console.log('Error ', err);
			});
		});
	}
}
