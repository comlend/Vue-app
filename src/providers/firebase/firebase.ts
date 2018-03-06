// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import * as firebase from 'firebase';
import { GlobalsProvider } from '../globals/globals';
import * as _ from 'lodash';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {
	firebaseUsers: any;
	confirmationResult: any = undefined;
	
	firemessagecounter = firebase.database().ref('/chats');
	neighbour: any;
	neighbourmessages = [];
	msgcount = 0;

constructor(public globals: GlobalsProvider, public events: Events) {
    console.log('Hello FirebaseProvider Provider');
  }

signupBizUser(email: string, password: string, firstName: string, lastName: string, createdAt: string, profileurl: any, name:string, userType: string, details: string) {
		return new Promise((resolve, reject) => {
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
					uid: newUser.uid
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
			firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
				
				console.log( "data output", email, firstName,lastName ,createdAt, profileurl)
					firebase.database().ref('/users').child(newUser.uid).set({
					email: email,
					firstName: firstName,
					lastName: lastName,
					createdAt: createdAt,
					profileurl: profileurl,
					userType: userType,
					unit: unit,
					uid: newUser.uid
					});
					resolve(newUser);
				}).catch((error) => {
					console.log('Error getting location', error);
					reject(error);
				// });
					});

			});
	}


loginData(email : string,password : string){
		return firebase.auth().signInWithEmailAndPassword(email, password);
	}
	
public  uploadProfile(data){
			var filename = (new Date()).getTime() + '.jpg';
			let uploadTask = firebase.storage().ref('/photos/profile/' + filename).putString(data, 'base64', {contentType: 'image/jpeg'});
			return new Promise((resolve, reject) => {
				uploadTask.on('state_changed', (snapshot)=>{

				}, (err) => {
						reject(false);
				}, () =>{
					 console.log( uploadTask.snapshot.downloadURL);

					 resolve(uploadTask.snapshot.downloadURL);
					 return;
				});
			});
	}


getNeighbours(){


		var userId = this.globals.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users/');
			var userArr = [];
			dbRef.once('value', (data) => {

				if (data.val() != 'default') {
					userArr = _.toArray(data.val());
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
addnewmessage(msg, neighbourId) {
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		// console.log('chat message>>>', msg);
		// console.log('neighbour >>>', neighbourId);

		var userId = this.globals.userId;
		// console.log(userId);
		var firechats = firebase.database().ref('/chats/');

		if (neighbourId) {
			var promise = new Promise((resolve, reject) => {
				// this.fireuserStatus.child(this.buddy.uid).on('value',(statuss)=>{
				//   let msgstatus = statuss.val();
				firechats.child(userId).child(neighbourId).push({
					sentby: userId,
					message: msg,
					timestamp: firebase.database.ServerValue.TIMESTAMP,
					timeofmsg: time,
					dateofmsg: date
				}).then(() => {
					firechats.child(neighbourId).child(userId).push({
						sentby: userId,
						message: msg,
						timestamp: firebase.database.ServerValue.TIMESTAMP,
						timeofmsg: time,
						dateofmsg: date
					}).then(() => {
						resolve(true);
						this.events.publish('newmessage');
					}), (err) => {
							reject(false);
					// .catch((err) => {
					//   reject(err);
					}
				})
			})
			// })
			return promise;
		}
	}
	getneighbourmessages(neighbourId) {
		var userId = this.globals.userId;
		var firechats = firebase.database().ref('/chats/');
		let temp;

		

		// var userId = this.globals.userId;
		// var firechats = firebase.database().ref('/chats/');
		// let temp;
		// firechats.child(userId).child(neighbourId).on('value', (snapshot) => {
			this.neighbourmessages = [];
		// 	temp = snapshot.val();

		// 	// console.log('counter Message ', temp)
		// 	for (var tempkey in temp) {
		// 		this.neighbourmessages.push(temp[tempkey]);
		// 	}
		// 	this.events.publish('newmessage');
		// })
		// console.log('ne id for chats',neighbourId);
		return new Promise((resolve, reject) => {
			firechats.child(userId).child(neighbourId).on('value', resp => {
				temp = resp.val();

				// console.log('counter Message ', temp)
				
					// for (var tempkey in temp) {
					// 	this.neighbourmessages.push(temp[tempkey]);
					// }
					this.events.publish('newmessage');
				
				
				// console.log(this.neighbourmessages);

				resolve(temp);

			// });

			}, (err: any) => {
				reject(err);
			});
		});		
	}

}
