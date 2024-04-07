import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private token: string | null;
  private decodedToken: { [key: string]: string };

  constructor() {
    this.token = localStorage.getItem('jwtToken');
    if (this.token) {
      this.decodeToken();
    }
  }

  setToken(token: string) {
    if (token) {
      this.token = token;
      this.decodeToken();
    }
  }

  decodeToken() {
    if (this.token) {
      this.decodedToken = jwtDecode(this.token);
    }
  }

  getDecodeToken() {
    if (this.token !== null)
      return jwtDecode(this.token);
    return null;
  }

  getUser() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['displayname'] : null;
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['exp'] : null;
  }

  removeToken() {
    localStorage.removeItem('jwtToken');
    this.token = null;
  }
 
  isTokenExpired(): boolean {
    const expiryTime = this.getExpiryTime();
    let expiryTimeInt: number | null = null;

    if (expiryTime !== null) {
      expiryTimeInt = parseInt(expiryTime, 10);
    }
    else {
      return true;
    }

    if (expiryTimeInt !== null && !isNaN(expiryTimeInt)) {
      return (expiryTimeInt * 1000) - Date.now() < 0;
    } else {
      return false;
    }
  }
}
