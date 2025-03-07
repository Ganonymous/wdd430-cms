import { Injectable } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId: number;
  documentListChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) {
    this.retrieveDocuments();
  }

  getMaxId(): number{
    let maxId = 0;

    for(let document of this.documents){
      let currentId = +document.id;
      if(currentId > maxId){ maxId = currentId; }
    }

    return maxId;
  }

  retrieveDocuments() {
    this.http.get('https://wdd430-cms-3aa8c-default-rtdb.firebaseio.com/documents.json').subscribe({
      next: (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => {
          let aName = a.name.toLowerCase();
          let bName = b.name.toLowerCase();
          if(aName == bName){return 0}
          return aName < bName ? -1 : 1
        });
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (err) => console.error(err),
      complete: () => console.log('Document GET complete')
    })
  }

  storeDocuments(){
    const docString = JSON.stringify(this.documents);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://wdd430-cms-3aa8c-default-rtdb.firebaseio.com/documents.json', docString, {headers}).subscribe({
      next: () => this.documentListChangedEvent.next(this.documents.slice()),
      error: (err) => console.error(err),
      complete: () => console.log('Document PUT complete')
    })
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
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document){
    if(!originalDocument || !newDocument){return}

    const pos = this.documents.indexOf(originalDocument);

    if(pos < 0){return}

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document){
    if(!document){return}

    const pos = this.documents.indexOf(document);

    if(pos < 0){return}

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
}
