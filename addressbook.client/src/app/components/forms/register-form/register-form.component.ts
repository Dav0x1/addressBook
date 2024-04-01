import { Component } from '@angular/core';
import { Identity } from '../../../models/identity.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  public identity: Identity = new Identity();
  public infoMessage: string = '';

  constructor(private apiService: ApiService) { }

  onSubmit() {
    this.apiService.register(this.identity).subscribe(
      response => {
        this.infoMessage = response;
      },
      error => {
        this.infoMessage = error.error;
      }
    );
  }
}
