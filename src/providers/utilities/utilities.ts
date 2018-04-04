import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalsProvider } from '../globals/globals';

import * as _ from 'lodash';

@Injectable()
export class UtilitiesProvider {

	constructor(public http: HttpClient, public globals: GlobalsProvider) {
		console.log('Hello UtilitiesProvider Provider');
	}

	filterBlockedMeUsers() {
		var blockedMe = this.globals.userData.blockedMe;

		var neighbours = _.cloneDeep(this.globals.neighboursData);
		var extracted = [];

		if (blockedMe != 'default') {
			var blockedMeUsers = _.toArray(blockedMe);

			// console.log('Run Blocked Me', blockedMeUsers, this.globals.neighboursData);

			_.map(blockedMeUsers, (user) => {
				// console.log('Blocked Me Users => ', user.id);
				extracted.push(_.find(neighbours, { 'uId': user.id }));
			});
			this.globals.blockedByMe = extracted;
			// console.log('Blocked Me => ', extracted);
			
		}
	}

	filterBlockedByMeUsers() {
		var iBlocked = this.globals.userData.blockedByMe;

		var neighbours = _.cloneDeep(this.globals.neighboursData);
		var extracted = [];

		if (iBlocked != 'default') {
			var iBlockedUsers = _.toArray(iBlocked);
			// console.log('Run Blocked I', iBlockedUsers, this.globals.neighboursData);

			_.map(iBlockedUsers, (user) => {
				// console.log('Blocked By Me Users => ', user.id);
				extracted.push(_.find(neighbours, { 'uId': user.id }));
			});

			this.globals.blockedByMe = extracted;

			// console.log('Blocked By Me => ', extracted);
			
		}
	}

}
