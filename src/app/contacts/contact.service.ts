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
  contacts: Contact[] = [];

  constructor(private http: HttpClient) {
    this.retrieveContacts();
  }


  retrieveContacts(){
    this.http.get('http://localhost:3000/contacts').subscribe({
      next: (contacts: Contact[]) => {
        this.contacts = contacts;
        this.sortAndSend();        
      },
      error: (err) => console.error(err),
      complete: () => console.log('Contacts GET complete')
    })
  }

  sortAndSend() {
    this.contacts.sort((a, b) => {
      let aName = a.name.toLowerCase();
      let bName = b.name.toLowerCase();
      if(aName == bName){return 0}
      return aName < bName ? -1 : 1
    });
    this.contactListChangedEvent.next(this.contacts.slice());
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

    newContact.id = "";
    
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post<{message: string, contact: Contact}>('http://localhost:3000/contacts', newContact, {headers: headers})
      .subscribe(responseData => {
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      })
  }

  updateContact(originalContact: Contact, newContact: Contact){
    if(!originalContact || !newContact){return}

    const pos = this.contacts.indexOf(originalContact);

    if(pos < 0){return}

    newContact.id = originalContact.id;
    
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put(`http://localhost:3000/contacts/${originalContact.id}`, newContact, {headers: headers})
      .subscribe((response: Response) => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      })
  }

  deleteContact(contact: Contact){
    if(!contact){return}

    const pos = this.contacts.indexOf(contact);

    if(pos < 0){return}

    this.http.delete(`http://localhost:3000/contacts/${contact.id}`)
      .subscribe((response: Response) => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      })
  }
}
