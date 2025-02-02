import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(0, 'Test Document 1', 'This is the first test document', 'www.google.com', null),
    new Document(1, 'Test Document 2', 'This is the second test document', 'www.google.com', null),
    new Document(2, 'Test Document 3', 'This is the third test document', 'www.google.com', null),
    new Document(3, 'CIT 366 - Full Web Stack Development', 'Learn how to develop modern web applications using the MEAN stack.', 'https://content.byui.edu/file/b7c3e5ed-6947-497f-9d32-4e5b6b397cac/1/CIT_366_course_description.pdf', null),
    new Document(4, 'Extremely Long, and I mean RIDICULOUSLY Long, as in beyond absurd in length, very very very long title and description test document', 'This is the test document that makes sure things don\'t break when the title is far, far, longer than is reasonable, so that any document with a reasonably lengthed title or description is guaranteed to work fine. This should be long enough for the test.', 'www.google.com', null),
  ];

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }
}
