import { NgModule, OnInit } from '@angular/core';
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
import { ManageSubcategoryComponent } from './components/manage-subcategory/manage-subcategory.component';
import { AuthGuard } from './services/auth.guard';
import { QuestionnaireViewComponent } from './components/questionnaire-view/questionnaire-view.component';
import { SharedRouterComponent } from './components/shared-router/shared-router.component';
import { QuestionnaireAnsweredComponent } from './components/questionnaire-answered/questionnaire-answered.component';
import { Role } from './util/Role';
import { QuestionnaireResultsComponent } from './components/questionnaire-results/questionnaire-results.component';
import { ResultNormalComponent } from './components/questionnaire-results/result-normal/result-normal.component';
import { ResultGraphicComponent } from './components/questionnaire-results/result-graphic/result-graphic.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';

const routes: Routes = [
  {
    path: '',
    component: BodyComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.ADMIN, Role.SYS_ADMIN, Role.REVIEWER]
    },
    children: [
      {
        path: 'questionnaire-menu',
        component: QuestionnaireMenuComponent,
        canActivate: [AuthGuard],
        data: {
          roles: [Role.ADMIN, Role.SYS_ADMIN, Role.REVIEWER]
        },
      }
      , {
        path: 'maintenance-menu',
        component: MaintenanceMenuComponent,
        canActivate: [AuthGuard],
        data: {
          roles: [Role.SYS_ADMIN]
        },
      }
      , {
        path: 'create-questionnaire',
        component: CreateQuestionnaireComponent,
        canActivate: [AuthGuard],
        data: {
          roles: [Role.ADMIN, Role.SYS_ADMIN]
        },
      }
      , {
        path: 'search-questionnaire',
        component: SearchQuestionnaireComponent,
        canActivate: [AuthGuard],
        data: {
          roles: [Role.ADMIN, Role.SYS_ADMIN, Role.REVIEWER]
        },
      }
      , {
        path: 'manage-category',
        component: ManageCategoryComponent,
        canActivate: [AuthGuard],
        data: {
          roles: [Role.ADMIN, Role.SYS_ADMIN]
        },
      }
      , {
        path: 'manage-subcategory',
        component: ManageSubcategoryComponent,
        canActivate: [AuthGuard],
        data: {
          roles: [Role.ADMIN, Role.SYS_ADMIN]
        },
      }
      ,{
        path: 'modify-questionnaire',
        component: CreateQuestionnaireComponent,
        children: [
          {
            path: '**',
            component: CreateQuestionnaireComponent
          }
        ],
        canActivate: [AuthGuard],
        data: {
          roles: [Role.ADMIN, Role.SYS_ADMIN]
        },
      }
      ,{
        path: 'questionnaire-results',
        component: QuestionnaireResultsComponent,
        children: [
          {
            path: '**',
            component: QuestionnaireResultsComponent
          }
        ],
        canActivate: [AuthGuard],
        data: {
          roles: [Role.ADMIN, Role.SYS_ADMIN]
        },
      }
      ,{
        path: 'result-normal',
        component: ResultNormalComponent,
        children: [
          {
            path: '**',
            component: ResultNormalComponent
          }
        ],
        canActivate: [AuthGuard],
        data: {
          roles: [Role.ADMIN, Role.SYS_ADMIN]
        },
      }
      ,{
        path: 'result-graphic',
        component: ResultGraphicComponent,
        children: [
          {
            path: '**',
            component: ResultGraphicComponent
          }
        ],
        canActivate: [AuthGuard],
        data: {
          roles: [Role.ADMIN, Role.SYS_ADMIN]
        },
      }
    ]
  }
  , {
    path: 'login',
    component: LoginComponent,
    children: [
      {
        path: 'link',
        component: QuestionnaireViewComponent,
        children: [
          {
            path: '**',
            component: QuestionnaireViewComponent
          }
        ]
      }
    ]
  }, {
    path: 'office',
    component: SelectOfficeComponent,
  }, {
    path: 'graphic',
    component: PieChartComponent,
  }, {
    path: 'questionnaire-view',
    component: QuestionnaireViewComponent,
    children: [
      {
        path: '**',
        component: QuestionnaireViewComponent,
      }
    ]
  }, {
    path: 'link'
    , component: SharedRouterComponent
    , children: [
      {
        path: '**',
        component: SharedRouterComponent
      }
    ]
  }, {
    path: 'questionnaire-answered'
    , component: QuestionnaireAnsweredComponent
  }
  , { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
