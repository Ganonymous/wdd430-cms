import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  maxMessageId: number;
  messageListChangedEvent = new Subject<Message[]>();

  constructor(private http: HttpClient) {
    this.retrieveMessages();
  }

  getMaxId(): number {
    let maxId = 0;

    for(let message of this.messages){
      let currentId = +message.id;
      if(currentId > maxId){maxId = currentId};
    }

    return maxId;
  }

  retrieveMessages() {
    this.http.get('https://wdd430-cms-3aa8c-default-rtdb.firebaseio.com/messages.json').subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messages.sort((a, b) => {
          return (+a.id) - (+b.id);
        });
        this.messageListChangedEvent.next(this.messages.slice());
      },
      error: (err) => console.error(err),
      complete: () => console.log('Messages GET complete')
    })
  }

  storeMessages() {
    const messagesString = JSON.stringify(this.messages);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://wdd430-cms-3aa8c-default-rtdb.firebaseio.com/messages.json', messagesString, {headers}).subscribe({
      next: () => this.messageListChangedEvent.next(this.messages.slice()),
      error: (err) => console.error(err),
      complete: () => console.log('Document PUT complete')
    })
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
    if(!message) return;

    this.maxMessageId++;
    message.id = `${this.maxMessageId}`
    this.messages.push(message);
    this.storeMessages();
  }
}
