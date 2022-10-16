import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './components/body/body.component';
import { LoginComponent } from './components/login/login.component';
import { QuestionnaireMenuComponent } from './components/questionnaire-menu/questionnaire-menu.component';
import { MaintenanceMenuComponent } from './components/maintenance-menu/maintenance-menu.component'; 
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { SelectOfficeComponent } from './components/login/select-office/select-office.component';
import { CreateQuestionnaireComponent } from './components/create-questionnaire/create-questionnaire.component';
import { SearchQuestionnaireComponent } from './components/search-questionnaire/search-questionnaire.component';
import { ManageCategoryComponent } from './components/manage-category/manage-category.component';

const routes: Routes = [
  {
    path: '',
    component: BodyComponent,
    children: [
      { path: 'questionnaire-menu', component: QuestionnaireMenuComponent }
      , { path: 'maintenance-menu', component: MaintenanceMenuComponent }
      , { path: 'create-questionnaire', component: CreateQuestionnaireComponent }
      , { path: 'search-questionnaire', component: SearchQuestionnaireComponent }
      , { path: 'manage-category', component: ManageCategoryComponent }
    ]
  }
  ,{ path: 'login', component: LoginComponent }
  ,{ path: 'office', component: SelectOfficeComponent }
  ,{ path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }