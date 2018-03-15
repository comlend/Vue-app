import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events, ActionSheetController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
	userId: string;
	userProfile: any;
	imageData: any;
	// imgornot: any = '';

	constructor(public navCtrl: NavController, public firebase: FirebaseProvider, public navParams: NavParams, public zone: NgZone, public events: Events, public globals: GlobalsProvider, public actionSheetCtrl: ActionSheetController, private camera: Camera) {
		this.userId = this.globals.userId;
		this.userProfile = this.globals.userData.profileurl;

		this.neighbourData = this.navParams.get('neighbour');
		console.log(this.neighbourData);
		// this.scrollto();
		
		this.firebase.getnewMsg(this.neighbourData.uId).then((message) => {
			// console.log('Why i am not running');
			// this.imgornot = [];
			this.zone.run(() => {
				// console.log('Remember me ')
				// console.log(message);
				this.chats = message;
				this.scrollto();
			});							
		});		
		
		this.listenForEvents();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MessagePage');
	
		this.firebase.getneighbourmessages(this.neighbourData.uId).then((data) => {
			this.zone.run(() => {
				console.log('counter Message Arr', data);
			});

			
			// this.chats = this.firebase.neighbourmessages;					
			this.chats = data;
			this.checkForUnreadMsgs();
		}).catch((err) => {
			console.log('Error ', err);
		});		
	}

	back(){
		this.navCtrl.pop();
	}

	addnewmessage(chat, type) {
		console.log('Chat Before ', chat, this.neighbourData.uId);
		this.firebase.addnewmessage(chat, this.neighbourData.uId, type).then(success => {
			// this.chats = userData;
			this.chat = '';
			console.warn(success);
		}, error => {
			console.error(error);
		});
	}

	sendChatNotification(msg) {
		var neighbourDeviceToken = this.neighbourData.deviceToken;
		console.log('Chat and Neighbour Device Token ', msg, neighbourDeviceToken);
		this.firebase.sendChatMsgNoti(neighbourDeviceToken, msg).then(() => {
			console.log('Notification Sent.');
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
		if (this.content) {
			setTimeout(() => {
				this.content.scrollToBottom();
			}, 500);	
		}
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

		this.events.subscribe('chatstatus:updated', () => {
			this.firebase.getneighbourmessages(this.neighbourData.uId).then((data) => {
				this.zone.run(() => {
					console.log('counter Message Arr', data);
				});


				// this.chats = this.firebase.neighbourmessages;					
				this.chats = data;
				this.checkForUnreadMsgs();
			}).catch((err) => {
				console.log('Error ', err);
			});	
		});

		this.updateMsgFirebaseCallbackEvent();
	}

	uploadPic(){
		let actionSheet = this.actionSheetCtrl.create({
			buttons: [
				{
					text: 'Take Photo',
					handler: () => {
						this.selectImage(0);
					}
				},
				{
					text: 'Choose from Library',
					handler: () => {
						this.selectImage(1);
					}
				},
				{
					text: 'Cancel',
					role: 'cancel'
				}
			]
		});
		actionSheet.present();
	}
	selectImage(type) {
		let options: CameraOptions = {
			quality: 90,
			targetWidth: 300,
			targetHeight: 300,
			allowEdit: true,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			sourceType: (type == 0) ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY
		};

		this.camera.getPicture(options).then((imageData) => {
			this.imageData = imageData;
			this.firebase.uploadProfile(imageData).then((data) => {
				// this.profileurl = data;
				// this.chat = data;
				var type = 'image';
				this.addnewmessage(data,type);
				console.log(data);

			})
				.catch((err) => {
					console.log(err);
				});
		});
	}

	checkForUnreadMsgs() {
		var allChats = this.chats;

		for (let i = 0; i < allChats.length; i++) {
			let chat = allChats[i];

			if (this.userId != chat.sentby) {		
				// Update Chat status once, receiver open this page
				this.updateMsgStatus(chat);

				// console.log('Chat After ', chat);
			}			
		}
	}

	updateMsgStatus(chat) {
		var userId = this.userId;
		var neighbourId = this.neighbourData.uId;
		/* chat.status = 'Read'; */

		// Call Firebase and update db aswell
		this.firebase.updateChatMsgStatus(userId, neighbourId, chat);
	}

	updateMsgFirebaseCallbackEvent() {
		var userId = this.userId;
		var neighbourId = this.neighbourData.uId;
		this.firebase.chatMsgStatusUpdate(userId, neighbourId);
	}
}
