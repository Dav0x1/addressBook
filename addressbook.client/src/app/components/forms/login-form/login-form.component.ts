import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Identity } from '../../../models/identity.model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  public identity: Identity = new Identity();
  public infoMessage: string = '';

  constructor(private apiService: ApiService) { }

  onSubmit() {
    this.apiService.login(this.identity).subscribe(
      response => {
        const token = response.token;
        localStorage.setItem('jwtToken', token);
        this.infoMessage = 'Login successful';
      },
      error => {
        this.infoMessage = 'Login failed';
      }
    );
  }
}
