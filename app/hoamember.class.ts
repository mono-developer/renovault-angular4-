export class HoaMember {
    id: number;
    hoaid: number;
    objectid: number;
    objectdisplaystring: string;
    ownerpartyid: number;
    ownerpartydisplaystring: string;
    ownerpartyemail: string;


    public static parse(parsedJsonObject: any): HoaMember {

        var p: HoaMember = new HoaMember();

        p.id = parsedJsonObject.id;
        p.hoaid = parsedJsonObject.hoaid;
        p.objectid = parsedJsonObject.objectid;
        p.objectdisplaystring = parsedJsonObject.objectdisplaystring;
        p.ownerpartyid = parsedJsonObject.ownerpartyid;
        p.ownerpartydisplaystring = parsedJsonObject.ownerpartydisplaystring;
        p.ownerpartyemail = parsedJsonObject.ownerpartyemail;

        return p;
    }
}