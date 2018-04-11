import { Component, NgZone } from '@angular/core';
import { Platform, ModalController, Events, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import * as firebase from 'firebase';
import { GlobalsProvider } from '../providers/globals/globals';
import { Storage } from '@ionic/storage';

import * as _ from 'lodash';
import { FCM } from '@ionic-native/fcm';
import { UtilitiesProvider } from '../providers/utilities/utilities';
@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	rootPage: any = '';
	fbLoginComplete: boolean = true;

	constructor(platform: Platform, statusBar: StatusBar, public splashScreen: SplashScreen, modalCtrl: ModalController, private global: GlobalsProvider, storage: Storage, public event: Events, private fcm: FCM, public _zone: NgZone, public utilities: UtilitiesProvider, public loadingCtrl: LoadingController) {
		this.initializeFirebase();
		this.fbLoginComplete = this.global.FbLoginComplete;

		platform.ready().then(() => {
			if (platform.is('mobileweb')) {
				this.global.cordovaPlatform = true;
				this.initializePwaNotification();
			}
			// this.initializeApp();

			if (platform.is('ios')) {
				this.global.cordovaPlatform = true;
				this.initializeFcmNotification();	
			}

			else if (platform.is('android')) {
				this.global.cordovaPlatform = true;
				this.initializeFcmNotification();
			}

			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			
			
			// navCtrl.setRoot(HomePage);
			// let splash = modalCtrl.create(SplashPage);
			// splash.present();
		});
	}
	initializeApp() {
		if (this.global.cordovaPlatform) {
			// Initialize Push Notification
			this.initializeFcmNotification();	
		}
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
				this.splashScreen.hide();
				this.rootPage = SignupPage;
				// unsubscribe();
			} 
			
			else {
				this.global.userId = user.uid;

				console.log('new user ->',this.global.userId);
				var promises = [this.getUserData(), this.getNeighbours(), this.getAllChats()];
				Promise.all(promises).then((values) => {
					this.extractNeighbourData();
					this.getAllNews();
					this.getAllLocals();
					console.log('all data loaded', values);
					this.splashScreen.hide();
					// this.fcm.subscribeToTopic("news").then(() => {
					// 	console.log('subscribed to news');
					// }).catch((error) => {
					// 	console.log('topic subscription error',error);
					// });
					
					// this.getUserData();
					//    
					// console.log('Promise.all resolved');
					if (this.global.FbLoginComplete) {
						this.rootPage = TabsPage;
						// unsubscribe();
					}
					else if (!this.global.FbLoginComplete) { 
						this.splashScreen.hide();
						return;
					}
					
				}).catch((err) => {
					console.log('Promise.all ', err);
				});
				
		}
	
		});
	}

	initializeFcmNotification() {
		console.log('FCM Notification initialised');
		this.fcm.onNotification().subscribe(data => {
			console.log(data);
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

	initializePwaNotification(){
		var messaging = firebase.messaging();
		return messaging.requestPermission().then(() => {
			console.log('Permission granted');
			// token might change - we need to listen for changes to it and update it
			this.setupOnTokenRefresh();
			return this.updateToken();
		});
	}
	private updateToken() {
		var messaging = firebase.messaging();
		var userId = this.global.userId;
		var dbRef = firebase.database().ref('/users').child(userId);

		return messaging.getToken().then((currentToken) => {
			if (currentToken) {
					
				// we've got the token from Firebase, now let's store it in the database
					dbRef.update({
						deviceToken: currentToken
					}).then(() => {
						console.log('Device Token Updated Successfully');
					}).catch(() => {
						console.log('Device Token Update Error');
					});
				return;
			} else {
				console.log('No Instance ID token available. Request permission to generate one.');
			}
		});
	}
	private setupOnTokenRefresh(): void {
		var userId = this.global.userId;
		var dbRef = firebase.database().ref('/users').child(userId);
		var messaging = firebase.messaging();


		var unsubscribeOnTokenRefresh = messaging.onTokenRefresh(() => {
			console.log("Token refreshed");
				dbRef.update({
					deviceToken: ''
				}).then(() => { this.updateToken(); });
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
					console.warn(' Component User Data ', this.global.userData);
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
			dbRef.on('value', (data) => {

				if (data.val() != 'default') {
					neighboursArr = _.toArray(data.val());
					_.remove(neighboursArr, { 'uId': userId });
					
					// console.log('neighboursArray ', neighboursArr);
					this.global.neighboursData = neighboursArr;
					this.event.publish('neighboursUpdated');

					this.utilities.filterBlockedMeUsers(this.global.userData.blockedMe);
					this.utilities.filterBlockedByMeUsers(this.global.userData.blockedByMe);

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

	getAllLocals(){
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/locals/');
			var localsArr = [];
			dbRef.on('value', (data) => {
				if (data.val() != 'default') {
					localsArr = _.toArray(data.val()).reverse();
					this.global.locals = localsArr;
					console.log('all localss in globals', this.global.locals);
					this.event.publish('localsupdated');
				
				resolve();

				} else {
						reject();
				}
			});
		});
	}

	getAllNews(){
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/news/');
			var newsArr = [];
			var comments = [];
			dbRef.on('value', (data) => {

				if (data.val() != 'default') {
					newsArr = _.toArray(data.val()).reverse();
					this.global.news = newsArr;
					console.log('all news in globals', this.global.news);
					this.event.publish('newsupdated');
					for (let index = 0; index < newsArr.length; index++) {
						var news = newsArr[index];
						var custNewsData = {};
						
						if (news.hasOwnProperty('comments')) {
							var commentKeys = Object.keys(news.comments);
							var commentsNumber = Object.keys(news.comments).length;
							var lastCommentKey = commentKeys[commentsNumber - 1];

							var lastComment = news.comments[lastCommentKey];
							// console.log('Last Comment ', lastComment)
							custNewsData['commentsNumber'] = commentsNumber;
							custNewsData['lastComment'] = lastComment;	
							news.custNewsData = custNewsData;						
						}

						if (news.hasOwnProperty('likes')) {
							var likesNumber = Object.keys(news.likes).length;
							custNewsData['likes'] = _.toArray(news.likes);
							custNewsData['likesNumber'] = likesNumber;
							news.custNewsData = custNewsData;
						}
						// console.log('News Modified Data Form ', news);
						// if (newsArr[index].id == newsArr[index].comments.newsId) {
							// comments.push(_.toArray(newsArr[index].comments.length));
						// }
					}
					// console.log('all comments',comments);
					resolve();
				
				} else {
					reject();
				}
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
