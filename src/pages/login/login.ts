import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { FormBuilder, Validators  } from '@angular/forms';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm;
  returnInvalid: boolean = false;
  user: {email?: any, password?: any} = {};
  loading : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private firebase:FirebaseProvider,  public formBuilder: FormBuilder, public loadingCtrl:LoadingController) {
    this.initializeForm()
  }

  initializeForm() {
		this.loginForm = this.formBuilder.group({
			email: ['', Validators.compose([Validators.required ])],
			password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
		});
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  back(){
  	this.navCtrl.pop();
  }



  loginUser(): void {
		// console.log(this.user);
		// this.returnInvalid = true;
		if (!this.loginForm.valid) {
			console.log(this.loginForm.value);
		} else {
			this.firebase.loginData(this.loginForm.value.email, this.loginForm.value.password).then(authData => {
				this.loading.dismiss().then(() => {
					this.navCtrl.setRoot(TabsPage);
								
				});
			}, error => {
				this.loading.dismiss().then(() => {
					this.returnInvalid = true;
				});
			});

			this.loading = this.loadingCtrl.create({content: 'Logging you in...'});
			this.loading.present();
		}        
	}

  clearErrors() {
		if(this.user.email == "" || this.user.password == "") {
			this.returnInvalid = false;
		}
  }
  
  resetPass(){
    console.log("pass reset", this.loginForm.value.email)
    var auth = firebase.auth();
    var emailAddress = this.loginForm.value.email;

    auth.sendPasswordResetEmail(emailAddress).then(()=> {
      this.presentLoadingDefault()
    // Email sent.
    }).catch(function(error) {
    // An error happened.
    });
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please check your email for reset..'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }
}
