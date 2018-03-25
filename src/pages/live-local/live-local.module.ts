import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LiveLocalPage } from './live-local';

@NgModule({
  declarations: [
    LiveLocalPage,
  ],
  imports: [
    IonicPageModule.forChild(LiveLocalPage),
  ],
})
export class LiveLocalPageModule {}
