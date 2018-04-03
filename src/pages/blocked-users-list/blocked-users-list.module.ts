import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlockedUsersListPage } from './blocked-users-list';

@NgModule({
  declarations: [
    BlockedUsersListPage,
  ],
  imports: [
    IonicPageModule.forChild(BlockedUsersListPage),
  ],
})
export class BlockedUsersListPageModule {}
