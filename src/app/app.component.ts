import { Component } from '@angular/core';
import { Platform, ModalController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SplashPage } from '../pages/splash/splash';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import * as firebase from 'firebase';
import { GlobalsProvider } from '../providers/globals/globals';
import { Storage } from '@ionic/storage';

import * as _ from 'lodash';
import { FCM } from '@ionic-native/fcm';
@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	rootPage: any = '';
	fbLoginComplete: boolean = true;

	constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, modalCtrl: ModalController, private global: GlobalsProvider, storage: Storage, public event: Events, private fcm: FCM) {
		this.initializeFirebase();
		this.fbLoginComplete = this.global.FbLoginComplete;

		// storage.get('FbLoginComplete').then((val) => {
		// 	console.log('fblogin is complete?', val);
		// 	if (val) {
		// 		console.log('fblogin is complete?',val);
		// 		this.fbLoginComplete = val;
		// 	}
			
		// });
		platform.ready().then(() => {
			// Initialize Push Notification
			this.initializeFcmNotification();
			
			// this.initializeApp();
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			// splashScreen.hide();
			// navCtrl.setRoot(HomePage);
			let splash = modalCtrl.create(SplashPage);
			splash.present();
		});
	}

	initializeFirebase() {
		var config = {
			apiKey: "AIzaSyCBSL955KUTWPvkJYNE-WzzFrN0UjidXMk",
			authDomain: "aptapp-3b622.firebaseapp.com",
			databaseURL: "https://aptapp-3b622.firebaseio.com",
			projectId: "aptapp-3b622",
			storageBucket: "aptapp-3b622.appspot.com",
			messagingSenderId: "587368411111"
		};
		firebase.initializeApp(config);
		const unsubscribe = firebase.auth().onAuthStateChanged(user => {
			if (!user) {
				this.rootPage = SignupPage;
				// unsubscribe();
			} 
			
			else {

				this.global.userId = user.uid;
				var promises = [this.getUserData(), this.getNeighbours(), this.getAllChats()];
				Promise.all(promises).then((values) => {
					this.extractNeighbourData();
					
					// this.getUserData();
					//    
					console.log('Promise.all resolved');
					if (this.global.FbLoginComplete) {
						this.rootPage = TabsPage;
						// return;
						unsubscribe();
					}
					else if (!this.global.FbLoginComplete) { 
						
						return;
					}
					
				}).catch((err) => {
					console.log('Promise.all ', err);
				});
				
			
			
				
				// this.global.userId = user.uid;
				// promises = [this.getUserData(), this.getNeighbours(), this.getAllChats()];
				// Promise.all(promises).then((values) => {
				// 	this.extractNeighbourData();
				// 	this.getUserData();
				// 	this.rootPage = TabsPage;
				// 	console.log('Promise.all resolved');
				// }).catch((err) => {
				// 	console.log('Promise.all ', err);
				// });
				
		}
	
		});
	}

	initializeFcmNotification() {
		this.fcm.onNotification().subscribe(data => {
			alert('Received Notification Successfully!');
			if (data.wasTapped) {
				console.log("Received in background");
			} else {
				console.log("Received in foreground");
			};
		});

		this.fcm.onTokenRefresh().subscribe((token) => {
			var userId = this.global.userId;			
			var dbRef = firebase.database().ref('/users').child(userId);

			dbRef.update({
				deviceToken: token
			}).then(() => {
				console.log('Device Token Updated Successfully');
			}).catch(() => {
				console.log('Device Token Update Error');				
			});
		});
	}

	getUserData(){
		var userId = this.global.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users/' + userId);
			var userArr = [];
			dbRef.once('value', (data) => {

				if (data.val() != 'default') {
					userArr = data.val();
					this.global.userData = userArr;
					// console.warn(this.global.userData);
					resolve(userArr);
				} else {
					reject({ msg: 'No Users Found' });
				}
			});
		});
	}
	getNeighbours(){
		var userId = this.global.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users/');
			var neighboursArr = [];
			dbRef.once('value', (data) => {

				if (data.val() != 'default') {
					neighboursArr = _.toArray(data.val());
					_.remove(neighboursArr, { 'uId': userId });
					
					// console.log('neighboursArray ', neighboursArr);
					this.global.neighboursData = neighboursArr;
					resolve();
					
				} else {
					reject({ msg: 'No Users Found' });
				}
			});
		});
	}
	getAllChats() {
		return new Promise((resolve, reject) => {
			var userId = this.global.userId;
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

				this.global.chats = chatArr;
				resolve();
				// console.log('Chat Arr ', chatArr);
			});
		});
	}
	
	extractNeighbourData() {
		this.global.neighboursData
		this.global.chats

		for (let i = 0; i < this.global.chats.length; i++) {
			let chat = this.global.chats[i];
			let receiver = chat.receiver;
			
			for (let j = 0; j < this.global.neighboursData.length; j++) {
				let eachNeighbour = this.global.neighboursData[j];
				let neighbourId = eachNeighbour.uId;
				if (receiver == neighbourId) {
					chat.receiverData = eachNeighbour; 

					break;
				}				
			}

			// console.log('All Chats Modified ', this.global.chats);
		}
	}
}
