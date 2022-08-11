import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
  }

  createProject(name: any){
    
    this.projectService.createProject(name).subscribe((response: any)=>{
      console.log(response);
    });
  }

}
