import { Component } from '@angular/core';

import { MessagesListPage } from '../messages-list/messages-list';
import { NeighboursPage } from '../neighbours/neighbours';
import { NewsPage } from '../news/news'; 

// import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MessagesListPage;
  tab2Root = NeighboursPage;
  tab3Root = NewsPage;
  tab4Root = NewsPage;

  unreadMessages: number = 0;
  unreadTabBadge: string = null;
  constructor(/* private firebase: FirebaseProvider,  */private globals: GlobalsProvider) {
  //  console.log('neighbours data from globals- ',this.globals.neighboursData);
    console.log(this.globals.unreadMessages);
   this.unreadMessages = this.globals.unreadMessages;
    this.unreadTabBadge = String(this.globals.unreadMessages);
    console.log('Unread Badge ', this.unreadMessages, this.unreadTabBadge);
  }

}
