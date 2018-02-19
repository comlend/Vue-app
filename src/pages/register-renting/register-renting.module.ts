import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterRentingPage } from './register-renting';

@NgModule({
  declarations: [
    RegisterRentingPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterRentingPage),
  ],
})
export class RegisterRentingPageModule {}
