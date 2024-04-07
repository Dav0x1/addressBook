import { Component, Input } from '@angular/core';
import { Contact } from '../../models/contact.model';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  @Input() contact: Contact = new Contact();
  showDetails: boolean = false;
  isDeleted: boolean = false;
  isEditing: boolean = false;
  isLogged: boolean = false;
  updateContactInfoMessage: string = '';

  constructor(private modalService: NgbModal, private apiService: ApiService, private jwtService: JwtService) {
    this.isLogged = !jwtService.isTokenExpired();

  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  deleteContact() {
    this.apiService.deleteContact(this.contact.id).subscribe(
      (response) => {
        console.log("User deleted");
        this.isDeleted = true;
      }, (error) => {
        console.error("Error while deleting user:", error);
      });
  }

  async updateContact(contact: Contact) {
    this.apiService.updateContact(contact).subscribe(
      (response) => {
        this.updateContactInfoMessage = response;
      },
      (error) => {
        if (error.status === 400 && error.error) {
          if (typeof error.error === 'object') {
            this.updateContactInfoMessage = "Fill form correctly";
          } else {
            this.updateContactInfoMessage = error.error;
          }
        } else {
          this.updateContactInfoMessage = "Unknow error";
        }
      }
    );
  }
}
