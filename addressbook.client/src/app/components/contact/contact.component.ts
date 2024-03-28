import { Component, Input } from '@angular/core';
import { Contact } from '../../models/contact.model';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  @Input() contact: Contact;
  showDetails: boolean = false;
  isDeleted: boolean = false;
  isEditing: boolean = false;

  constructor(private modalService: NgbModal, private apiService: ApiService) {
    this.contact = new Contact();
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
        console.log('Contact updated:', response);
      },
      (error) => {
        console.error('Error while adding user:', error);
      }
    );
  }
}
