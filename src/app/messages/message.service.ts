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
  messageListChangedEvent = new Subject<Message[]>();

  constructor(private http: HttpClient) {
    this.retrieveMessages();
  }

  retrieveMessages() {
    this.http.get('http://localhost:3000/messages').subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
        this.sortAndSend();
      },
      error: (err) => console.error(err),
      complete: () => console.log('Messages GET complete')
    })
  }

  sortAndSend(){
    this.messages.sort((a, b) => {
      return (+a.id) - (+b.id);
    });
    this.messageListChangedEvent.next(this.messages.slice());
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

  addMessage(newMessage: Message){
      if(!newMessage){return}
  
      newMessage.id = "";
  
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
      this.http.post<{message: String, created: Message}>('http://localhost:3000/messages', newMessage, {headers: headers})
        .subscribe(responseData => {
          this.messages.push(responseData.created);
          this.sortAndSend();
        })
    }
  
    updateMessage(originalMessage: Message, newMessage: Message){
      if(!originalMessage || !newMessage){return}
  
      const pos = this.messages.indexOf(originalMessage);
  
      if(pos < 0){return}
  
      newMessage.id = originalMessage.id;
  
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
      this.http.put(`http://localhost:3000/messages/${originalMessage.id}`, newMessage, {headers: headers})
        .subscribe((response: Response) => {
          this.messages[pos] = newMessage;
          this.sortAndSend();
        });
    }
  
    deleteMessage(message: Message){
      if(!message){return}
  
      const pos = this.messages.indexOf(message);
  
      if(pos < 0){return}
  
      this.http.delete(`http://localhost:3000/messages/${message.id}`)
        .subscribe((response: Response) => {
          this.messages.splice(pos, 1);
          this.sortAndSend();
        })
    }
}
