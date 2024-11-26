import { Component } from '@angular/core';

@Component({
  selector: 'app-supervise-main-page2',
  standalone: true,
  imports: [],
  templateUrl: './supervise-main-page2.component.html',
  styleUrl: './supervise-main-page2.component.scss',
})
export class SuperviseMainPage2Component {
  supTeamCount = 0;
  supProjectCount = 0;

  earningsAmount = 20000; // Replace this with your actual earnings data
  theDifference = 30;
  currentTime = '11:00:00:11';
  todayDate = new Date().toString().split(' GMT')[0];
}
