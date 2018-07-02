import { Bean } from './bean.class';

export class Hoa implements Bean {
  id: number;
  postalcode: string;
  housenumber: string;
  housenumberadd: string;
  street: string;
  city: string;
  lat: number;
  lon: number;
  lookupdone: boolean;
  bagurl: string;
  houseparts: any[];
  housepartsexcluded: any[];
  tagfilterselection: string;
  tagfiltertags: string[];
  tagfiltertag: string;
  granteerole: string;
  // owner: string;
  // ownersinceyear: string;
  // objecttype: string;
  // objectsubtype: string;
  // objectposition: string;
  constructionyear: string;
  // livingsurface: string;
  // volume: string;
  // outsidesurface: string;
  // lotsurface: string;
  // nooffloors: string;
  // noofrooms: string;
  // noofwetrooms: string;
  // noofbasements: string;
  // noofbalconies: string;
  // familyadults: string;
  // familychildren: string;
  goals: string;
  securityid: number;

  public getTable(): string {
    return 'hoa';
  }

  public getId(): number {
    return this.id;
  }

  public getGranteerole(): string {
    return this.granteerole;
  }

  public setGranteerole(r: string) {
    this.granteerole = r;
  }

  public getAddressDescription(): string {
    let street = '';
    let housenumber = '';
    let housenumberadd = '';

    if (this.street != null) {
      street = this.street;
    }
    if (this.housenumber != null) {
      housenumber = this.housenumber;
    }
    if (this.housenumberadd != null) {
      housenumberadd = this.housenumberadd;
    }

    let d: string = street + ' ' + housenumber + ' ' + housenumberadd;
    d = d.trim();
    return d;
  }

  public getDisplayString() {
    return this.getAddressDescription();
  }

  public hasAddress(): boolean {
    return this.getAddressDescription().length > 0;
  }


  public static parse(parsedJsonObject: any): Hoa {
    var p: Hoa = new Hoa();

    p.id = parsedJsonObject.id;
    p.postalcode = parsedJsonObject.postalcode;
    p.housenumber = parsedJsonObject.housenumber;
    p.housenumberadd = parsedJsonObject.housenumberadd;
    p.street = parsedJsonObject.street;
    p.city = parsedJsonObject.city;
    p.lat = parsedJsonObject.lat;
    p.lon = parsedJsonObject.lon;
    p.lookupdone = parsedJsonObject.lookupdone;
    p.bagurl = parsedJsonObject.bagurl;
    p.houseparts = parsedJsonObject.houseparts;
    p.housepartsexcluded = parsedJsonObject.housepartsexcluded;
    p.tagfilterselection = parsedJsonObject.tagfilterselection;
    p.tagfiltertags = parsedJsonObject.tagfiltertags;
    p.tagfiltertag = parsedJsonObject.tagfiltertag;
    p.granteerole = parsedJsonObject.granteerole;
    // p.owner = parsedJsonObject.owner;
    // p.ownersinceyear = parsedJsonObject.ownersinceyear;
    // p.objecttype = parsedJsonObject.objecttype;
    // p.objectsubtype = parsedJsonObject.objectsubtype;
    // p.objectposition = parsedJsonObject.objectposition;
    p.constructionyear = parsedJsonObject.constructionyear;
    // p.livingsurface = parsedJsonObject.livingsurface;
    // p.volume = parsedJsonObject.volume;
    // p.outsidesurface = parsedJsonObject.outsidesurface;
    // p.lotsurface = parsedJsonObject.lotsurface;
    // p.nooffloors = parsedJsonObject.nooffloors;
    // p.noofrooms = parsedJsonObject.noofrooms;
    // p.noofwetrooms = parsedJsonObject.noofwetrooms;
    // p.noofbasements = parsedJsonObject.noofbasements;
    // p.noofbalconies = parsedJsonObject.noofbalconies;
    // p.familyadults = parsedJsonObject.familyadults;
    // p.familychildren = parsedJsonObject.familychildren;
    p.goals = parsedJsonObject.goals;
    p.securityid = parsedJsonObject.securityid;

    return p;
  }

}