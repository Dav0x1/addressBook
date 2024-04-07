import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewContactFormComponent } from './components/forms/new-contact-form/new-contact-form.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginFormComponent } from './components/forms/login-form/login-form.component';
import { RegisterFormComponent } from './components/forms/register-form/register-form.component';
import { JwtService } from './services/jwt.service';

@NgModule({
  declarations: [
    AppComponent,
    NewContactFormComponent,
    ContactListComponent,
    ContactComponent,
    LoginFormComponent,
    RegisterFormComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    ApiService,
    JwtService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
