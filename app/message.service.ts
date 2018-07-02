import { Injectable } from '@angular/core';
import { Message } from './message.class'

@Injectable()
export class MessageService {

	public messages: Message[];

	constructor() {
		this.messages = new Array();
	}

	sendMessage(message: string, moreInfo: string) {
		let m = new Message();
		m.type = "warning";
		m.closable = true;
		m.message = message;
		m.moreInfo = moreInfo;
		m.dismissTimeout = 5000;

		this.messages.push(m);
		console.log(m.message);
		console.log(m.moreInfo);
	}

	sendNotification(message: string, moreInfo: string) {
		let m = new Message();
		m.type = "info";
		m.closable = true;
		m.message = message;
		m.moreInfo = moreInfo;
		m.dismissTimeout = 0;

		this.messages.push(m);
		console.log(m.moreInfo);

	}
}