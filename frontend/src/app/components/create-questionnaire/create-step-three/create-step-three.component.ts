import { DataSource } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Office } from 'src/app/models/Office';
import { Questionnaire } from 'src/app/models/Questionnaire';
import { ReviewerQuestionnaire } from 'src/app/models/ReviewerQuestionnaire';
import { User } from 'src/app/models/User';
import { OfficeService } from 'src/app/services/office.service';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-step-three',
  templateUrl: './create-step-three.component.html',
  styleUrls: ['./create-step-three.component.css']
})
export class CreateStepThreeComponent implements OnInit, OnChanges {
  @Input() isModify?: boolean;
  @Input() stepperContainer?: MatStepper;
  @Input() questionnaire?: Questionnaire;

  users: User[] = []
  offices: Office[] = []

  officeControl: FormControl = new FormControl();
  userControl: FormControl = new FormControl();
  searchControl: FormControl = new FormControl();

  private displayedColumns: string[] = ['userName', 'name', 'office', 'operations'];
  private dataSource = new MatTableDataSource<ReviewerQuestionnaire>;
  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(private userService: UserService
    , private officeService: OfficeService
    , private questionnaireService: QuestionnaireService) { }


  ngOnChanges(changes: SimpleChanges): void {
    let isModifyAux: boolean = changes['isModify'].currentValue;
    /*if (isModifyAux) {
      this.questionnaireService.getQuestionnaireReviewers(this.questionnaire?.id!).subscribe(
        (responseDTO) => {
          if (responseDTO.id == 1) {
            this.questionnaire!.reviewersQuestionnaire = responseDTO.item!;
            console.log(this.questionnaire!.reviewersQuestionnaire)
            this.users.forEach((user) => {console.log(user)});
            
            //this.updateDataSource(this.questionnaire!.reviewersQuestionnaire);
          }
        });
    } */
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator
    this.updateOffices()
  }

  public updateOffices() {
    this.officeService.getOffices().subscribe(
      (responseDTO) => (this.offices = responseDTO.item!)
    )
  }

  public officeChange() {
    this.userService.getUserByOffice(this.officeControl.value).subscribe(
      (responseDTO) => (this.updateUserList(responseDTO.item!))
    )
  }

  public updateUserList(users: User[]): void {
    this.users = users;
  }

  public getDataSource(): MatTableDataSource<ReviewerQuestionnaire> {
    return this.dataSource;
  }

  public getDisplayedColumns(): string[] {
    return this.displayedColumns;
  }

  public updateDataSource(reviewersQuestionnaire: ReviewerQuestionnaire[]): void {
    this.dataSource = new MatTableDataSource<ReviewerQuestionnaire>(reviewersQuestionnaire);
    this.dataSource.paginator = this.paginator;
  }

  public addReviewer(): void {

    var exists = false;

    //Verificar si el usuario no ha sido seleccionado anteriormente
    this.questionnaire?.reviewersQuestionnaire.forEach((reviewerQuestionnaire) => {
      if (this.userControl.value == reviewerQuestionnaire.user?.id) {
        exists = true;
      }
    })


    if (!exists) { //Si el usuario no ha sido seleccionado

      let reviewerQuestionnaire = new ReviewerQuestionnaire({
        idUser: this.userControl.value
      })

      this.users.forEach((user) => {
        if (user.id == reviewerQuestionnaire.idUser) {
          reviewerQuestionnaire.user = user
        }
      })

      let officeId = this.officeControl.value
      this.offices.forEach((office) => {
        if (office.id == officeId) {
          reviewerQuestionnaire.office = office;
        }
      });

      this.questionnaire?.reviewersQuestionnaire.push(reviewerQuestionnaire)

      this.updateDataSource(this.questionnaire?.reviewersQuestionnaire!)

    }
    //estas líneas limpian los datos, dejarlas aquí.
    this.userControl.setValue(null)
    this.searchControl.setValue(null)
  }

  public sortBySearch() {

    if (this.searchControl.value != null) {
      var tempReviewerQuestionnaire: ReviewerQuestionnaire[] = []
      this.questionnaire?.reviewersQuestionnaire.forEach(revieweQuestionnaire => {
        let index = (revieweQuestionnaire.user!.name?.toLowerCase() + "").indexOf(this.searchControl.value.toLowerCase())
        if (index > -1) {
          let added = false
          for (let i = 0; i < tempReviewerQuestionnaire.length; i++) {
            let tempIndex = (tempReviewerQuestionnaire[i].user!.name?.toLowerCase() + "").indexOf(this.searchControl.value.toLowerCase())
            if (tempIndex < 0 || index < tempIndex) {
              if (i == 0) {
                tempReviewerQuestionnaire.unshift(revieweQuestionnaire)
              } else {
                tempReviewerQuestionnaire.splice(i, 0, revieweQuestionnaire)
              }
              added = true
              break
            }
          }
          if (!added) {
            tempReviewerQuestionnaire.push(revieweQuestionnaire)
          }
        } else {
          tempReviewerQuestionnaire.push(revieweQuestionnaire)
        }
      });
      this.updateDataSource(tempReviewerQuestionnaire)
    }
  }

  public deleteReviewerQuestionnaire(reviewerQuestionnaire: ReviewerQuestionnaire) {
    const reviewerQuestionnaireAux = reviewerQuestionnaire;
    // Se obtiene el index de la opcion a la que el corresponde el id
    const indexOfReviewer = this.questionnaire!.reviewersQuestionnaire.findIndex((reviewerQuestionnaire) => {
      return reviewerQuestionnaire == reviewerQuestionnaireAux;
    });

    // Si el index es diferente a -1 entonces se elimina de la lista
    if (indexOfReviewer != -1) {
      this.questionnaire?.reviewersQuestionnaire.splice(indexOfReviewer, 1);
    }
    // Se actualiza el datasource de la tabla
    this.updateDataSource(this.questionnaire!.reviewersQuestionnaire);

  }

  public cleaningServices(): void {
    this.officeControl.setValue(null)
    this.userControl.setValue(null)
    this.searchControl.setValue(null)
    this.updateUserList([])
  }

  public checkValid(): boolean {
    return this.officeControl.valid && this.userControl.valid
  }

  goBack() {
    this.stepperContainer!.previous();
  }

  goForward() {
    this.stepperContainer!.next();
  }

}
