import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'cms-contacts',
  standalone: false,
  
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  providers: [ContactService]
})
export class ContactsComponent implements OnInit{
  selectedContact: Contact;

  constructor(private contactService: ContactService){};

  ngOnInit(): void {
    this.contactService.contactSelectedEvent.subscribe(
      (selected: Contact) => {
        this.selectedContact = selected;
      }
    );
  }
}
