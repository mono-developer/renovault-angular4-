import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

import { ImageService } from './image.service';
import { Image } from './image.class';
import { MessageService } from './message.service';

import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'images',
  templateUrl: 'app_html/images.component.html',
  styleUrls: ['app_html/images.component.css']
})

export class ImagesComponent implements OnInit {

  @Input()
  reference_table: string;

  @Input()
  reference_id: number;

  @Input()
  reference_string: string;

  @Input()
  css_class: string;

  @Input()
  read_only: boolean = false;

  @Input()
  show_info: boolean = true;

  @Input()
  show_download: boolean = true;

  @Input()
  show_rotate: boolean = true;

  @Input()
  show_delete: boolean = true;

  @Output()
  onImagesChanged = new EventEmitter<any>();

  images: Image[];
  filesToUpload: Array<File>;
  modalImage: Image;
  modalImageTitle: string;
  modalViewer: string;
  modalImageUrl: string;
  // modalImageCSSTransform: string;
  uploading: boolean = false;

  @ViewChild('modalWindow') modalWindow: ModalDirective;
  // @ViewChild('modalPdfViewer') modalPdfViewer: PdfViewerComponent;
  // @ViewChild('modalImageViewer') modalImageViewer: any;

  constructor(private imageService: ImageService, private route: ActivatedRoute, private messageService: MessageService) {
    this.filesToUpload = [];
    this.images = [];
  }

  ngOnInit() {
    this.imageService.getImages(this.reference_table, this.reference_id, this.reference_string)
      .then(images => {
        this.images = images;
      });
  }

  onClick(image: Image) {

    if (this.imageService.getImageInternalType(image) != "") {
      this.modalImage = image;
      this.modalViewer = this.imageService.getImageInternalType(image);
      this.modalImageUrl = this.imageService.getImageUrl(image, false);
      // this.modalImageCSSTransform = 'rotate(' + image.rotation + 'deg)';
      this.modalImageTitle = image.name;
      this.modalWindow.show();
    }
    else {
      this.modalImage = null;
      this.modalViewer = ''
      this.modalImageUrl = '';
      this.modalImageTitle = 'Preview van dit bestand is niet mogelijk: ' + image.name + ' [' + image.file_type + ']';
      this.modalWindow.show();
    }

  }

  onDelete(image: Image) {

    if (this.read_only) {
      return;
    }

    this.imageService.deleteImage(image)
      .then((result) => {
        this.images = this.images.filter(h => h !== image);
        this.messageService.sendNotification('Document ' + image.name + ' verwijderd.', '');
        this.onImagesChanged.emit(null);
      })
      .catch((error) => {
        this.messageService.sendMessage('Fout bij verwijderen document.', error);
      });
  }

  onDownload(image: Image) {
  }

  onShowModal(event: any) {
  }

  onHideModal(event: any) {
    this.modalImage = null;
    this.modalViewer = ''
    this.modalImageUrl = '';
  }

  fileChangeEvent(fileInput: any) {

    if (this.read_only) {
      return;
    }

    this.uploading = true;
    this.filesToUpload = <Array<File>>fileInput.target.files;

    this.imageService.getBucketUploadHandler()
      .then((upload_url) => {
        this.makeFileRequest(upload_url, [], this.filesToUpload)
          .then((result) => {
            this.uploading = false;
            this.ngOnInit();
            this.onImagesChanged.emit(null);
          })
          .catch((error) => {
            this.uploading = false;
            this.messageService.sendMessage('Fout bij uploaden document.', error);
          });
      }
      )
      .catch((error) => {
        this.uploading = false;
      });
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    if (this.read_only) {
      return;
    }

    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append("uploads[]", files[i], files[i].name);
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }

      xhr.open("POST", url, true);

      formData.append("reference_table", this.reference_table);
      formData.append("reference_id", this.reference_id);
      formData.append("reference_string", this.reference_string);

      xhr.send(formData);
    });
  }


}