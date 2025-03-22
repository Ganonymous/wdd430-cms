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
  documentListChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) {
    this.retrieveDocuments();
  }


  retrieveDocuments() {
    this.http.get('http://localhost:3000/documents').subscribe({
      next: (documents: Document[]) => {
        this.documents = documents;
        this.sortAndSend();
      },
      error: (err) => console.error(err),
      complete: () => console.log('Document GET complete')
    })
  }

  sortAndSend(){
    this.documents.sort((a, b) => {
      let aName = a.name.toLowerCase();
      let bName = b.name.toLowerCase();
      if(aName == bName){return 0}
      return aName < bName ? -1 : 1
    });
    this.documentListChangedEvent.next(this.documents.slice());
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

    newDocument.id = "";

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post<{message: String, document: Document}>('http://localhost:3000/documents', newDocument, {headers: headers})
      .subscribe(responseData => {
        this.documents.push(responseData.document);
        this.sortAndSend();
      })
  }

  updateDocument(originalDocument: Document, newDocument: Document){
    if(!originalDocument || !newDocument){return}

    const pos = this.documents.indexOf(originalDocument);

    if(pos < 0){return}

    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put(`http://localhost:3000/documents/${originalDocument.id}`, newDocument, {headers: headers})
      .subscribe((response: Response) => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      });
  }

  deleteDocument(document: Document){
    if(!document){return}

    const pos = this.documents.indexOf(document);

    if(pos < 0){return}

    this.http.delete(`http://localhost:3000/documents/${document.id}`)
      .subscribe((response: Response) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      })
  }
}
