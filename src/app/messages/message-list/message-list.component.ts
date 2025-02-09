import { Component, makeStateKey, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
  providers: [MessageService]
})
export class MessageListComponent implements OnInit{
  messages: Message[] = [];

  constructor(private messageService: MessageService){};

  ngOnInit(): void {
    this.messages = this.messageService.getMessages();
    this.messageService.messageChangedEvent.subscribe(
      (newMessages) => {
        this.messages = newMessages;
      }
    )
  }

  onAddMessage(message: Message){
    this.messages.push(message);
  }
}
