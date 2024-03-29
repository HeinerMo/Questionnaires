import { ChangeDetectorRef, Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { single } from 'rxjs';
import { Answer } from 'src/app/models/Answer';
import { Option } from 'src/app/models/Option';
import { Question } from 'src/app/models/Question';
import { Questionnaire } from 'src/app/models/Questionnaire';
import { QuestionnaireType } from 'src/app/models/QuestionnaireType';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { UserService } from 'src/app/services/user.service';
import { QuestionUtil } from 'src/app/util/QuestionUtil';
import { LongAnswerQuestionComponent } from './long-answer-question/long-answer-question.component';
import { MultipleChoiceQuestionComponent } from './multiple-choice-question/multiple-choice-question.component';
import { NumericQuestionComponent } from './numeric-question/numeric-question.component';
import { ScaleQuestionComponent } from './scale-question/scale-question.component';
import { SingleChoiceQuestionComponent } from './single-choice-question/single-choice-question.component';
import { TrueFalseQuestionComponent } from './true-false-question/true-false-question.component';

@Component({
  selector: 'app-questionnaire-view',
  templateUrl: './questionnaire-view.component.html',
  styleUrls: ['./questionnaire-view.component.css']
})
export class QuestionnaireViewComponent implements OnInit {


  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  questionnaire?: Questionnaire
  questionComponentRefs: ComponentRef<any>[] = []
  isSendSuccessfull: boolean = true
  public messageToShow: string = ""
  isPreview: boolean

  constructor(private questionnaireService: QuestionnaireService
    , private router: Router
    , private userService: UserService,
    changeDetector: ChangeDetectorRef) {
    this.questionnaire = new Questionnaire({})
    this.isPreview = false
  }

  ngOnInit(): void {
    if (!this.isPreview) {
      let url = this.router.url.replace("/questionnaire-view/", "")
      this.questionnaireService.getQuestionnaireById((Number)(url)).subscribe(
        (responseDTO) => {
          if (responseDTO.id == 1) {
            this.validateAccess(responseDTO.item!);
            this.questionnaire = Object.assign(new Questionnaire({}), responseDTO.item!)
            this.questionnaire.sortQuestions()
            this.questionnaire?.questions.forEach(element => {
              this.loadQuestion(element)
            });
          }
        }
      )
    }
  }

  public validateAccess(questionnaire: Questionnaire) {
    if (!this.isPreview) {
      this.questionnaireService.getQuestionnaireTypes().subscribe((responseDto) => {
        if (responseDto.id == 1) {
          var questionnaireType: QuestionnaireType;
          responseDto.item!.forEach(element => {
            if (element.id == questionnaire.idQuestionnaireType) {
              questionnaireType = element;
            }
          });
          if (questionnaireType! != undefined) {
            if ((questionnaireType.name == "Interno" || questionnaireType.name == "Impersonal")
              && !this.userService.isLoggedIn()) {
              this.router.navigate([`/login/link/${questionnaire.id}`]);
            }
          }
        }
      });
    }
  }

  loadQuestion(question: Question): void {
    question.answers = []
    question.answers.push(new Answer())

    switch (question.typeId) {
      case 'su':
        const singleChoiceQuestionComponentRef = this.container.createComponent(SingleChoiceQuestionComponent)
        singleChoiceQuestionComponentRef.instance.question = question
        singleChoiceQuestionComponentRef.changeDetectorRef.detectChanges()
        this.questionComponentRefs.push(singleChoiceQuestionComponentRef)
        break;
      case 'sm':
        const multipleChoiceQuestionComponentRef = this.container.createComponent(MultipleChoiceQuestionComponent)
        multipleChoiceQuestionComponentRef.instance.question = question
        multipleChoiceQuestionComponentRef.changeDetectorRef.detectChanges()
        this.questionComponentRefs.push(multipleChoiceQuestionComponentRef)
        break;
      case 'rl':
        const longAnswerQuestionComponentRef = this.container.createComponent(LongAnswerQuestionComponent)
        longAnswerQuestionComponentRef.instance.question = question
        longAnswerQuestionComponentRef.changeDetectorRef.detectChanges()
        this.questionComponentRefs.push(longAnswerQuestionComponentRef)
        break;
      case 'vf':
        const trueFalseQuestionComponentRef = this.container.createComponent(TrueFalseQuestionComponent)
        trueFalseQuestionComponentRef.instance.question = question
        trueFalseQuestionComponentRef.changeDetectorRef.detectChanges()
        this.questionComponentRefs.push(trueFalseQuestionComponentRef)
        break;
      case 'es':
        const scaleQuestionComponent = this.container.createComponent(ScaleQuestionComponent)
        scaleQuestionComponent.instance.question = question
        scaleQuestionComponent.changeDetectorRef.detectChanges()
        this.questionComponentRefs.push(scaleQuestionComponent)
        break;
      case 'nu':
        const numericQuestionComponent = this.container.createComponent(NumericQuestionComponent)
        numericQuestionComponent.instance.question = question
        numericQuestionComponent.changeDetectorRef.detectChanges()
        this.questionComponentRefs.push(numericQuestionComponent)
        break;
    }
  }

  autoLoadQuestion() {
    this.container.clear();
    this.questionnaire?.questions.forEach(question => {
      QuestionUtil.autoLoadPredefinedOptions(question)
      this.loadQuestion(question)
    });
  }

  areAllRequiredQuestionsAnswered(): boolean {
    let allQuestionsAnswered = true
    this.questionnaire?.questions.forEach(element => {
      if (!QuestionUtil.validateAnsweredQuestion(element)) {
        allQuestionsAnswered = false;
      }
    });
    return allQuestionsAnswered
  }

  sendAnswers(): void {
    if (!this.isPreview) {
      this.questionnaireService.commitAnswers(this.questionnaire!).subscribe((messageDTO) => {
        if (messageDTO.id == 0) {
          this.isSendSuccessfull = false;
          this.messageToShow = "No se pudo enviar el cuestionario " + messageDTO.message
        } else if (messageDTO.id == 1) {
          this.router.navigate(['/questionnaire-answered/'])
        }
      });
    }
  }
}
