import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageListChangedEvent = new Subject<Message[]>();

  constructor() {
    this.messages = MOCKMESSAGES;
  }

  getMessages(): Message[] {
      return this.messages.slice();
  }
    
  getMessage(id: string): Message {
    let returnVal: Message = null;
    this.messages.forEach(message => {
      if(message.id == id) returnVal = message;
    });
    return returnVal;
  }

  addMessage(message: Message){
    this.messages.push(message);
    this.messageListChangedEvent.next(this.messages.slice());
  }
}
