import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questionnaire-menu',
  templateUrl: './questionnaire-menu.component.html',
  styleUrls: ['./questionnaire-menu.component.css']
})
export class QuestionnaireMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  create() : void {
    console.log("Create has been clicked!");
  }

  search() : void {
    console.log("Search has been clicked!")
  }

}