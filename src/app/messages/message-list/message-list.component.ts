import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(0, 'Hello World', 'This is the first message', 'Everyone'),
    new Message(1, 'Welcome to Class!', 'Welcome to the class, everyone!', 'David Del Sol'),
    new Message(2, 'What is foo/bar?', 'All the tutorials keep calling this "foo" function, what does it do?', 'Connie Confusion')
  ];

  onAddMessage(message: Message){
    this.messages.push(message);
  }
}
