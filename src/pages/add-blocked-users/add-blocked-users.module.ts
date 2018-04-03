import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBlockedUsersPage } from './add-blocked-users';

@NgModule({
  declarations: [
    AddBlockedUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBlockedUsersPage),
  ],
})
export class AddBlockedUsersPageModule {}
