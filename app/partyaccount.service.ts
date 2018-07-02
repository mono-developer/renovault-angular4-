import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { PartyAccount } from './partyaccount.class';
import { Party } from './party.class';
import { BeanService } from './bean.service';
import { MessageService } from './message.service';

@Injectable()
export class PartyAccountService extends BeanService {

	protected apiName = 'partyaccount';
	private parties: PartyAccount[];
	public signedInPartyAccount: PartyAccount = null;
	public signedInParty: Party = null;
	public redirectUrl: string;


	constructor(protected http: Http, protected messageService: MessageService) {
		super(http, messageService);
		this.forceUpdate();
	}

	private forceUpdate() {
		this.getSignedInPartyAccount()
			.then(pa => {
				this.signedInPartyAccount = pa;
			})
			.catch((error: any) => this.handleError(error));

		this.getSignedInParty()
			.then(p => {
				this.signedInParty = p;
			})
			.catch((error: any) => this.handleError(error));
	}

	getApiName(): string {
		return this.apiName;
	}

	getPartyAccounts(): Promise<PartyAccount[]> {
		if (this.parties == null) {
			return this.getBeans();
		}
		else {
			return Promise.resolve(this.parties);
		}
	}

	getPartyAccount(id: number): Promise<PartyAccount> {
		return this.getPartyAccounts()
			.then(parties => parties.find(party => party.id == id))
			.catch((error: any) => this.handleError(error));
	}

	getSignedInPartyAccount(): Promise<PartyAccount> {
		return this.http.get(this.getApiUrl() + '/signedInPartyAccount')
			.toPromise()
			.then(response => {
				let p: PartyAccount;
				p = PartyAccount.parse(response.json().data);
				this.signedInPartyAccount = p;
				return this.signedInPartyAccount;
			})
			.catch((error: any) => this.handleError(error));
	}

	getSignedInParty(): Promise<Party> {
		return this.http.get(this.getApiUrl() + '/signedInParty')
			.toPromise()
			.then(response => {
				let p: Party;
				p = response.json().data;
				this.signedInParty = p;
				return this.signedInParty;
			})
			.catch((error: any) => this.handleError(error));
	}

	getPartyAccountIsSignedIn(): Promise<boolean> {
		return this.getSignedInPartyAccount()
			.then(p => {
				return this.signedInPartyAccount != null;
			})
			.catch((error: any) => this.handleError(error));
	}

	signOut() {
		return this.http.post(this.getApiUrl() + '/signOut', {}, this.options)
			.toPromise()
			.then(response => {
				this.forceUpdate();
				return true;
			})
			.catch((error: any) => this.handleError(error));
	}

	signIn(login: string, password: string) {
		let signInParty: PartyAccount = new PartyAccount();

		signInParty.login = login;
		signInParty.password = password;

		return this.http.post(this.getApiUrl() + '/signIn', JSON.stringify(signInParty), this.options)
			.toPromise()
			.then(response => {
				this.forceUpdate();
				return response.json().data;
			})
			.catch((error: any) => this.handleError(error));
	}

	register(login: string, password: string) {
		let p: PartyAccount = new PartyAccount();

		p.login = login;
		p.password = password;

		return this.http.post(this.getApiUrl() + '/register', JSON.stringify(p), this.options)
			.toPromise()
			.then(response => {
				return response.json().data;
			})
			.catch((error: any) => this.handleError(error));
	}

	confirmRegistration(email: string, confirmationcode: string) {
		return this.http.post(this.getApiUrl() + '/confirmregistration/' + email + '/' + confirmationcode, JSON.stringify({}), this.options)
			.toPromise()
			.then(response => {
				return response.json().data;
			})
			.catch((error: any) => this.handleError(error));
	}

	changePassword(oldpassword: string, newpassword: string) {
		let p: any = {};

		p.oldpassword = oldpassword;
		p.newpassword = newpassword;

		return this.http.post(this.getApiUrl() + '/changePassword', JSON.stringify(p), this.options)
			.toPromise()
			.then(response => {
				return response.json().data;
			})
			.catch((error: any) => this.handleError(error));
	}

	updatePartyAccount(party: PartyAccount): Promise<PartyAccount> {
		const url = `${this.getApiUrl()}/${party.id}`;

		return this.http
			.post(url, JSON.stringify(party), this.options)
			.toPromise()
			.then(response => response.json().data)
			.catch((error: any) => this.handleError(error));
	}

	forgotPassword(email: string): any {
		let p: any = {};

		p.email = email;

		return this.http.post(this.getApiUrl() + '/forgotpassword', JSON.stringify(p), this.options)
			.toPromise()
			.then(response => {
				return response.json().data;
			})
			.catch((error: any) => this.handleError(error));
	}

	restorePassword(restoreConfirmationCode: string, restorePasswordEmail: string, restorePassword: string): any {
		let p: any = {};

		p.restoreConfirmationCode = restoreConfirmationCode;
		p.restorePasswordEmail = restorePasswordEmail;
		p.restorePassword = restorePassword;
		return this.http.post(this.getApiUrl() + '/restorepassword', JSON.stringify(p), this.options)
			.toPromise()
			.then(response => {
				return response.json().data;
			})
			.catch((error: any) => this.handleError(error));
	}

}
