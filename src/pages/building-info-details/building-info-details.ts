import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';
@Component({
  selector: 'page-building-info-details',
  templateUrl: 'building-info-details.html',
})
export class BuildingInfoDetailsPage {
  details: any;
  pdfList:any =[];
  pdfUrl = '';
  storageDirectory: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitize: DomSanitizer, public iab: InAppBrowser, private transfer: FileTransfer, private file: File, public platform: Platform, private document: DocumentViewer, private fileOpener: FileOpener) {
    this.storageDirectory = this.file.externalDataDirectory;
    this.details = this.navParams.get('detail');
    console.log(this.details);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuildingInfoDetailsPage');
  }
  back(){
    this.navCtrl.pop(); 
  }
  openPdf(pdfUrl) {

    // // window.open(pdfUrl, '_system', 'EnableViewPortScale=yes');
    // const browser = this.iab.create(pdfUrl, '_blank', options);
    if (this.platform.is('ios')) {
      const options: InAppBrowserOptions = {
        toolbar: 'yes',
        transitionstyle: 'coververtical',
        hidenavigationbuttons: 'yes',
        location: 'yes',
        presentationstyle: 'pagesheet',
        enableViewportScale: 'yes',
        zoom: 'yes'
      }
    const browser = this.iab.create(pdfUrl, '_blank', options);
    }
    else if (this.platform.is('android')) {
      const fileTransfer: FileTransferObject = this.transfer.create();
      const url = pdfUrl;
      fileTransfer.download(url, this.storageDirectory + 'file.pdf', true, { 'Access-Control-Allow-Origin': '*' }).then((entry) => {
        console.log('download complete: ' + entry.toURL());
        this.fileOpener.open(entry.toURL(), 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch((error) => {
            this.viewDocument(entry.toURL());
          });
      }, (error) => {
        // handle error
      });
    }
    else {
       window.open(pdfUrl, '_system', 'EnableViewPortScale=yes');
    }
  }
  viewDocument(location)
  {
    const options: DocumentViewerOptions = {
      title: 'Building Info'
    }
    this.document.viewDocument(location, 'application/pdf', options);
  }
}
