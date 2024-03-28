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
  public errorMessage: string = '';

  constructor(private apiService: ApiService) { }

  onSubmit() {
    this.apiService.login(this.identity).subscribe(
      response => {
        const token = response.token;
        localStorage.setItem('jwtToken', token);
        console.log('Login successful. Token:', token);
      },
      error => {
        console.error('Login error:', error);
        this.errorMessage = 'Login failed';
      }
    );
  }
}
