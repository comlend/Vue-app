import { Component } from '@angular/core';

import { MessagePage } from '../message/message';
import { NeighboursPage } from '../neighbours/neighbours';
import { NewsPage } from '../news/news';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MessagePage;
  tab2Root = NeighboursPage;
  tab3Root = NewsPage;
  tab4Root = NewsPage;

  constructor() {

  }
}
