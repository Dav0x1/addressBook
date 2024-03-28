import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Category } from '../../../models/category.model';
import { Subcategory } from '../../../models/subcategory.model';
import { Contact } from '../../../models/contact.model';

@Component({
  selector: 'app-new-contact-form',
  templateUrl: './new-contact-form.component.html',
  styleUrl: './new-contact-form.component.css'
})
export class NewContactFormComponent implements OnInit, OnChanges {
  @Output() output = new EventEmitter<Contact>();
  @Input() input: Contact;

  public contact: Contact = new Contact();
  public categories: Category[] = [];
  public subcategories: Subcategory[] = [];
  public isLoading: boolean = true;
  public isError: boolean = false;
  public displaySubcategoryElement: number = 0;

  constructor(private apiService: ApiService) {
  }

  async ngOnInit(){
    try {
      const categoriesResult = await this.apiService.getCategories().toPromise();
      const subcategoriesResult = await this.apiService.getSubcategories().toPromise();

      this.categories = categoriesResult || [];
      this.subcategories = subcategoriesResult || [];

      this.isLoading = false;
    } catch (error) {
      this.isError = true;
      this.isLoading = false;
      console.error('NewContactForm - Load categories/subcategories:', error);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['input'] && changes['input'].currentValue) {
      this.contact = Object.assign({}, changes['input'].currentValue);
    }
  }

  onSubmit() {
    this.output.emit(this.contact);
  }

  onCategoryChange(category: Category) {
    if(category !== null)
      switch (category.name) {
        case 'prywatny':
          this.displaySubcategoryElement = 0;
          break;
        case 'inny':
          this.displaySubcategoryElement = 1;
          break;
        default:
          this.displaySubcategoryElement = 2;
      }
    }
}
