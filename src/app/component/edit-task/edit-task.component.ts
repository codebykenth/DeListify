import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { Task } from '../../models/task.model';
import { ModalController } from '@ionic/angular';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
  @Input() task!: Task; // Receive the task from the modal props

  taskObj: Task = {
    uid: '',
    title: '',
    description: '',
    date: '',
    priority: 'Medium',
    category: 'Work',
    downloadedPhoto: '',
    imgUrl: ''
  };
  originalTask: Task;


  minDate: string = new Date().toISOString();
  selectedFile: File | null = null;

  constructor(
    private taskService: TaskService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    // Pre-fill the form with the task data
    if (this.task) {
      this.taskObj = { ...this.task };
      this.originalTask = { ...this.task };
    }
  }

  hasChanges(): boolean {
    return this.taskObj.title !== this.originalTask.title ||
      this.taskObj.description !== this.originalTask.description ||
      this.taskObj.date !== this.originalTask.date ||
      this.taskObj.priority !== this.originalTask.priority ||
      this.taskObj.category !== this.originalTask.category ||
      !!this.selectedFile;
  }

  async updateTask() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (this.selectedFile) {
        const storage = getStorage();
        const filePath = `tasks/${Date.now()}_${this.selectedFile.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, this.selectedFile);
        const url = await getDownloadURL(storageRef);
        this.taskObj.imgUrl = url;
      }
      if (user) this.taskObj.uid = user.uid;
      await this.taskService.updateTask(this.taskObj);
      await this.modalController.dismiss(null, 'success');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async markAsDone() {
    try {
      if (this.taskObj && this.taskObj.id) {
        await this.taskService.deleteTask(this.taskObj.id);
        await this.modalController.dismiss(null, 'success');
      } else {
        throw new Error('Task ID is missing.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  cancel() {
    this.modalController.dismiss();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.taskObj.downloadedPhoto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}