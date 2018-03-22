// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsProvider {
  userId: any;
  userData: any;
  neighboursData: any;
  FbLoginComplete: boolean = true;
  news: any;
  chats = [];
  fcmToken: string = '';
  cordovaPlatform: boolean = null;
  unreadMessages: number = 0;
  constructor() {
    console.log('Hello GlobalsProvider Provider');
  }

  clear() {
    this.userId = undefined;
    this.userData = undefined;
    this.chats = undefined;
    this.neighboursData = undefined;
    this.cordovaPlatform = undefined;
    this.unreadMessages = undefined;
    this.news = undefined;
  }

}
