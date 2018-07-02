import { Component, Input, OnInit, ViewChild } from '@angular/core';
// import { AgmMap } from '@agm/core';

@Component({
  selector: 'googlemap',
  templateUrl: 'app_html/googlemap.component.html',
  styleUrls: ['app_html/googlemap.component.css']
})

export class GooglemapComponent {

  @Input()
  lat: number = 51.678418;

  @Input()
  lon: number = 7.809007;

  // @ViewChild('googleMap')
  // gmap: AgmMap;

  ngOnInit() {
    this.update(this.lat, this.lon);
  }

  public update(lat: number, lon: number) {
    this.lat = parseFloat("" + this.lat);
    this.lon = parseFloat("" + this.lon);
    // this.gmap.triggerResize();
  }

}
