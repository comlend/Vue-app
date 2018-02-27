import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NeighboursPage } from './neighbours';

@NgModule({
  declarations: [
    NeighboursPage,
  ],
  imports: [
    IonicPageModule.forChild(NeighboursPage),
  ],
})
export class NeighboursPageModule {}
