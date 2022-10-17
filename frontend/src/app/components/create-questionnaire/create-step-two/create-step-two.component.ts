import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Question } from "src/app/models/Question";
import { QuestionService } from "src/app/services/question.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { map, Observable, of, startWith } from "rxjs";
import { Category } from "src/app/models/Category";
import { CategoryService } from "src/app/services/category.service";
import { QuestionType } from "src/app/models/QuestionType";
import { SubCategory } from "src/app/models/SubCategory";

@Component({
  selector: 'app-create-step-two',
  templateUrl: './create-step-two.component.html',
  styleUrls: ['./create-step-two.component.css']
})
export class CreateStepTwoComponent implements OnInit {

  // Instancias necesarias
  private displayedColumns: string[];
  private dataSource: MatTableDataSource<Question>;
  private searchControl: FormControl;

  // Respaldo local de las preguntas creadas
  private questionList: Question[];

  // Declaracion del modelo de pregunta
  private questionModel: Question;

  // Inicializacion de los atributos
  constructor(private questionService: QuestionService, public dialog: MatDialog) {
    this.questionModel = new Question({});
    this.displayedColumns = ['id', 'statement', 'type', 'operations'];
    this.dataSource = new MatTableDataSource<Question>;
    this.searchControl = new FormControl('');
    this.questionList = [];
  }

  // Metodo para abrir del modal de crear preguntas
  public openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    // Se inicia el MatDialog y se le indican parametros
    var dialogRef = this.dialog.open(CreateQuestionDialog, {
      enterAnimationDuration,
      exitAnimationDuration,
      data: { questionModel: this.questionModel },
    });

    // Cuando el MatDialog se cierra, entonces realiza estas acciones
    dialogRef.afterClosed().subscribe(result => {
      this.questionModel = result;
    });
  }

  // Esto se ejecuta cada vez que se ingresa a esta vista
  ngOnInit(): void {
    this.openDialog('0ms', '0ms');
  }

  // Con este metodo se puede actualizar el datasource de la tabla
  public updateDataSource(questions: Question[]): void {
    this.dataSource = new MatTableDataSource<Question>(questions)
  }

  // Con este metodo se pueden agregar preguntas a la lista
  // local de preguntas
  public createQuestion(question: Question): void {
    this.questionList.push(question);
    this.updateDataSource(this.questionList);
  }

  // Buscar preguntas segun el enunciado de pregunta
  public searchQuestion(): void {
    // Se crea una lista que se ira llenando de preguntas
    // que coincidan con los criterios de busqueda
    var tempQuestionList: Question[] = []

    // Se obtiene el valor del input de busqueda
    const searchValue: string = this.searchControl.value;

    // Se recorre la lista de preguntas locales
    this.questionList.forEach(function (question) {
      // Si el enunciado de la pregunta no esta definido entonces se asigna vacio
      const questionStatement: String = question.statement === undefined ? '' : question.statement;
      // Si el enunciado de la pregunta contiene el string de busqueda entonces se
      // agrega a la lista temporal
      if (questionStatement.includes(searchValue)) { tempQuestionList.push(question); }
    });
    // Se actualiza el datasource de la tabla con las preguntas encontradas
    this.updateDataSource(tempQuestionList);
  }

  // Eliminar las preguntas de la lista de preguntas locales
  public deleteQuestion(id: number) {
    // Se obtiene el index de la pregunta a la que el corresponde el id
    const indexOfQuestion = this.questionList.findIndex((object) => {
      return object.id === id;
    });
    // Si el index es diferente a -1 entonces se elimina de la lista
    if (indexOfQuestion != -1) {
      this.questionList.splice(indexOfQuestion, 1);
    }
    // Se actualiza el datasource de la tabla
    this.updateDataSource(this.questionList);
  }

  // Metodos get
  public getDisplayedColumns(): string[] { return this.displayedColumns; }
  public getDataSource(): MatTableDataSource<Question> { return this.dataSource; }
  public getSearchControl(): FormControl { return this.searchControl };
}

@Component({
  selector: 'app-create-question-dialog',
  templateUrl: './create-question-dialog/create-question-dialog.html',
  styleUrls: ['./create-question-dialog/create-question-dialog.css']
})
export class CreateQuestionDialog implements OnInit {

  // Modelos necesarios para la creacion de las preguntas
  question: Question;

  // Listas de objetos
  private questionTypes: Observable<QuestionType[]>;
  private categories: Observable<Category[]>;
  private subCategories: Observable<SubCategory[]>;

  // Instancias necesarias
  private createQuestionForm: FormGroup;

  // Inicializacion de los atributos
  constructor(
    public dialogRef: MatDialogRef<CreateQuestionDialog>,
    private questionService: QuestionService,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: Question
  ) {

    this.question = new Question({});
    this.questionTypes = new Observable<QuestionType[]>();
    this.categories = new Observable<Category[]>();
    this.subCategories = new Observable<SubCategory[]>();

    // Indicarle al form group los form control que le pertenecen
    this.createQuestionForm = new FormGroup({
      statement: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      subCategory: new FormControl("", [Validators.required])
    })
  }

  // Este metodo se ejecuta cada vez que se ingresa a esta vista
  ngOnInit(): void {
    // Inicializar la lista de tipos de pregunta
    this.questionService.getQuestionTypes().subscribe(
      (questionsTypes) => this.questionTypes = of(questionsTypes)
    );

    // Inicializar la lista de categorias de pregunta
    var categoryList: Category[] = [
      new Category({ id: 1, name: "Familiar" })
      , new Category({ id: 1, name: "Trabajo" })
    ]
    this.categories = of(categoryList);


    // Inicializar la lista de sub categorias de pregunta
    var subCategoryList: SubCategory[] = [
      new SubCategory({ id: 1, name: "Triste" })
      , new SubCategory({ id: 1, name: "Accidental" })
    ]
    this.subCategories = of(subCategoryList);

  }

  // Esto es lo que se ejecuta cuando se realiza la accion de aceptar (enviar formulario)
  public onSubmit = () => {
    // Si el formulario es valido, entonces se le asignan
    // los valores a la pregunta
    if (this.createQuestionForm.valid) {
      
      this.question.statement = this.getFormGroup().get('statement')?.value;
      this.question.category = new Category({
        id: this.getFormGroup().get('category')?.value
      });
      this.question.subcategory = new SubCategory({
        id: this.getFormGroup().get('subCategory')?.value
      });
      this.question.type = new QuestionType({
        id: this.getFormGroup().get('type')?.value
      });

    }

    console.log(this.question)

  }

  // Metodos Get
  public getFormGroup(): FormGroup { return this.createQuestionForm; }
  public getQuestionTypes(): Observable<QuestionType[]> { return this.questionTypes; }
  public getCategories(): Observable<Category[]> { return this.categories; }
  public getSubCategories(): Observable<SubCategory[]> { return this.subCategories; }
}