import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ActionSheetController } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the AddNewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-news',
  templateUrl: 'add-news.html',
})
export class AddNewsPage {
  userData: any;
  news: any;
  newsPicUrl: any = 'Default';
  hasPhoto: boolean = false;
  hasNoContent: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public firebase: FirebaseProvider, public app: App, private camera: Camera, public actionSheetCtrl: ActionSheetController ) {
    this.userData = this.globals.userData;
    console.log(this.userData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewsPage');
  }
  back(){
    this.app.getRootNav().pop();
  }
  addContent(){
    if (this.news != null) {
      this.hasNoContent = false;
    }
  }
  addNews(){
    this.firebase.addNews(this.userData,this.news,this.newsPicUrl).then((data) => {
      console.log('news added');
      this.navCtrl.pop();
    });
  }
  // addPicInNews(){
  //   this.firebase.addNews(this.userData, this.news).then((data) => {
  //     console.log('news added');
  //     this.navCtrl.pop();
  //   });
  // }

  addPhototoNews(){
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
      this.newsPicUrl = imageData;
      
      this.firebase.uploadPicture(imageData).then((data) => {
        this.newsPicUrl = data;
        console.log('Camera Data ', data);
        this.hasPhoto = true;

      })
        .catch((err) => {
          console.log('Camera Error ', err);
        });
    });
  }

}
