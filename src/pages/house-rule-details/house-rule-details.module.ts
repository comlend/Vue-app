import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HouseRuleDetailsPage } from './house-rule-details';

@NgModule({
  declarations: [
    HouseRuleDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(HouseRuleDetailsPage),
  ],
})
export class HouseRuleDetailsPageModule {}
