import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Identity } from '../../../models/identity.model';
import { JwtService } from '../../../services/jwt.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  public identity: Identity = new Identity();
  public infoMessage: string = '';

  constructor(private apiService: ApiService, private jwtService: JwtService) { }

  onSubmit() {
    this.apiService.login(this.identity).subscribe(
      response => {
        const token = response.token;
        localStorage.setItem('jwtToken', token);
        this.jwtService.setToken(token);
        this.infoMessage = 'Login successful';
      },
      error => {
        this.infoMessage = 'Login failed';
      }
    );

    location.reload();
  }
}
