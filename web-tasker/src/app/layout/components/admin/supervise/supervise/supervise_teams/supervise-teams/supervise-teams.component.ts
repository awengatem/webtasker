import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervise-teams',
  templateUrl: './supervise-teams.component.html',
  styleUrls: ['./supervise-teams.component.scss'],
})
export class SuperviseTeamsComponent {


  constructor(private router: Router) { }
  
  goBack() {
    this.router.navigate(['/supervise']);
  }

  ngOnInit(): void {}
}
