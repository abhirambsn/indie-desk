import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  standalone: false,
  templateUrl: './task-detail.component.html',
})
export class TaskDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  taskId: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id')!;
      console.log('[DEBUG] Setting taskId to: ', this.taskId);
    });
  }
}
