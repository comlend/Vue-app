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


  signupUser(email: string, password: string, firstName: string, lastName: string, createdAt: string, profileurl: any) {
			return new Promise((resolve, reject) => { 
			firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
				

					firebase.database().ref('/users').child(newUser.uid).set({
					email: email,
					firstName: firstName,
					lastName: lastName,
					createdAt: createdAt,
					profileurl: profileurl,
					
					});

				// this.globals.userId = newUser.uid;
				// this.globals.userType = type;

				// this.sendEmailVerificationLink().then(success=> console.log(success)).catch(error=> console.log(error));
				}).catch((error) => {
					console.log('Error getting location', error);
					reject(error);
				// });
					});

			});
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

}
