// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {
	firebaseUsers: any;
	confirmationResult: any = undefined;

  constructor() {
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
					details: details
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
					unit: unit
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
	return new Promise((resolve, reject) => {
			
			var dbRef = firebase.database().ref('users/');

			var userData: any;

			dbRef.once('value', (data) => {
				// console.log('USERDATA ', data.val());
				if (data.val()) {
					resolve({data: data.val()});
				} else {
					reject({msg: 'Data Not Found'});
				}
			});
		});
	}

}
