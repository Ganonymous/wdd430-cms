import { Component, OnInit } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  standalone: false,
  
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
  providers: [DocumentService]
})
export class DocumentsComponent implements OnInit{
  selectedDocument: Document;

  constructor(private documentService: DocumentService){};

  ngOnInit(): void {
    this.documentService.documentSelectedEvent.subscribe(
      (selected: Document) => {
        this.selectedDocument = selected;
      }
    )
  }
}
