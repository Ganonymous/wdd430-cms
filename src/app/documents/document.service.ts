import { Injectable } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId: number;
  documentListChangedEvent = new Subject<Document[]>();

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getMaxId(): number{
    let maxId = 0;

    for(let document of this.documents){
      let currentId = +document.id;
      if(currentId > maxId){ maxId = currentId; }
    }

    return maxId;
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

  addDocument(newDocument: Document){
    if(!newDocument){return}

    this.maxDocumentId++;
    newDocument.id = `${this.maxDocumentId}`;
    this.documents.push(newDocument);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  updateDocument(originalDocument: Document, newDocument: Document){
    if(!originalDocument || !newDocument){return}

    const pos = this.documents.indexOf(originalDocument);

    if(pos < 0){return}

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.documentListChangedEvent.next(this.documents.slice());
  }

  deleteDocument(document: Document){
    if(!document){return}

    const pos = this.documents.indexOf(document);

    if(pos < 0){return}

    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
