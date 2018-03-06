import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events} from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  @ViewChild('content') content: Content;
  neighbourData: any;
  chat: any = '';
  chats: any;

  constructor(public navCtrl: NavController, public firebase: FirebaseProvider, public navParams: NavParams, public zone: NgZone, public events: Events) {
    
    this.neighbourData = this.navParams.get('neighbour');
    // console.log(this.neighbourData);
    // if(this.neighbourData){
    //   this.getAllMessages();
      
    // }
    this.scrollto();
    this.events.subscribe('newmessage', () => {
      this.chats = [];
      this.zone.run(() => {
        this.chats = this.firebase.getneighbourmessages(this.neighbourData.uId);
      })
    })

    // this.events.subscribe('newmessage', () => {
    //   this.zone.run(() => {
    //     this.firebase.getneighbourmessages(this.neighbourData.uId).then(success => {
    //       this.chats = success;
    //       console.warn(success);
    //     }, error => {
    //       console.error(error);
    //     });;
    //     console.log(this.chats);
    //     // 
    //   });
     
    // });
    
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
    this.getAllMessages();
  }

  addnewmessage(){
    console.log(this.chat, this.neighbourData.uId);
    this.firebase.addnewmessage(this.chat, this.neighbourData.uId).then( success => {
      // this.chats = userData;
      console.warn(success);
    }, error => {
      console.error(error);
    });
  }

  getAllMessages() {
   this.firebase.getneighbourmessages(this.neighbourData.uId).then(success => {
      // console.log(success);
      console.warn(success);
    }, error => {
      console.error(error);
    });;
        console.log(this.chats);
  
  }

  scrollto() {
    setTimeout(() => {
    
        this.content.scrollToBottom();
     
      
    }, 1000);
  }

}
