import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;
  contacts: Contact[] = [];

  constructor(private http: HttpClient) {
    this.retrieveContacts();
  }

  getMaxId(): number{
    let maxId = 0;

    for(let contact of this.contacts){
      const currentId = +contact.id;
      if(currentId > maxId){maxId = currentId}
    }

    return maxId;
  }

  retrieveContacts(){
    this.http.get('https://wdd430-cms-3aa8c-default-rtdb.firebaseio.com/contacts.json').subscribe({
      next: (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => {
          let aName = a.name.toLowerCase();
          let bName = b.name.toLowerCase();
          if(aName == bName){return 0}
          return aName < bName ? -1 : 1
        });
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (err) => console.error(err),
      complete: () => console.log('Contacts GET complete')
    })
  }

  storeContacts() {
    const contactsString = JSON.stringify(this.contacts);
    const putHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://wdd430-cms-3aa8c-default-rtdb.firebaseio.com/contacts.json', contactsString, {headers: putHeaders}).subscribe({
      next: () => this.contactListChangedEvent.next(this.contacts.slice()),
      error: (err) => console.error(err),
      complete: () => console.log('Contacts PUT complete')
    })
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
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact){
    if(!originalContact || !newContact){return}

    const pos = this.contacts.indexOf(originalContact);

    if(pos < 0){return}

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact){
    if(!contact){return}

    const pos = this.contacts.indexOf(contact);

    if(pos < 0){return}

    this.contacts.splice(pos, 1);
    this.storeContacts();
  }
}
