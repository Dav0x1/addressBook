import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from './models/contact.model';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showContactsList: boolean = true;
  showLogin: boolean = false;
  showRegister: boolean = false;

  constructor(private modalService: NgbModal, private apiService: ApiService) {
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  async addContact(contact: Contact) {
    this.apiService.addContact(contact).subscribe(
        (response) => {
          console.log('Contact added:', response);
        },
        (error) => {
          console.error('Error while adding user:', error);
        }
      );
  }

  showContacts() {
    this.showContactsList = true;
    this.showRegister = false;
    this.showLogin = false;
  }

  showLoginForm() {
    this.showContactsList = false;
    this.showRegister = false;
    this.showLogin = true;
  }

  showRegisterForm() {
    this.showContactsList = false;
    this.showLogin = false;
    this.showRegister = true;
  }
}
