import { Component, NgZone } from '@angular/core';

import { MessagesListPage } from '../messages-list/messages-list';
import { NeighboursPage } from '../neighbours/neighbours';
import { NewsPage } from '../news/news';
import { MorePage } from '../more/more';

import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { Events } from 'ionic-angular';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = MessagesListPage;
	tab2Root = NeighboursPage;
	tab3Root = NewsPage;
	tab4Root = MorePage;

	unreadMessages: number = 0;
	unreadTabBadge: string = null;
	constructor(private firebase: FirebaseProvider, private globals: GlobalsProvider, public _zone: NgZone, public events: Events) {
		//  console.log('neighbours data from globals- ',this.globals.neighboursData);
		console.log(this.globals.unreadMessages);
		this.listenForEvents();		

		// Update Blocked List
		this.firebase.getUpdatedBlockedMeList();
	}

	listenForEvents() {
		this.events.subscribe('unread:messages', () => {
			this._zone.run(() => {
				this.unreadMessages = this.globals.unreadMessages;
				this.unreadTabBadge = String(this.globals.unreadMessages);
				console.log('Unread Badge ', this.unreadMessages, this.unreadTabBadge);
			});
		});
	}

}