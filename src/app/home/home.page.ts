import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/authentication.service';
import { TaskService } from '../service/task.service';
import { Task } from '../models/task.model';
import { ModalController } from '@ionic/angular';
import { AddTaskComponent } from '../component/add-task/add-task.component';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { EditTaskComponent } from '../component/edit-task/edit-task.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  currentUser: any = null;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  taskLength: number = 0;

  constructor(private authService: AuthService, private taskService: TaskService, private router: Router, private modalController: ModalController) {
    this.loadTasks();
  }

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      this.currentUser = user;
      if (user) {
        this.loadTasks();
      } else {
        this.tasks = [];
        this.filteredTasks = [];
        this.taskLength = 0;
      }
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
      this.taskLength = tasks.length;
    });
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredTasks = this.tasks.filter(task => task.title.toLowerCase().includes(searchTerm));
  }

  checkComplete(event: any, taskId: string | undefined) {
    if (taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = event.detail.checked;
        this.taskService.updateTask(task);
      }
    }
  }

  async openAddTaskModal() {
    const modal = await this.modalController.create({
      component: AddTaskComponent
    });
    await modal.present();

    // Optionally, handle modal dismissal and refresh tasks
    const { data, role } = await modal.onDidDismiss();
    if (role === 'success') {
      this.loadTasks();
    }
  }

  async openEditTaskModal(task: Task) {
    const modal = await this.modalController.create({
      component: EditTaskComponent,
      componentProps: { task }
    });
    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role === 'success') {
      this.loadTasks();
    }
  }

  // onSearchChange(event: any) {
  //   const searchTerm = event.target.value?.toLowerCase() || '';
  //   if (!searchTerm) {
  //     this.filteredTasks = this.tasks;
  //     return;
  //   }
  //   this.filteredTasks = this.tasks.filter(task =>
  //     (task.title && task.title.toLowerCase().includes(searchTerm)) ||
  //     (task.description && task.description.toLowerCase().includes(searchTerm)) ||
  //     (task.category && task.category.toLowerCase().includes(searchTerm)) ||
  //     (task.priority && task.priority.toLowerCase().includes(searchTerm))
  //   );
  // }

  logout() {
    this.authService.logout();
  }
}