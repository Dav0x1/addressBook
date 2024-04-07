import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from './models/contact.model';
import { ApiService } from './services/api.service';
import { JwtService } from './services/jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showContactsList: boolean = true;
  showLogin: boolean = false;
  showRegister: boolean = false;
  addContactInfoMessage: string = '';
  isLogged: boolean = false;

  constructor(private modalService: NgbModal, private apiService: ApiService, private jwtService : JwtService) {
    this.isLogged = !jwtService.isTokenExpired();
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  async addContact(contact: Contact) {
    this.apiService.addContact(contact).subscribe(
        (response) => {
          this.addContactInfoMessage = response;
        },
      (error) => {
        if (error.status === 400 && error.error) {
          if (typeof error.error === 'object') {
            this.addContactInfoMessage = "Fill form correctly";
          } else {
            this.addContactInfoMessage = error.error;
          }
        } else {
          this.addContactInfoMessage = "Unknow error";
        }
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

  logout() {
    this.jwtService.removeToken();
    location.reload();
  }
}
