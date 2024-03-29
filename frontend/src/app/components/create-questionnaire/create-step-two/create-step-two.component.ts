import { Component, OnInit, ViewChild, Inject, Input, AfterViewInit, OnChanges, SimpleChanges } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Question } from "src/app/models/Question";
import { QuestionService } from "src/app/services/question.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { firstValueFrom, map, Observable, of, startWith } from "rxjs";
import { Category } from "src/app/models/Category";
import { CategoryService } from "src/app/services/category.service";
import { QuestionType } from "src/app/models/QuestionType";
import { SubCategory } from "src/app/models/SubCategory";
import { Option } from "src/app/models/Option";
import { QuestionUtil } from "src/app/util/QuestionUtil";
import { MatStepper } from "@angular/material/stepper";
import { Questionnaire } from "src/app/models/Questionnaire";
import { SubcategoryService } from "src/app/services/subcategory.service";
import { QuestionnaireService } from "src/app/services/questionnaire.service";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { NumberInput } from "@angular/cdk/coercion";

@Component({
  selector: 'app-create-step-two',
  templateUrl: './create-step-two.component.html',
  styleUrls: ['./create-step-two.component.css']
})
export class CreateStepTwoComponent implements OnInit, OnChanges {
  @Input() stepperContainer?: MatStepper;
  @Input() questionnaire?: Questionnaire;
  @Input('cdkDropListAutoScrollStep') autoScrollStep: NumberInput = 500;

  // Instancias necesarias
  private displayedColumns: string[];
  private dataSource: MatTableDataSource<Question>;
  private searchControl: FormControl;
  private questionTypes: QuestionType[];

  // Inicializacion de los atributos
  constructor(private questionService: QuestionService, public dialog: MatDialog, private qService: QuestionnaireService) {
    this.displayedColumns = ['position', 'statement', 'type', 'operations'];
    this.dataSource = new MatTableDataSource<Question>;
    this.searchControl = new FormControl('');
    this.questionTypes = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    let questionnaireAux:Questionnaire = changes['questionnaire'].currentValue
    this.updateDataSource(questionnaireAux.questions)
  }

  // Esto se ejecuta cada vez que se ingresa a esta vista
  ngOnInit(): void {
    this.questionService.getQuestionTypes().subscribe((responseDTO) => {
      if (responseDTO.id == 1) {
        this.questionTypes = responseDTO.item!;
      }
    });
    
  }

