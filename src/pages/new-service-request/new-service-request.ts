import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the NewServiceRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-service-request',
  templateUrl: 'new-service-request.html',
})
export class NewServiceRequestPage {
  title: any;
  details: any;
  picAdded: boolean = false;
  reqPicture: any = 'Default';
  userData: any;
  allRequests: any =[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public camera: Camera, public firebase: FirebaseProvider, public globals: GlobalsProvider, public keyboard: Keyboard) {
    this.userData = this.globals.userData;
    console.log(this.userData);
    this.keyboard.disableScroll(true);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewServiceRequestPage');
  }
  back() {
    this.navCtrl.pop();
  }
  submitRequest(){
    this.firebase.addServiceReq(this.userData, this.title, this.details, this.reqPicture).then((data) => {
      console.log('local item added');
      this.navCtrl.pop();
    });
  }

  addPhotoRequest(){
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
      this.reqPicture = imageData;

      this.firebase.uploadPicture(imageData).then((data) => {
        this.reqPicture = data;
        this.picAdded = true;

      })
        .catch((err) => {
          console.log('Camera Error ', err);
        });
    });
  }


}
