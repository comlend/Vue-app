import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceCenterPage } from './service-center';

@NgModule({
  declarations: [
    ServiceCenterPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceCenterPage),
  ],
})
export class ServiceCenterPageModule {}
