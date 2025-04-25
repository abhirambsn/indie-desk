import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-detail',
  standalone: false,
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  projectId: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('id')!;
      console.log('[DEBUG] Setting projectId to: ', this.projectId);
    });
  }
}
