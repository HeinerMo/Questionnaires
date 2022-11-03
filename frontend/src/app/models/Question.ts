import { Category } from "./Category";
import { Option } from "./Option";
import { QuestionType } from "./QuestionType";
import { SubCategory } from "./SubCategory";


export class Question{
  
  id?: number;
  statement?: string;
  label?: string;
  position?: number;
  typeId?: string;
  subcategoryId?: number;
  categoryId?: number;
  options: Option[] = [];
  isOptional?: boolean;

  constructor (
    {id, statement, label, position, subcategoryId, categoryId, typeId, isOptional}: 
    {id?: number, statement?: string, label?: string, position?: number, subcategoryId?: number, categoryId?: number, typeId?: string, isOptional?: boolean}
    ) {
      this.id = id;
      this.statement = statement;
      this.label = label;
      this.position = position;
      this.subcategoryId = subcategoryId;
      this.categoryId = categoryId;
      this.typeId = typeId;
      this.isOptional = isOptional;
    }


    validateSelection(): boolean {
      if (this.isOptional) {
        return true
      }
  
      let valid = false
      this.options.forEach(element => {
        if (element.selected) {
          valid = true
        }
      });
  
      return !valid
    }

}