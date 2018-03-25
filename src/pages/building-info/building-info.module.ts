import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingInfoPage } from './building-info';

@NgModule({
  declarations: [
    BuildingInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingInfoPage),
  ],
})
export class BuildingInfoPageModule {}
