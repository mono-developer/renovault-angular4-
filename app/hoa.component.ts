import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Hoa } from './hoa.class';
import { HoaService } from './hoa.service';
import { ContentService } from './content.service';

@Component({
  selector: 'hoa',
  templateUrl: 'app_html/hoa.component.html'
})

export class HoaComponent implements OnInit {

  @Input()
  hoa: Hoa;

  @Input()
  look: string;

  @Output()
  onDeleteClicked = new EventEmitter<any>();

  isSelected: boolean = false;

  constructor(private router: Router, private hoaService: HoaService, private contentService: ContentService) {
  }

  ngOnInit() {
    this.isSelected = this.hoaService.isHoaSelected(this.hoa);
  }

  goToDetails() {
    let link = ['/hoa', this.hoa.id];
    this.router.navigate(link);
  }

  toggleSelected() {
    this.hoaService.toggleHoaSelection(this.hoa);
    this.isSelected = this.hoaService.isHoaSelected(this.hoa);
  }

  delete(hoa: Hoa): void {
    this.onDeleteClicked.emit(null);
  }

}