import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { AddNewsPage } from '../add-news/add-news';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { NewsDetailsPage } from '../news-details/news-details';
import { MessagePage } from '../message/message';

import * as _ from 'lodash';

@IonicPage()
@Component({
	selector: 'page-news',
	templateUrl: 'news.html',
})
export class NewsPage {
	news: any;
	searchQuery: string = '';
	userId: any;
	liked: boolean = false;
	commentsLength: any;
	commentsArr = [];

	constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public firebase: FirebaseProvider, public global: GlobalsProvider, public events: Events, public zone: NgZone) {
		
		this.initializeData();

		this.events.subscribe('newsupdated', () => {
			this.zone.run(() => {
				this.news = this.global.news;
			});
		});


	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NewsPage');
	}

	initializeData() {
		this.userId = this.global.userId;
		this.news = this.global.news;

		this.handleAlreadyLikedPosts();

	}

	addNews() {
		this.app.getRootNav().push(AddNewsPage);
	}

	newsDetails(newsData) {
		this.app.getRootNav().push(NewsDetailsPage, { 'news': newsData });
	}

	goToMessage(newsData) {
		this.app.getRootNav().push(MessagePage, { 'neighbour': newsData });
	}

	addLike(newsData) {		
		newsData.postLiked = true;
		/* this.zone.run(() => {
			newsData.postLiked = true;
			console.log(newsData);
		}); */
	
		var userId = this.global.userId;
		var previousLikesArr = _.toArray(newsData.likes);
		var userAlreadyLiked = _.find(previousLikesArr, { 'uId': userId });
		if (userAlreadyLiked) {			
			console.log('Post Already Liked');
		} else {
			// newsData.postLiked = false;
			// console.log('User Id ', this.global.userId, previousLikesArr, newsData);
			this.firebase.addLikeToNews(this.global.userData, newsData).then((data) => {
				// console.log('like added');
				newsData.postLiked = true;
			});
		}
	}

	removeLike(news) {
		news.postLiked = false;
		var userId = this.global.userId;
		var like = _.find(news.likes, { 'uId': userId });
		console.log('Remove Like ', like.id);
		this.firebase.removeLikesFromNews(news, like).then();
	}

	handleAlreadyLikedPosts() {
		var userId = this.global.userId;
		
		for (let i = 0; i < this.news.length; i++) {
			var eachNews = this.news[i];
			var previousLikesArr = _.toArray(eachNews.likes);

			var userAlreadyLiked = _.find(previousLikesArr, { 'uId': userId });
			if (userAlreadyLiked) {
				eachNews.postLiked = true;
				// console.log('Post Already Liked');
			} else {
				eachNews.postLiked = false;
			}			
		}

		console.log('Likes Handled ', this.news);
	}


}
