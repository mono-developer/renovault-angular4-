import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Party } from './party.class';
import { BeanService } from './bean.service';
import { MessageService } from './message.service';
import { PartyAccountService } from './partyaccount.service';

@Injectable()
export class PartyService extends BeanService {

    protected apiName = 'party';
    private parties: Party[] = null;

    constructor(protected http: Http, protected messageService: MessageService, protected partyAccountService: PartyAccountService) {
        super(http, messageService);
    }

    getApiName(): string {
        return this.apiName;
    }

    getParties(): Promise<Party[]> {
        if (this.parties == null) {
            return this.http.get(this.getApiUrl())
                .toPromise()
                .then(response => {
                    return response.json().data as Party[];
                })
                .then(beans => {
                    this.parties = Array();

                    beans.forEach(value => {
                        this.parties.push(Party.parse(value));
                    });

                    return this.partyAccountService.getSignedInParty()
                        .then(sip => {
                            this.parties = this.parties.filter(p => p.id != sip.id);
                            return this.parties;
                        });
                });
        }
        else {
            return Promise.resolve(this.parties);
        }
    }

    getParty(id: number): Promise<Party> {
        return this.getParties()
            .then(parties => parties.find(party => party.id == id))
            .catch((error: any) => this.handleError(error));
    }

    getPartyByEmail(email: string): Promise<Party> {
        return this.getParties()
            .then(parties => parties.find(party => {
                if (party.email != undefined && party.email != null && email != undefined && email != null) {
                    return party.email.toLowerCase() == email.toLowerCase();
                }
                return false;
            }
            ))
            .catch((error: any) => this.handleError(error));
    }

    addNewParty(): Promise<Party> {
        var p: Party = new Party();
        return this.http.post(this.getApiUrl(), JSON.stringify(p), this.options)
            .toPromise()
            .then((p: any) => {
                let party: Party = Party.parse(p.json().data);
                return this.getParties().then(parties => {
                    this.parties.push(party);
                    return party;
                })
            })
            .catch((error: any) => this.handleError(error));
    }

    updateParty(p: Party): Promise<Party> {
        const url = `${this.getApiUrl()}/${p.id}`;

        return this.getPartyByEmail(p.email)
            .then(sameParty => {
                if (sameParty == undefined || sameParty.id == p.id) {
                    return this.http
                        .post(url, JSON.stringify(p), this.options)
                        .toPromise()
                        .then((response: Response) => {

                            let o = response.json().data;
                            return this.getParties()
                                .then(parties => {
                                    let index = parties.findIndex(party => {
                                        return party.id == o.id;
                                    });
                                    this.parties[index] = Party.parse(o);
                                    return o;
                                });
                        })
                }
                else {
                    throw new Error("Een contact met emailadres " + p.email + " bestaat reeds.");
                }
            })
            .catch((error: any) => this.handleError(error));
    }

    deleteParty(party: Party): Promise<Party> {
        const url = `${this.getApiUrl()}/${party.id}`;

        return this.http
            .delete(url, this.options)
            .toPromise()
            .then(p => {
                this.parties = this.parties.filter(o => o.id !== party.id);
                return Party.parse(p);
            });
    }

}
