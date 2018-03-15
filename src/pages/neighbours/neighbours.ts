import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { MessagePage } from '../message/message'; 
import { BusinessDetailsPage } from '../business-details/business-details';
import * as _ from 'lodash';
import * as firebase from 'firebase';

import { EventDispatcherProvider } from '../../providers/event-dispatcher/event-dispatcher';

@IonicPage()
@Component({
  selector: 'page-neighbours',
  templateUrl: 'neighbours.html',
})
export class NeighboursPage {
  users: any;
  userId: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, public globals: GlobalsProvider, private app: App, public event: Events, public eventDispatcher: EventDispatcherProvider, public _zone: NgZone) {
    this.userId = this.globals.userId;
    // this.getAllNeighbours()
    if (this.globals.neighboursData) {
      this.users = this.globals.neighboursData;
      console.log(this.users)
    }   
  }

  ionViewWillEnter() {
    // Initialize add User Event
    this.eventDispatcher.newUserAdded();

    // Listen for the app level Events
    this.listenEventDispatcher();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NeighboursPage');
  }
  getAllNeighbours(){
    this.firebase.getNeighbours().then((userData) => {
      this.users = userData;
      console.warn(this.users);
    }, error => {
      console.error(error);
    });
  }

  reinitialiseAllData() {
    var promises = [this.getUserData(), this.getNeighbours(), this.getAllChats()];
    Promise.all(promises).then((values) => {
      this.extractNeighbourData();

      /* this.getUserData();
      console.log('All data reinitialised');
      console.log('Neighbours Data', this.globals.neighboursData); */
      this.users = this.globals.neighboursData;
    }).catch((err) => {
      console.log('Promise.all reinitialised ', err);
    });
  }

  getUserData() {
    var userId = this.globals.userId;
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/users/' + userId);
      var userArr = [];
      dbRef.once('value', (data) => {

        if (data.val() != 'default') {
          userArr = data.val();
          this.globals.userData = userArr;
          // console.warn(this.globals.userData);
          resolve(userArr);
        } else {
          reject({ msg: 'No Users Found' });
        }
      });
    });
  }
  getNeighbours() {
    var userId = this.globals.userId;
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/users/');
      var neighboursArr = [];
      dbRef.once('value', (data) => {

        if (data.val() != 'default') {
          neighboursArr = _.toArray(data.val());
          _.remove(neighboursArr, { 'uId': userId });

          // console.log('neighboursArray ', neighboursArr);
          this.globals.neighboursData = neighboursArr;
          resolve();

        } else {
          reject({ msg: 'No Users Found' });
        }
      });
    });
  }
  getAllChats() {
    return new Promise((resolve, reject) => {
      var userId = this.globals.userId;
      // console.log('User ID ', userId);
      var dbRef = firebase.database().ref('chats').child(userId);
      var chatArr = [];
      dbRef.once('value', (chats) => {
        var chatObj = chats.val();
        for (let chat in chatObj) {
          var chatObjTemp = {};

          chatObjTemp['receiver'] = chat;
          chatObjTemp['messages'] = [];
          if (chatObj.hasOwnProperty(chat)) {
            let chatElement = chatObj[chat];
            // console.log('Chat Eele ', chat, _.toArray(chatElement));

            chatObjTemp['messages'] = _.toArray(chatElement);
          }

          chatArr.push(chatObjTemp);
        }

        this.globals.chats = chatArr;
        resolve();
        // console.log('Chat Arr ', chatArr);
      });
    });
  }

  extractNeighbourData() {
    this.globals.neighboursData
    this.globals.chats

    for (let i = 0; i < this.globals.chats.length; i++) {
      let chat = this.globals.chats[i];
      let receiver = chat.receiver;

      for (let j = 0; j < this.globals.neighboursData.length; j++) {
        let eachNeighbour = this.globals.neighboursData[j];
        let neighbourId = eachNeighbour.uId;
        if (receiver == neighbourId) {
          chat.receiverData = eachNeighbour;

          break;
        }
      }

      // console.log('All Chats Modified ', this.global.chats);
    }
  }

  listenEventDispatcher() {
    // console.log('Listening For Events');
    this.event.subscribe('user:added', () => {
      // alert('New User Added');
      this.reinitialiseAllData();

      // this.event.unsubscribe('user:added');
    });
  }

  goToNeighbour(neighbour){
    this.app.getRootNav().push(MessagePage, { 'neighbour': neighbour });
    // this.navCtrl.push();
  }
  goToBusiness(business){
    this.app.getRootNav().push(BusinessDetailsPage, { 'business': business });
  }

}
