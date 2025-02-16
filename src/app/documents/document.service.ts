import { EventEmitter, Injectable } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];

  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }
  
  getDocument(id: string): Document {
    let returnVal: Document = null;
    this.documents.forEach(document => {
      if(document.id == id) returnVal = document;
    });
    return returnVal;
  }

  deleteDocument(document: Document){
    if(!document){return}

    const pos = this.documents.indexOf(document);

    if(pos < 0){return}

    this.documents.splice(pos, 1);
    this.documentChangedEvent.emit(this.documents.slice());
  }
}
