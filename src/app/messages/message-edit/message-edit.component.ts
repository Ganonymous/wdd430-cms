import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subject', {static: false}) subjectInputRef: ElementRef;
  @ViewChild('msgText', {static: false}) msgInputRef: ElementRef;

  currentSender = '1';

  constructor(private messageService: MessageService){}

  onSendMessage(){
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgInputRef.nativeElement.value;
    this.messageService.addMessage(new Message('0', subject, msgText, this.currentSender));
  }

  onClear(){
    this.subjectInputRef.nativeElement.value = '';
    this.msgInputRef.nativeElement.value = '';
  }

}
