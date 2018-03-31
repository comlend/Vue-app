import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  userData: any;
  profileurl: any;
  fullName: any;
  valueChange: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public actionSheetCtrl: ActionSheetController, public camera: Camera, public firebase: FirebaseProvider) {
    this.userData = this.globals.userData;
    this.profileurl = this.globals.userData.profileurl;
    this.fullName = this.globals.userData.firstName +' '+ this.globals.userData.lastName;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }
  back() {
    this.navCtrl.pop();
  }
  valueChanged(){
    this.valueChange = true;
  }
  editPhoto() {

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
      var imageData = imageData;
      // this.profileurl = imageData;

      this.firebase.updateUserPic(imageData,this.userData.uId).then((data) => {
        this.profileurl = data;
        this.globals.userData.profileurl = this.profileurl;
      })
        .catch((err) => {
          console.log('Camera Error ', err);
        });
    });
  }

  updateDetails(){
    var firstName;
    var lastName;

    if (!(this.fullName.indexOf(' ') >= 0)) {
      firstName = this.fullName.substr(this.fullName.indexOf(' ') + 1);
      lastName = " ";
    } else {
      firstName = this.fullName.substr(0, this.fullName.indexOf(' '));
      lastName= this.fullName.substr(this.fullName.indexOf(' ') + 1);
    }

    this.firebase.updateUserData(firstName, lastName, this.userData.phone, this.userData.userId).then((data)=>{
      console.log('user data updated');
      this.globals.userData.firstName = firstName;
      this.globals.userData.lastName = lastName;
      this.globals.userData.phone = this.userData.phone;
    })
  }

}
