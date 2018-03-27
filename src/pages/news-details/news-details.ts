import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ActionSheetController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the NewsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news-details',
  templateUrl: 'news-details.html',
})
export class NewsDetailsPage {
  @ViewChild('NewsComment') myInput: ElementRef;
  newsDetails: any;
  messageRow: number = 1;
  comment: any;
  allComments: any;
  noComments: boolean=false;
  userId: any;
  hasNoComment: boolean = true;
  commentPicUrl: any = 'Default';
  hasCommentPhoto: boolean= false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App,public firebase:FirebaseProvider, public globals: GlobalsProvider, public actionSheetCtrl: ActionSheetController, public camera: Camera) {
    this.newsDetails = this.navParams.get('news');
    console.log(this.newsDetails);
    this.getAllComments();
    this.userId = this.globals.userId;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsDetailsPage');
  }
  back(){
    this.app.getRootNav().pop();
  }
  hasComment(){
    if (this.comment != null) {
      this.hasNoComment = false;
    }
    else if (this.comment = null) {
      this.hasNoComment = true;
    }
  }
  addComment(){
    this.firebase.addCommentToNews(this.newsDetails, this.globals.userData, this.comment, this.commentPicUrl).then((data) => {
      console.log('comment added');
      this.getAllComments();
      this.comment = ''; 
      this.noComments = false;
      // this.navCtrl.pop();
    });
  }

  addLike(){
    this.firebase.addLikeToNews(this.globals.userData,this.newsDetails).then((data) => {
      console.log('like added');
      // this.navCtrl.pop();
      this.hasCommentPhoto = false;
      this.commentPicUrl = 'Default';
    });
  }

  getAllComments(){
    this.firebase.getAllComments(this.newsDetails.id).then((data) => {
      this.allComments = data;
     
    },(error) =>{
      console.log(error);
      this.noComments = true;
    });
  }

  uploadPic() {
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
      // this.commentPicUrl = imageData;

      this.firebase.uploadPicture(imageData).then((data) => {
        this.commentPicUrl = data;
        console.log('Camera Data ', data);
        this.hasCommentPhoto = true;

      })
        .catch((err) => {
          console.log('Camera Error ', err);
        });
    });
  }


}
