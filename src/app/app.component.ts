import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SplashPage } from '../pages/splash/splash';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import * as firebase from 'firebase';
import { GlobalsProvider } from '../providers/globals/globals';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	rootPage: any = '';

	constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, modalCtrl: ModalController, private global: GlobalsProvider) {
		this.initializeFirebase();

		platform.ready().then(() => {

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
			} else {
				this.global.userId = user.uid;
				console.log(this.global.userId);
				this.rootPage = TabsPage;
				// unsubscribe();
			}
		});
	}
}
