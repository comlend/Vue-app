import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HouseRulePage } from './house-rule';

@NgModule({
  declarations: [
    HouseRulePage,
  ],
  imports: [
    IonicPageModule.forChild(HouseRulePage),
  ],
})
export class HouseRulePageModule {}