  // Metodo para abrir del modal de crear preguntas
  public openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    // Se inicia el MatDialog y se le indican parametros
    var dialogRef = this.dialog.open(CreateQuestionDialog, {
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.state == true) {
        result.question.position = this.questionnaire!.questions.length;
        this.createQuestion(result);
      }
    });
  }

  public openModifyDialog(enterAnimationDuration: string, exitAnimationDuration: string, questionToModify: Question): void {
    // Se inicia el MatDialog y se le indican parametros
    var dialogRef = this.dialog.open(CreateQuestionDialog, {
      data: {questionToModify: questionToModify},
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.state == true) {
        
      }
    });
  }
  
  public pushQuestion(question: Question) {
    this.questionnaire?.questions?.push(question);
    question.position = this.questionnaire?.questions?.length
  }

  // Con este metodo se puede actualizar el datasource de la tabla
  public updateDataSource(questions: Question[]): void {
    this.dataSource = new MatTableDataSource<Question>(questions)
  }

  // Con este metodo se pueden agregar preguntas a la lista local de preguntas
  public createQuestion(result: any): void {
    this.pushQuestion(result.question);
    this.updateDataSource(this.questionnaire!.questions);
  }

  public getQuestionTypeById(idType: string): QuestionType {
    let questionTypeAux: QuestionType = new QuestionType({name: "null"});
    this.questionTypes.forEach((questionType) => {
      if (questionType.id == idType) {
        questionTypeAux = questionType;
      }
    });

    return questionTypeAux!;
  }

  public dropQuestion(event: CdkDragDrop<Question[]>) {
    var questions = this.questionnaire!.questions;
    moveItemInArray(questions, event.previousIndex, event.currentIndex);
    var positionAux:number = 1;
    questions.forEach(question => {
      question.position = positionAux;
      positionAux ++;
    });
    this.updateDataSource(this.questionnaire!.questions);
  }

  public getQuestions(): Question[] {
    return this.questionnaire!.questions;
  }

  // Buscar preguntas segun el enunciado de pregunta
  public searchQuestion(): void {
    // Se crea una lista que se ira llenando de preguntas
    // que coincidan con los criterios de busqueda
    var tempQuestionList: Question[] = []

    // Se obtiene el valor del input de busqueda
    const searchValue: string = this.searchControl.value;

    // Se recorre la lista de preguntas locales
    this.questionnaire!.questions.forEach(function (question) {
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
  public deleteQuestion(statement: string) {
    // Se obtiene el index de la pregunta a la que el corresponde el id
    const indexOfQuestion = this.questionnaire!.questions.findIndex((object) => {
      return object.statement === statement;
    });
    // Si el index es diferente a -1 entonces se elimina de la lista
    if (indexOfQuestion != -1) {
      this.questionnaire!.questions.splice(indexOfQuestion, 1);
    }
    // Se actualiza el datasource de la tabla
    this.updateDataSource(this.questionnaire!.questions);
  }

  public cleanSearchControl() {
    this.searchControl.reset();
  }

  goBack(){
    this.stepperContainer!.previous();
  }

  goForward(){
    this.stepperContainer!.next();
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
  @Input() stepperContainer?: MatStepper;
  @Input() questionnaire?: Questionnaire;

  // Modelos necesarios para la creacion de las preguntas
  question: Question;
  optionCreateControl: FormControl = new FormControl("", [Validators.required, Validators.pattern(/[a-zA-ZÁ-Úá-ú].*/)]);
  optionUpdateControl: FormControl = new FormControl("", [Validators.required, Validators.pattern(/[a-zA-ZÁ-Úá-ú].*/)]); 
  // Listas de objetos
  private questionTypes: Observable<QuestionType[]>;
  private categories: Observable<Category[]>;
  private subCategories: Observable<SubCategory[]>;
  private dataSource: MatTableDataSource<Option>;
  private displayedColumns: string[];

  // Instancias necesarias
  private createQuestionForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator

  public isOption: boolean;
  public nombreVariable: string;
  // Inicializacion de los atributos
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {questionToModify: Question},
    public dialogRef: MatDialogRef<CreateQuestionDialog>,
    private questionService: QuestionService,
    private categoryService: CategoryService,
    private subCategoryService: SubcategoryService,
  ) {
    this.nombreVariable ='';
    this.isOption = false;
    this.question = new Question({});
    this.questionTypes = new Observable<QuestionType[]>();
    this.categories = new Observable<Category[]>();
    this.subCategories = new Observable<SubCategory[]>();
    this.dataSource = new MatTableDataSource<Option>;
    this.displayedColumns = ['name', 'operations'];

    // Indicarle al form group los form control que le pertenecen
    this.createQuestionForm = new FormGroup({
      statement: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      subCategory: new FormControl("", [Validators.required]),
      label: new FormControl("", [Validators.required,Validators.pattern(/[a-zA-ZÁ-Úá-ú].*/)]),
      optional: new FormControl(false, [Validators.required]),
    })

  }

  public updateSubCategories() {
    var categoryId: number = this.getFormGroup().get('category')?.value;
    this.getFormGroup().get('subCategory')?.setValue(null);

    this.subCategoryService.getSubCategories(categoryId).subscribe(
      (responseDTO) => {
        this.subCategories = of(responseDTO.item!);
      }
    );
  }

  // Este metodo se ejecuta cada vez que se ingresa a esta vista
  ngOnInit(): void {

    // Inicializar la lista de tipos de pregunta
    this.questionService.getQuestionTypes().subscribe(
      (responseDTO) => {
        this.questionTypes = of(responseDTO.item!)
      }
    );

    // Inicializar la lista de categorias de pregunta
    this.categoryService.getCategories().subscribe(
      (responseDTO) => {
        this.categories = of(responseDTO.item!)
      }
    );

    if (this.data != null) {
      this.question = this.data.questionToModify!;
      this.getFormGroup().get('statement')?.setValue(this.question.statement);
      this.getFormGroup().get('label')?.setValue(this.question.label);
      this.getFormGroup().get('category')?.setValue(this.question.categoryId);
      this.updateSubCategories()
      this.getFormGroup().get('subCategory')?.setValue(this.question.subCategoryId);
      this.getFormGroup().get('type')?.setValue(this.question.typeId);
      this.getFormGroup().get('optional')?.setValue(this.question.isOptional);
      this.requireOption(this.question.typeId!);
      this.updateDataSource(this.question.options)
    }

    this.dataSource.paginator = this.paginator;
  }

  public requireOption(typeId: string): boolean {
    if (typeId != undefined) {
      this.isOption = QuestionUtil.requireOption(typeId);
    }

    return this.isOption;
  }

  onOptionalChange(isOptional: boolean) {
    this.getFormGroup().get('optional')?.setValue(isOptional);
  }

  // Esto es lo que se ejecuta cuando se realiza la accion de aceptar (enviar formulario)
  public onSubmit = () => {
    // Si el formulario es valido, entonces se le asignan
    // los valores a la pregunta      
    this.question.statement = this.getFormGroup().get('statement')?.value;
    this.question.label = this.getFormGroup().get('label')?.value;
    this.question.categoryId = this.getFormGroup().get('category')?.value;
    this.question.subCategoryId = this.getFormGroup().get('subCategory')?.value;
    this.question.isOptional = this.getFormGroup().get('optional')?.value;

    this.question.typeId = this.getFormGroup().get('type')?.value;
    const auxQuestionType = this.question.typeId;
    this.question.options.forEach(function (option) {
      option.idQuestionType = auxQuestionType;
    });

    // Si el formulario es valido y el tipo de pregunta no requiere opciones,
    // entonces se puede cerrar el dialog y enviarle la pregunta al componente padre.
    if (this.createQuestionForm.valid) {
      if (!this.requireOption(this.question.typeId!)) {
        this.question.options = [];
        this.dialogRef.close({ question: this.question, state: true, questionTypeName:'' });
      } else if (this.question.options.length > 0) {
        this.dialogRef.close({ question: this.question, state: true, questionTypeName:'' });
      }
    }
  }

  public createOption(optionQ: string): void {
    if (this.optionCreateControl.valid) {
      this.question.options.push(new Option({ optionName: optionQ }));
      this.updateDataSource(this.question.options);
      this.cleanOptionControl();
    }
  }

  // Buscar opciones segun el nombre de opcion
  public searchOption(): void {
    // Se crea una lista que se ira llenando de opciones
    // que coincidan con los criterios de busqueda
    var tempQuestionList: Option[] = []

    // Se obtiene el valor del input de busqueda
    const searchValue: string = this.optionCreateControl.value;

    // Se recorre la lista de preguntas locales
    this.question.options.forEach(function (option) {
      // Si el nombre de la opcion no esta definido entonces se asigna vacio
      const optionName: String = option.optionName === undefined ? '' : option.optionName;
      // Si el nombre de la opcion contiene el string de busqueda entonces se
      // agrega a la lista temporal
      if (optionName.includes(searchValue)) { tempQuestionList.push(option); }
    });
    // Se actualiza el datasource de la tabla con las opciones encontradas
    this.updateDataSource(tempQuestionList);
  }

  // Eliminar las opciones de la lista de opciones locales
  public deleteOption(option: string) {
    // Se obtiene el index de la opcion a la que el corresponde el id
    const indexOfQuestion = this.question.options.findIndex((object) => {
      return object.optionName === option;
    });
    
    // Si el index es diferente a -1 entonces se elimina de la lista
    if (indexOfQuestion != -1) {
      this.question.options.splice(indexOfQuestion, 1);
    }
    // Se actualiza el datasource de la tabla
    this.updateDataSource(this.question.options);
  }

  public updateOption(option: string){
    this.optionUpdateControl.setValue(option);
    for (let i = 0; i < this.question.options.length; i++) {
      this.question.options[i].editable=false;
    }
    //esto busca cual es el opcion y le cambia la variable editable
    const indexOfQuestion = this.question.options.findIndex((object) => {
      return object.optionName === option;
    });
    this.question.options[indexOfQuestion].editable=true;
  }

  public updateOptionConfirm (option: string,optionQ: string){
    // Se obtiene el index de la opcion a la que el corresponde el id
    const indexOfQuestion = this.question.options.findIndex((object) => {
      return object.optionName === option;
    });
    
    // Si el index es diferente a -1 entonces se actualiza de la lista
    if (indexOfQuestion != -1) {
      this.question.options.splice(indexOfQuestion, 1, new Option({ optionName: optionQ }));
    }
    // Se actualiza el datasource de la tabla
    this.updateDataSource(this.question.options);

    //esto busca cual es el opcion y le cambia la variable editable
    this.question.options[indexOfQuestion].editable=false;
    this.cleanOptionControl();
  }

  public updateOptionCancel (option: string){
    //esto busca cual es el opcion y le cambia la variable editable
    const indexOfQuestion = this.question.options.findIndex((object) => {
      return object.optionName === option;
    });
    this.question.options[indexOfQuestion].editable=false;
    this.cleanOptionControl();
  }

  // Con este metodo se actualizan los valores datasource de la tabla
  public updateDataSource(options: Option[]): void {
    this.dataSource = new MatTableDataSource<Option>(options);
    this.dataSource.paginator = this.paginator;
  }

  public cleanOptionControl() {
    this.optionCreateControl.reset();
    this.optionUpdateControl.reset();
  }

  // Metodos Get
  public getFormGroup(): FormGroup { return this.createQuestionForm; }
  public getQuestionTypes(): Observable<QuestionType[]> { return this.questionTypes; }
  public getCategories(): Observable<Category[]> { return this.categories; }
  public getSubCategories(): Observable<SubCategory[]> { return this.subCategories; }
  public getDataSource(): MatTableDataSource<Option> { return this.dataSource; }
  public getDisplayedColumns(): string[] { return this.displayedColumns; }
}