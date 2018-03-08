import { Component } from '@angular/core';

import { MessagesListPage } from '../messages-list/messages-list';
import { NeighboursPage } from '../neighbours/neighbours';
import { NewsPage } from '../news/news'; 

import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MessagesListPage;
  tab2Root = NeighboursPage;
  tab3Root = NewsPage;
  tab4Root = NewsPage;

  constructor(private firebase: FirebaseProvider, private globals: GlobalsProvider) {
  }

}
