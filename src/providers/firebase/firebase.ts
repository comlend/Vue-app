import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import * as firebase from 'firebase';
import { GlobalsProvider } from '../globals/globals';
import * as _ from 'lodash';
import * as moment from 'moment';
import { UtilitiesProvider } from '../utilities/utilities';
// import { resolve } from 'dns';

@Injectable()
export class FirebaseProvider {
	firebaseUsers: any;
	confirmationResult: any = undefined;

	firemessagecounter = firebase.database().ref('/chats');
	neighbour: any;
	neighbourmessages = [];
	msgcount = 0;

	constructor(private http: HttpClient, public globals: GlobalsProvider, public events: Events, public event: Events, public utilities: UtilitiesProvider) {
		console.log('Hello FirebaseProvider Provider');
	}

	signupBizUser(email: string, password: string, firstName: string, lastName: string, createdAt: string, profileurl: any, name: string, userType: string, details: string, imageData: any, phone: any) {
		console.log('Image Data => ', imageData);
		
		return new Promise((resolve, reject) => {
			var fcmToken = this.globals.fcmToken;

			var userData = {
				email: email,
				firstName: firstName,
				lastName: lastName,
				createdAt: createdAt,
				userType: userType,
				name: name,
				details: details,
				deviceToken: fcmToken,
				phone: phone,
				hideProfile: false,
				blockedByMe: 'default',
				blockedMe: 'default'
			};
		
			firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
				userData['uId'] = newUser.uid;
				console.log('if => ', imageData);
				if (imageData == 'assets/imgs/imgPlaceholder.png') {
					console.log('if => ', imageData);
					userData['profileurl'] = imageData;
					firebase.database().ref('/users').child(newUser.uid).set(userData).then(() => {
						resolve(newUser);
					});
				} else {
					this.uploadProfile(imageData, newUser.uid).then((imageUrl) => {
						console.log("else data output", email, firstName, lastName, createdAt, imageUrl);
						userData['profileurl'] = imageUrl;
						
						firebase.database().ref('/users').child(newUser.uid).set(userData).then(() => {
							resolve(newUser);
						});
					});
				}
			}).catch((error) => {
				console.log('Error getting location', error);
				reject(error);
				// });
			});

		});
	}
	signupUser(email: string, password: string, firstName: string, lastName: string, createdAt: string, userType: string, unit: string, imageData: any, phone: any) {
		// console.log('Image Data => ', imageData);
		return new Promise((resolve, reject) => {
			var fcmToken = this.globals.fcmToken;
			
			var userData = {
				email: email,
				firstName: firstName,
				lastName: lastName,
				createdAt: createdAt,
				userType: userType,
				deviceToken: fcmToken,
				phone: phone,
				unit: unit,
				hideProfile: false,
				blockedByMe: 'default',
				blockedMe: 'default'
			};
			// console.log('User Data => ', userData);
			firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
				userData['uId'] = newUser.uid;

				if (imageData == 'assets/imgs/imgPlaceholder.png') {
					// console.log('if => ', imageData);
					userData['profileurl'] = imageData;
					firebase.database().ref('/users').child(newUser.uid).set(userData).then(() => {
						resolve(newUser);
					});
				} else {
					this.uploadProfile(imageData, newUser.uid).then((imageUrl) => {
						// console.log("else data output", email, firstName, lastName, createdAt, imageUrl);
						userData['profileurl'] = imageUrl;
						
						firebase.database().ref('/users').child(newUser.uid).set(userData).then(() => {
							resolve(newUser);
						});
					});
				}
			}).catch((error) => {
				console.log('Error getting location', error);
				reject(error);
				// });
			});

		});
	}

	updateUserPic(data,userId){
		var filename = userId+ '.jpg';
		let uploadTask = firebase.storage().ref('/photos/profile/' + filename).putString(data, 'base64', { contentType: 'image/jpeg' });
		return new Promise((resolve, reject) => {
			uploadTask.on('state_changed', (snapshot) => {

			}, (err) => {
				reject(false);
			}, () => {
				console.log(uploadTask.snapshot.downloadURL);
				firebase.database().ref('/users').child(userId).update({
					profileurl: uploadTask.snapshot.downloadURL,
				});

				resolve(uploadTask.snapshot.downloadURL);
				// return;
			});
		});
	}
	updateUserData(firstName,lastName,phone,userId)
	{	return new Promise((resolve, reject) => {
			firebase.database().ref('/users/').child(userId).update({
				firstName: firstName,
				lastName: lastName,
				phone: phone
			});

			resolve();
		});

	}


	loginData(email: string, password: string) {
		this.globals.reinitializeGlobals();
		return firebase.auth().signInWithEmailAndPassword(email, password);
	}

	logOut(){
		return new Promise((resolve, reject) => {
			firebase.auth().signOut().then((authdata) => {
				resolve();
				// console.log('Auth DATA ', authdata);
				// console.log(firebase.auth().onAuthStateChanged((user) => {
				// 	console.log(user)
				// }));
				
			});
		})
		// this.globals.clear();
		
	}

	public uploadProfile(data,userId) {
		var filename = userId + '.jpg';
		let uploadTask = firebase.storage().ref('/photos/profile/' + filename).putString(data, 'base64', { contentType: 'image/jpeg' });
		return new Promise((resolve, reject) => {
			uploadTask.on('state_changed', (snapshot) => {

			}, (err) => {
				reject(false);
			}, () => {
				console.log(uploadTask.snapshot.downloadURL);

				resolve(uploadTask.snapshot.downloadURL);
				return;
			});
		});
	}
	public uploadMessagePic(data) {
		var filename = (new Date()).getTime() + '.jpg';
		let uploadTask = firebase.storage().ref('/photos/messages/' + filename).putString(data, 'base64', { contentType: 'image/jpeg' });
		return new Promise((resolve, reject) => {
			uploadTask.on('state_changed', (snapshot) => {

			}, (err) => {
				reject(false);
			}, () => {
				console.log(uploadTask.snapshot.downloadURL);

				resolve(uploadTask.snapshot.downloadURL);
				return;
			});
		});
	}
	public uploadPicture(data) {
		var filename = (new Date()).getTime() + '.jpg';
		let uploadTask = firebase.storage().ref('/photos/news-pictures/' + filename).putString(data, 'base64', { contentType: 'image/jpeg' });
		return new Promise((resolve, reject) => {
			uploadTask.on('state_changed', (snapshot) => {

			}, (err) => {
				reject(false);
			}, () => {
				console.log(uploadTask.snapshot.downloadURL);

				resolve(uploadTask.snapshot.downloadURL);
				return;
			});
		});
	}


	getNeighbours() {
		var userId = this.globals.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users/');
			var userArr = [];
			dbRef.once('value', (data) => {

				if (data.val() != 'default') {
					userArr = _.toArray(data.val());
					this.removeSelfFromNeighbours(userArr);
					console.log('All Neighbours ', userArr);
					if (userArr.length > 0) {
						// console.log('users Array ', userArr);
						resolve(userArr);
					} else {
						reject({ msg: 'No users Found' });
					}
				} else {
					reject({ msg: 'No Users Found' });
				}
			});
		});
	}

	removeSelfFromNeighbours(neighboursArr) {
		var userId = this.globals.userId;

		_.remove(neighboursArr, { 'uId': userId});
		return neighboursArr;
	}

	formatAMPM(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}
	formatDate(date) {
		var dd = date.getDate();
		var mm = date.getMonth() + 1;
		var yyyy = date.getFullYear();
		if (dd < 10)
			dd = '0' + dd;
		if (mm < 10)
			mm = '0' + mm;
		return dd + '/' + mm + '/' + yyyy;
	}

	addnewmessage(msg, neighbourId, type) {
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());

		// Default Status is Delivered for every message
		let msgStatus = 'Delivered';

		// console.log('type - ',type, ' chat message>>>', msg, ' neighbour >>>', neighbourId);

		var userId = this.globals.userId;
		// console.log(userId);
		var firechats = firebase.database().ref('/chats/');

		if (neighbourId) {
			var promise = new Promise((resolve, reject) => {
				var msgObj = {
					sentby: userId,
					sentTo: neighbourId,
					status: msgStatus,
					message: msg,
					timestamp: firebase.database.ServerValue.TIMESTAMP,
					timeofmsg: time,
					dateofmsg: date,
					type: type,
					id: ''
				};

				var saveMsgSender = firechats.child(userId).child(neighbourId).push();


				var uniqueMsgKey = saveMsgSender.key;

				// Add Unique Key
				msgObj.id = uniqueMsgKey;


				// console.log('Message To be Sent ', uniqueMsgKey, msgObj);
				saveMsgSender.set(msgObj).then(() => {
					var saveMsgReceiver = firechats.child(neighbourId).child(userId).child(uniqueMsgKey);
					saveMsgReceiver.set(msgObj).then(() => {
						resolve(true);
					}).catch((err) => {
						reject(false);
					});
				});
			});
			return promise;
		}
	}

	getnewMsg(neighbourId) {
		return new Promise((resolve) => {
			var userId = this.globals.userId;
			var firechats = firebase.database().ref('/chats/' + userId);
			let temp;

			firechats.child(neighbourId).limitToLast(1).on('child_added', (resp) => {
				temp = resp.val();

				// Convert Message Obj to Array
				this.neighbourmessages.push(temp);
				console.log('counter Message Arr', this.neighbourmessages)

				resolve(this.neighbourmessages);
				this.events.publish('newmessage');

			});
		});
	}

	getneighbourmessages(neighbourId) {
		return new Promise((resolve, reject) => {
			var userId = this.globals.userId;
			var firechats = firebase.database().ref('/chats/' + userId);
			let temp;
			this.neighbourmessages = [];


			firechats.child(neighbourId).on('value', resp => {
				temp = resp.val();

				// console.log('counter Message ', temp)

				// Convert Message Obj to Array
				this.neighbourmessages = _.toArray(temp);
				// console.log('counter Message Arr', this.neighbourmessages)

				resolve(this.neighbourmessages);
				/* for (var tempkey in temp) {
					this.neighbourmessages.push(temp[tempkey]);
				} */
				// this.events.publish('newmessage');


				// console.log(this.neighbourmessages);


			});
		});
	}

	updateChatMsgStatus(userId, neighbourId, chat) {
		var updateSenderRef = firebase.database().ref('/chats').child(userId).child(neighbourId).child(chat.id);
		updateSenderRef.update({
			status: 'Read'
		}).then(() => {
			var updateReceiverRef = firebase.database().ref('/chats').child(neighbourId).child(userId).child(chat.id);
			updateReceiverRef.update({
				status: 'Read'
			}).then(() => {
				// Update msg status event
				return({success: true, msg: 'Chat Message Status Updated'});
			});
		});
	}

	chatMsgStatusUpdate(userId, neighbourId/* , chat */) {
		var updatedSenderRef = firebase.database().ref('/chats').child(userId).child(neighbourId)/* .child(chat.id) */;
		updatedSenderRef.on('child_changed', (data: any) => {
			var updatedData = data.val();
			// console.log('Updated Data ', updatedData);				
			
			// console.log(userId + ' == ' + updatedData.sentby + ' && ' + updatedData.status + ' == Read');
			if (userId == updatedData.sentby && updatedData.status == 'Read') {
				this.events.publish('chatstatus:updated');
				// console.log('Updated Data ', updatedData);				
			}
			// alert('Hey Neighbour read your message');
		});		
	}

	sendChatMsgNoti(neighbourDeviceToken, msg) {
		return new Promise((resolve, reject) => {
			var url = 'https://fcm.googleapis.com/fcm/send';

			var options = {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					'Authorization': 'key=AAAAiMHir-c:APA91bFvVxldmUVwhcHfv50Bidgj4d9Q1QtqmZ9umsn6Ntzs7qxpnic0Kp0QpMM5QVUtksBRXS0ybO-DTggVJDNc6IKimv2ofHC9Mr4CML1FU6eB2jphloU28FCtmMh8B_uONknaI9k8'
				})
			};

			// let options = new HttpHeaders().set('Content-Type', 'application/json'); options.set('Authorization', 'key=AAAAiMHir-c:APA91bFvVxldmUVwhcHfv50Bidgj4d9Q1QtqmZ9umsn6Ntzs7qxpnic0Kp0QpMM5QVUtksBRXS0ybO-DTggVJDNc6IKimv2ofHC9Mr4CML1FU6eB2jphloU28FCtmMh8B_uONknaI9k8')
			var badgeCount = this.globals.unreadMessages + 1;
			console.log("unread messages", badgeCount);
			var notificationPayload = {
				title: 'Your neighbour '+this.globals.userData.firstName+' sent you a message',
				body: msg,
				sound: "default",
				badge: badgeCount,
				click_action: "FCM_PLUGIN_ACTIVITY",
				icon: "fcm_push_icon"
			};
			
			var body = {
				to: neighbourDeviceToken,
				priority: "high",
				notification: notificationPayload
			};

			console.log('Headers Before Push Post ', options);
			console.log('Body Before Push ', JSON.stringify(body));
			this.http.post(url, JSON.stringify(body), options).subscribe((res) => {
				console.log('Noti Send Firbase Respone ', res);
			})
		});
	}

	sendNewsCommentNoti(newsPublisherDeviceToken) {
		var userData = this.globals.userData;
		
		return new Promise((resolve, reject) => {
			var url = 'https://fcm.googleapis.com/fcm/send';

			var options = {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					'Authorization': 'key=AAAAiMHir-c:APA91bFvVxldmUVwhcHfv50Bidgj4d9Q1QtqmZ9umsn6Ntzs7qxpnic0Kp0QpMM5QVUtksBRXS0ybO-DTggVJDNc6IKimv2ofHC9Mr4CML1FU6eB2jphloU28FCtmMh8B_uONknaI9k8'
				})
			};

			var notificationPayload = {
				title: userData.firstName + ' commented on your news',
				sound: "default",
				click_action: "FCM_PLUGIN_ACTIVITY",
				icon: "fcm_push_icon"
			};

			var body = {
				to: newsPublisherDeviceToken,
				priority: "high",
				notification: notificationPayload
			};

			/* console.log('Headers Before Push Post ', options);
			console.log('Body Before Push ', JSON.stringify(body)); */

			this.http.post(url, JSON.stringify(body), options).subscribe((res) => {
				console.log('Noti Send Firbase Respone ', res);
				resolve(res);
			})
		});
	}

	updateFcmDeviceToken(deviceToken) {
		return new Promise((resolve, reject) => {
			var userId = this.globals.userId;
			var dbRef = firebase.database().ref('/users/' + userId).child('deviceToken');

			dbRef.update({
				deviceToken: deviceToken
			}).then(() => {
				resolve();
			}).catch(() => {
				reject();
			});
		});
	}

	deleteChats(chats) {
		var userId = this.globals.userId;
		var deletePromises = [];
		return new Promise((resolve, reject) => {
			for (let i = 0; i < chats.length; i++) {
				let chat = chats[i];
				var neighbourId = chat.receiver;

				var dbRef = firebase.database().ref('/chats').child(userId).child(neighbourId).remove();	

				deletePromises.push(dbRef);
			}

			Promise.all(deletePromises).then(() => {
				resolve({success: true, msg: 'Chats Deleted Successfully'});
			}).catch((err) => {
				reject(err);
			})
		});
		
	}
	addLocal(userData, local, localName, localPicUrl){
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		var dbref = firebase.database().ref('/locals/').push();
		return new Promise((resolve, reject) => {
			dbref.set({
				uId: userData.uId,
				firstName: userData.firstName,
				lastName: userData.lastName,
				profileurl: userData.profileurl,
				timeofPost: moment().format(),
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				date: date,
				time: time,
				local: local,
				unit: userData.unit,
				userType: userData.userType,
				deviceToken: userData.deviceToken,
				id: dbref.key,
				localName: localName,
				picUrl: localPicUrl
			});
			resolve();
		});
	}
	addNews(userData,news,picture){
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		var dbref = firebase.database().ref('/news/').push();
		return new Promise((resolve, reject) => {
			dbref.set({
				uId: userData.uId,
				firstName: userData.firstName,
				lastName: userData.lastName,
				profileurl: userData.profileurl,
				timeofPost:moment().format(),
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				date: date,
				time: time,
				news: news,
				unit: userData.unit,
				userType: userData.userType,
				deviceToken: userData.deviceToken,
				id: dbref.key, 
				newspic: picture
			});
			resolve();
		});
	}
	

	addCommentToNews(newsData,userData,comment,picture){
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		var dbref = firebase.database().ref('/news/' + newsData.id + '/comments/').push();
		return new Promise((resolve, reject) => {
			dbref.set({
				uId: userData.uId,
				firstName: userData.firstName,
				lastName: userData.lastName,
				profileurl: userData.profileurl,
				date: date,
				time: time,
				comment: comment,
				unit: userData.unit,
				id: dbref.key,
				newsId: newsData.id,
				commentPic: picture
			});
			resolve();
		});
	}

	addLikeToNews(userData,newsData){
		// console.log('User Data ', userData, ' News Data ', newsData);
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		var dbref = firebase.database().ref('/news/' + newsData.id + '/likes/').push();
		return new Promise((resolve, reject) => {
			dbref.set({
				uId: userData.uId,
				firstName: userData.firstName,
				lastName: userData.lastName,
				profileurl: userData.profileurl,
				date: date,
				time: time,
				unit: userData.unit,
				id: dbref.key,
				newsId: newsData.id
			});
			resolve();
		});
	}

	removeLikesFromNews(newsData, like) {
		var newsId = newsData.id;
		var likeId = like.id;

		return new Promise((resolve, reject) => {
			var dbref = firebase.database().ref('/news/' + newsId + '/likes/').child(likeId);
			
			dbref.remove().then(() => {
				resolve();
			});			
		});
	}

	getAllComments(newsId){
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/news/' + newsId + '/comments/');
			var newsCommentArr = [];
			dbRef.on('value', (data) => {

				if (data.val() != 'default') {
					newsCommentArr = _.toArray(data.val());
					// this.removeSelfFromNeighbours(newsArr);
					// console.log('All Neighbours ', newsArr);
					if (newsCommentArr.length > 0) {
						// console.log('users Array ', userArr);
						resolve(newsCommentArr);
					} else {
						reject({ msg: 'No comments Found' });
					}
				} else {
					reject({ msg: 'No comments Found' });
				}
			});
		});
	}
	getAllNews(){
		var userId = this.globals.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/news/');
			var newsArr = [];
			dbRef.on('value', (data) => {
				
				if (data.val() != 'default') {
					newsArr = _.toArray(data.val());
					// this.removeSelfFromNeighbours(newsArr);
					// console.log('All Neighbours ', newsArr);
					if (newsArr.length > 0) {
						// console.log('users Array ', userArr);
						resolve(newsArr);
					} else {
						reject({ msg: 'No news Found' });
					}
				} else {
					reject({ msg: 'No news Found' });
				}
			});
		});
	}

	hideMyProfile(hideProfile) {
		var userId = this.globals.userId;
		
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users').child(userId);
			dbRef.update({
				hideProfile: hideProfile
			}).then(() => {
				resolve();
			});
		});
	}

	blockNeighbour(neighbourToBlock) {
		var userId = this.globals.userId;
		var neighbourId = neighbourToBlock.uId;

		return new Promise((resolve, reject) => {
			var userRef = firebase.database().ref('/users').child(userId + '/blockedByMe').child(neighbourId);
			userRef.set({
				id: neighbourId
			});

			var neighbourRef = firebase.database().ref('/users').child(neighbourId + '/blockedMe').child(userId);
			neighbourRef.set({
				id: userId
			});

			Promise.all([userRef, neighbourRef]).then(() => {
				this.getUpdatedBlockedByMeList();
				
				resolve({success: true, msg: 'User Blocked'});
			}).catch((err) => {
				reject(err);
			});
		});	
	}

	unblockneighbour(neighbourToUnblock) {
		var userId = this.globals.userId;
		var neighbourId = neighbourToUnblock.uId;

		return new Promise((resolve, reject) => {
			var userRef = firebase.database().ref('/users').child(userId + '/blockedByMe').child(neighbourId).remove();

			var neighbourRef = firebase.database().ref('/users').child(neighbourId + '/blockedMe').child(userId).remove();

			Promise.all([userRef, neighbourRef]).then(() => {
				this.getUpdatedBlockedByMeList();
				resolve({ success: true, msg: 'User Unblocked' });
			}).catch((err) => {
				reject(err);
			});
		});
	}

	getUpdatedBlockedByMeList() {
		var userId = this.globals.userId;

		var userRefBlockedByMe = firebase.database().ref('/users').child(userId).child('blockedByMe');

		userRefBlockedByMe.once('value', (updatedList) => {
			if (updatedList.val()) {
				var updatedListObj = updatedList.val();

				// Update Blocked Neighbours Data
				this.utilities.filterBlockedByMeUsers(_.toArray(updatedListObj));

				// console.log('Updated List Blocked By Me', updatedListObj);
			} else {
				this.globals.blockedByMe = [];
			}
		});
	}

	getUpdatedBlockedMeList() {
		var userId = this.globals.userId;

		var userRefBlockedMe = firebase.database().ref('/users').child(userId).child('blockedMe');

		userRefBlockedMe.on('child_changed', (updatedList) => {
			if (updatedList.val()) {
				var updatedListObj = updatedList.val();
				this.globals.blockedMe = _.toArray(updatedListObj);
				// console.log('Updated List Blocked Me', updatedListObj);
			} else {
				this.globals.blockedMe = [];
			}
			
		});
	}


	

	/* old code getBlockedNeighboursIds() {
		var userId = this.globals.userId;

		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users').child(userId).child('blockedByMe');

			dbRef.on('value', (blockedNeighboursIds) => {
				var blockedNeighboursIdsArr = [];

				if (blockedNeighboursIds.val()) {
					blockedNeighboursIdsArr = _.toArray(blockedNeighboursIds.val());
				}

				resolve(blockedNeighboursIdsArr);
			});
		});
	}

	old code getBlockedNeighbours() {
		var userId = this.globals.userId;

		return new Promise((resolve, reject) => {

			this.getBlockedNeighboursIds().then((blockedIds: any) => {
				if (blockedIds.length > 0) {
					var promises = [];

					for (let i = 0; i < blockedIds.length; i++) {
						var blockedId = blockedIds[i].id;

						var dbRef = firebase.database().ref('/users').child(blockedId);

						promises.push(dbRef.once('value'));
					}

					Promise.all(promises).then((values) => {
						var blockedArr = [];

						for (let j = 0; j < values.length; j++) {
							var val = values[j].val();
							blockedArr.push(val);							
						}
						// console.log('OAOAO ', blockedArr)
						resolve(blockedArr);
					}).catch((err) => {
						reject(err);
					});	
				} else {
					resolve({success: false, msg: 'No Blocked Neighbours'});
				}
			});
		});
	} */

	addServiceReq(userData, title, details, picture){
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		var neighboursArr = this.globals.neighboursData;
		var admin = _.find(neighboursArr, {'userType': 'admin'});
		var dbref = firebase.database().ref('/serviceRequests/').push();
		return new Promise((resolve, reject) => {
			dbref.set({
				uId: userData.uId,
				firstName: userData.firstName,
				lastName: userData.lastName,
				profileurl: userData.profileurl,
				timeofPost: moment().format(),
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				date: date,
				time: time,
				title: title,
				assignedTo: admin.uId,
				assignedToFirstName: admin.firstName,
				assignedToLastName: admin.lastName,
				assignedToprofilePic: admin.profileurl,
				userType: userData.userType,
				id: dbref.key,
				supportPic: picture,
				details: details,
				status: 'inProgress'
			});
			resolve();
		});
	}

	getAllSupportReq(){
		var userId = this.globals.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/serviceRequests').orderByChild('uId').equalTo(userId);
			var serviceReqArr = [];
			dbRef.on('value', (data) => {
				if (data.val()) {
					serviceReqArr = _.toArray(data.val());
					this.event.publish('supportRequpdated');
				}

				resolve(serviceReqArr);
			});
		});
	}
}
