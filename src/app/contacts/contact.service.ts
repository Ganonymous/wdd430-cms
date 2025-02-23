import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();

  contacts: Contact[] = [];
  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    let returnVal: Contact = null
    this.contacts.forEach(contact => {
      if(contact.id == id) returnVal = contact;
    });
    return returnVal;
  }

  deleteContact(contact: Contact){
    if(!contact){return}

    const pos = this.contacts.indexOf(contact);

    if(pos < 0){return}

    this.contacts.splice(pos, 1);
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
