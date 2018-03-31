import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';

import { IonicStorageModule } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { SplashPage } from '../pages/splash/splash';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RegisterBusinessPage } from '../pages/register-business/register-business';
import { RegisterRentingPage } from '../pages/register-renting/register-renting';
import { RegisterOwnerPage } from '../pages/register-owner/register-owner';
import { FbprofilePage } from '../pages/fbprofile/fbprofile';
import { MessagePage } from '../pages/message/message';
import { MessagesListPage } from '../pages/messages-list/messages-list';
import { NeighboursPage } from '../pages/neighbours/neighbours';
import { NewsPage } from '../pages/news/news';
import { BusinessDetailsPage } from '../pages/business-details/business-details';
import { AddNewsPage } from '../pages/add-news/add-news';
import { NewsDetailsPage } from '../pages/news-details/news-details';
import { MorePage } from '../pages/more/more';
import { BuildingInfoPage } from '../pages/building-info/building-info';
import { ServiceCenterPage } from '../pages/service-center/service-center';
import { LiveLocalPage } from '../pages/live-local/live-local';
import { SettingsPage } from '../pages/settings/settings';
import { AddLocalPage } from '../pages/add-local/add-local';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirebaseProvider } from '../providers/firebase/firebase';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook'
import { GlobalsProvider } from '../providers/globals/globals';
import { FCM } from '@ionic-native/fcm';
import { HttpClientModule } from '@angular/common/http';
import { EventDispatcherProvider } from '../providers/event-dispatcher/event-dispatcher';

import { PipesModule } from '../pipes/pipes.module';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { TncPage } from '../pages/tnc/tnc';
import { BuildingInfoDetailsPage } from '../pages/building-info-details/building-info-details';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/profile';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    SplashPage,
    SignupPage,
    LoginPage,
    RegisterPage,
    RegisterBusinessPage,
    RegisterRentingPage,
    RegisterOwnerPage,
    FbprofilePage,
    MessagePage,
    NeighboursPage,
    NewsPage,
    MessagesListPage,
    BusinessDetailsPage,
    AddNewsPage,
    NewsDetailsPage,
    MorePage,
    BuildingInfoPage,
    ServiceCenterPage,
    LiveLocalPage,
    SettingsPage,
    AddLocalPage,
    EditProfilePage,
    TncPage,
    BuildingInfoDetailsPage,
    ProfilePage,
    NotificationsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { mode: 'ios', autoFocusAssist: true }),
    HttpModule,
    IonicStorageModule.forRoot(),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    SplashPage,
    SignupPage,
    LoginPage,
    RegisterPage,
    RegisterBusinessPage,
    RegisterRentingPage,
    RegisterOwnerPage,
    FbprofilePage,
    MessagePage,
    NeighboursPage,
    NewsPage,
    MessagesListPage,
    BusinessDetailsPage,
    AddNewsPage,
    NewsDetailsPage,
    MorePage,
    BuildingInfoPage,
    ServiceCenterPage,
    LiveLocalPage,
    SettingsPage,
    AddLocalPage,
    EditProfilePage,
    TncPage,
    BuildingInfoDetailsPage,
    NotificationsPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    FirebaseProvider,
    Facebook,
    GlobalsProvider,
    FCM,
    EventDispatcherProvider
  ]
})
export class AppModule {}
