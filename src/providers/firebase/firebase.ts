import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import * as firebase from 'firebase';
import { GlobalsProvider } from '../globals/globals';
import * as _ from 'lodash';

@Injectable()
export class FirebaseProvider {
	firebaseUsers: any;
	confirmationResult: any = undefined;

	firemessagecounter = firebase.database().ref('/chats');
	neighbour: any;
	neighbourmessages = [];
	msgcount = 0;

	constructor(private http: HttpClient, public globals: GlobalsProvider, public events: Events) {
		console.log('Hello FirebaseProvider Provider');
	}

	signupBizUser(email: string, password: string, firstName: string, lastName: string, createdAt: string, profileurl: any, name: string, userType: string, details: string) {
		return new Promise((resolve, reject) => {
			var fcmToken = this.globals.fcmToken;

			firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {

				console.log("data output", email, firstName, lastName, createdAt, profileurl)
				firebase.database().ref('/users').child(newUser.uid).set({
					email: email,
					firstName: firstName,
					lastName: lastName,
					createdAt: createdAt,
					profileurl: profileurl,
					userType: userType,
					name: name,
					details: details,
					uId: newUser.uid,
					deviceToken: fcmToken
				});
				resolve(newUser);
			}).catch((error) => {
				console.log('Error getting location', error);
				reject(error);
				// });
			});

		});
	}
	signupUser(email: string, password: string, firstName: string, lastName: string, createdAt: string, profileurl: any, userType: string, unit: string) {
		return new Promise((resolve, reject) => {
			var fcmToken = this.globals.fcmToken;
			
			firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {

				console.log("data output", email, firstName, lastName, createdAt, profileurl)
				firebase.database().ref('/users').child(newUser.uid).set({
					email: email,
					firstName: firstName,
					lastName: lastName,
					createdAt: createdAt,
					profileurl: profileurl,
					userType: userType,
					unit: unit,
					uId: newUser.uid,
					deviceToken: fcmToken
				});
				resolve(newUser);
			}).catch((error) => {
				console.log('Error getting location', error);
				reject(error);
				// });
			});

		});
	}


	loginData(email: string, password: string) {
		return firebase.auth().signInWithEmailAndPassword(email, password);
	}

	public uploadProfile(data) {
		var filename = (new Date()).getTime() + '.jpg';
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
			var notificationPayload = {
				title: 'New Message Received!',
				body: msg
			};
			
			var body = {
				to: neighbourDeviceToken,
				notification: notificationPayload
			};

			console.log('Headers Before Push Post ', options);
			console.log('Body Before Push ', body);
			this.http.post(url, body, options).subscribe((res) => {
				console.log('Noti Send Firbase Respone ', res);
			})
		});
	}
}
