import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { TabsPage } from '../tabs/tabs';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
	selector: 'page-register-business',
	templateUrl: 'register-business.html',
})
export class RegisterBusinessPage {
	public signupFormBiz;
	user: { firstName?: any, lastName?: any, email?: any, pass?: any, unit?: any, details?: any, mobile?: any } = {};
	formData: any;
	loading: any;
	errormessage: any;
	returnInvalid: boolean;
	profileurl: any = '';
	imageData: any;
	userType: string = "business";
	liveInProperty: boolean = false;
	showPassError: boolean = false;
	picUploaded: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public firebase: FirebaseProvider, public loadingCtrl: LoadingController, private camera: Camera, public actionSheetCtrl: ActionSheetController) {
		this.initializeForm();
		this.profileurl = 'assets/imgs/imgPlaceholder.png';
	}
	initializeForm(): void {
		this.signupFormBiz = this.formBuilder.group({
			firstName: ['', Validators.compose([Validators.required])],
			lastName: ['', Validators.compose([Validators.required])],
			name: ['', Validators.compose([Validators.required])],
			email: ['', Validators.compose([Validators.required])],
			password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
			mobile: ['', Validators.compose([Validators.required])],
			details: ['', Validators.compose([Validators.required])],
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterOwnerPage');
	}
	back() {
		this.navCtrl.pop();
	}
	checkPassLength() {
		if (this.user.pass.length < 6) {
			this.showPassError = true;
		}
		else
			this.showPassError = false;
	}

	signupUser() {
		this.formData = this.signupFormBiz.value;
		// console.log('Run signupUser');
		// console.log( "data output",this.signupFormBiz.value.email, this.signupFormBiz.value.password, this.signupFormBiz.value.firstName, this.signupFormBiz.value.lastName, createdAt, this.profileurl)

		// this.returnInvalid = true;

		var createdAt = moment().format();

		if (!this.imageData) {
			this.imageData = this.profileurl;
		}
		
		this.firebase.signupBizUser(this.signupFormBiz.value.email, this.signupFormBiz.value.password, this.signupFormBiz.value.firstName, this.signupFormBiz.value.lastName, createdAt, this.profileurl, this.signupFormBiz.value.name, this.userType, this.signupFormBiz.value.details, this.imageData, this.signupFormBiz.value.mobile)
			.then((data) => {
				console.log('test', data);
				this.loading.dismiss().then(() => {

					this.navCtrl.setRoot(TabsPage);
				});
			}, (error) => {
				this.loading.dismiss().then(() => {
					this.errormessage = error.message;
					this.returnInvalid = true;

				});
			});
		this.loading = this.loadingCtrl.create({ content: 'Signing you up..' });
		this.loading.present();
	}

	uploadImage() {
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
			this.profileurl = 'data:image/png;base64,' + imageData;
			this.picUploaded = true;
			// this.firebase.uploadProfile(imageData).then((data) => {
			//   // this.profileurl = data;
			//   console.log(data);

			// })
			// .catch((err) => {
			//   console.log(err);
			// });
		});
	}
	clearErrors() {

	}

	register() {

	}

}
