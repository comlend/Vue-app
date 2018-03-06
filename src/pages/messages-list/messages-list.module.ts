import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesListPage } from './messages-list';

@NgModule({
  declarations: [
    MessagesListPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagesListPage),
  ],
})
export class MessagesListPageModule {}
