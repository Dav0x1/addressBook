import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  public contacts: Contact[] = [];
  public totalPaginationPage: number = 1;
  public paginationPage: number = 1;
  public paginationAmount: number = 10;

  constructor(private apiService: ApiService) {

  }

  async ngOnInit() {
    await this.loadContacts();
    // Load total pagination page
    try {
      const paginationPagesResult = await this.apiService.getPaginationPages(this.paginationAmount).toPromise();
      this.totalPaginationPage = paginationPagesResult || 1;
    } catch (error) {
      console.log("Error while loading contacts:", error);
    }
  }

  async loadContacts() {
    try {
      const contactsResult = await this.apiService.getContacts(this.paginationPage, this.paginationAmount).toPromise();
      this.contacts = contactsResult || [];
    } catch (error) {
      console.log("Error while loading contacts:", error);
    }
  }

  async previousPage() {
    if (this.paginationPage > 1) {
      this.paginationPage--;
      await this.loadContacts();
    }
  }

  async nextPage() {
    if (this.paginationPage < this.totalPaginationPage) {
      this.paginationPage++;
    await this.loadContacts();
    }
  }
}
