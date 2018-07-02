import { Bean } from './bean.class';

export class Party implements Bean {

  getTable(): string {
    return 'party';
  }

  getId(): number {
    return this.id;
  }

  getGranteerole(): string {
    throw new Error("Cannot getGranteerole from Party...");
  }

  setGranteerole(r: string) {
    throw new Error("Cannot setGranteerole on Party...");
  }

  id: number;
  partytype: string;
  displayname: string;
  title: string;
  firstname: string;
  infixname: string;
  lastname: string;
  companykvknumber: string;
  companyname: string;
  postalcode: string;
  housenumber: string;
  housenumberadd: string;
  street: string;
  city: string;
  email: string;
  phone: string;
  bankaccount: string;

  public getDisplayString(): string {
    return this.displayname;
  }

  public getDisplayHTML(): string {
    var s: string;
    s = this.getDisplayString();
    s = this.escapeHtml(s);
    return s;
  }

  public static parse(parsedJsonObject: any): Party {
    var p: Party = new Party();

    p.id = parsedJsonObject.id;
    p.partytype = parsedJsonObject.partytype;
    p.displayname = parsedJsonObject.displayname;
    p.title = parsedJsonObject.title;
    p.firstname = parsedJsonObject.firstname;
    p.infixname = parsedJsonObject.infixname;
    p.lastname = parsedJsonObject.lastname;
    p.companykvknumber = parsedJsonObject.companykvknumber;
    p.companyname = parsedJsonObject.companyname;
    p.postalcode = parsedJsonObject.postalcode;
    p.housenumber = parsedJsonObject.housenumber;
    p.housenumberadd = parsedJsonObject.housenumberadd;
    p.street = parsedJsonObject.street;
    p.city = parsedJsonObject.city;
    p.email = parsedJsonObject.email;
    p.phone = parsedJsonObject.phone;
    p.bankaccount = parsedJsonObject.bankaccount;

    return p;
  }

  private escapeHtml(s: string) {
    s = s.replace('&', '&amp;');
    s = s.replace('<', '&lt;');
    s = s.replace('>', '&gt;');
    s = s.replace('"', '&quot;');
    s = s.replace("'", '&#39;');
    s = s.replace('/', '&#x2F;');
    s = s.replace('`', '&#x60;');
    s = s.replace('=', '&#x3D;');

    return s;
  }

}