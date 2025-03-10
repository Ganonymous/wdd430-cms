import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;
  contacts: Contact[] = [];
  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number{
    let maxId = 0;

    for(let contact of this.contacts){
      const currentId = +contact.id;
      if(currentId > maxId){maxId = currentId}
    }

    return maxId;
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

  addContact(newContact: Contact){
    if(!newContact){return}

    this.maxContactId++;
    newContact.id = `${this.maxContactId}`;
    this.contacts.push(newContact);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  updateContact(originalContact: Contact, newContact: Contact){
    if(!originalContact || !newContact){return}

    const pos = this.contacts.indexOf(originalContact);

    if(pos < 0){return}

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  deleteContact(contact: Contact){
    if(!contact){return}

    const pos = this.contacts.indexOf(contact);

    if(pos < 0){return}

    this.contacts.splice(pos, 1);
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
