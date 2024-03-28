import { Category } from "./category.model";
import { Subcategory } from "./subcategory.model";

export class Contact {
  id: number = 0;
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  dateOfBirth: Date = new Date();
  category: Category = new Category();
  subcategory: Subcategory = new Subcategory();
}
