import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter',
  standalone: false
})
export class ContactsFilterPipe implements PipeTransform {

  transform(contacts: Contact[], term: string): unknown {
    let filtered: Contact[] = [];

    if (term && term.length > 0){
      filtered = contacts.filter(
        contact => contact.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (filtered.length < 1){return contacts}
    return filtered;
  }

}
