export class PartyAccount {
  id: number;
  partyid: number;
  login: string;
  password: string;
  multipleobjects: boolean;
  language: string;

  constructor() {
    this.multipleobjects = false;
  }

  public static parse(parsedJsonObject: any): PartyAccount {
    if (parsedJsonObject != null) {
      if (parsedJsonObject.multipleobjects != 0) {
        parsedJsonObject.multipleobjects = true;
      }
      else {
        parsedJsonObject.multipleobjects = false;
      }
    }
    return parsedJsonObject;
  }
}