import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { ActivatedRoute, Params } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

import { ImageService } from './image.service';
import { Image } from './image.class';
import { MessageService } from './message.service';

import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'image',
  templateUrl: 'app_html/image.component.html',
  styleUrls: ['app_html/image.component.css'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('0', style({ transform: 'rotate(0)' })),
      state('90', style({ transform: 'rotate(90deg)' })),
      state('180', style({ transform: 'rotate(180deg)' })),
      state('270', style({ transform: 'rotate(270deg)' })),
      transition('0 => 90', animate('400ms ease-in')),
      transition('90 => 180', animate('400ms ease-in')),
      transition('180 => 270', animate('400ms ease-in')),
      transition('270 => 0', animate('400ms ease-in'))
    ])
  ]

})

export class ImageComponent implements OnInit {

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
  onClick = new EventEmitter<any>();

  @Output()
  onDelete = new EventEmitter<any>();

  @Output()
  onDownload = new EventEmitter<any>();

  @Output()
  onRotate = new EventEmitter<any>();

  @Input()
  image: Image;

  rotatedState: string = '0';

  constructor(private imageService: ImageService, private route: ActivatedRoute, private messageService: MessageService) {
  }

  ngOnInit() {
    if (this.image.rotation) {
      this.rotatedState = '' + this.image.rotation;
    }
  }

  onClickHandler(image: Image) {
    this.onClick.emit(null);
  }

  onDeleteHandler(image: Image) {
    this.onDelete.emit(null);
  }

  onDownloadHandler(image: Image) {
    this.onDownload.emit(null);

  }

  onRotateHandler(image: Image) {
    let rotatedDegrees: number = Number.parseInt(this.rotatedState);
    rotatedDegrees += 90;
    rotatedDegrees = rotatedDegrees % 360;
    this.rotatedState = '' + rotatedDegrees;
    this.image.rotation = this.rotatedState;

    this.imageService.updateImage(this.image);

    this.onRotate.emit(null);
  }
}