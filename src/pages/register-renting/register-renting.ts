import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { FirebaseProvider} from '../../providers/firebase/firebase';
import { TabsPage } from '../tabs/tabs';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the RegisterRentingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-renting',
  templateUrl: 'register-renting.html',
})
export class RegisterRentingPage {
  public signupForm;
   user: {firstName?: any, lastName?: any, email?: any, password?: any} = {};
   formData: any;
   loading: any;
   errormessage: any;
   returnInvalid: boolean;
   profileurl: any = '';
   imageData: any;
   userType: string = "renting";
   liveInProperty: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public firebase: FirebaseProvider, public loadingCtrl: LoadingController, private camera: Camera, public actionSheetCtrl: ActionSheetController) {
      this.initializeForm();
      this.profileurl = 'assets/imgs/imgPlaceholder.png';
  }

  initializeForm(): void {
      this.signupForm = this.formBuilder.group({
        firstName: ['', Validators.compose([Validators.required])],
        lastName: ['', Validators.compose([Validators.required])],
        unit: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        
      });            
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterOwnerPage');
  }
  back(){
    this.navCtrl.pop();
  }

  signupUser() {
    this.formData = this.signupForm.value;
    console.log('Run signupUser');
    console.log( "data output",this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.firstName, this.signupForm.value.lastName, createdAt, this.profileurl)
    
    // this.returnInvalid = true;

      var createdAt = moment().format();
      

      this.firebase.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.firstName, this.signupForm.value.lastName, createdAt, this.profileurl, this.userType)
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
      this.loading = this.loadingCtrl.create({content: 'Signing you up..'});
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

  selectImage(type){
     let options : CameraOptions = {
        quality: 90,
        targetWidth: 300,
        targetHeight: 300,
        allowEdit: true,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: (type == 0)?this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY
      };

      this.camera.getPicture(options).then((imageData) =>{
        this.imageData = imageData;
          this.firebase.uploadProfile(imageData).then((data) => {
            // this.profileurl = data;
            console.log(data);
            
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }
  clearErrors(){

  }

  register(){

  }

}
