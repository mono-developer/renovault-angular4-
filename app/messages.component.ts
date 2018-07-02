import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { Message } from './message.class';

@Component({
  selector: 'messages',
  templateUrl: 'app_html/messages.component.html'
})


export class MessagesComponent implements OnInit {

  constructor(private messageService: MessageService) {
  }

  ngOnInit() {
    this.messages = this.messageService.messages;
  }

  public messages: Array<Message> = [];

  public closeAlert(i: number): void {
    this.messages.splice(i, 1);
  }

}