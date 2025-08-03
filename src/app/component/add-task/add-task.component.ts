import { Component } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { Task } from '../../models/task.model';
import { ModalController } from '@ionic/angular';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent {
  taskObj: Task = {
    uid: '',
    title: '',
    description: '',
    date: '',
    priority: 'Medium',
    category: 'Work',
    downloadedPhoto: ''
  };
  minDate: string = new Date().toISOString();
  selectedFile: File | null = null;

  constructor(
    private taskService: TaskService,
    private modalController: ModalController,
  ) { }

  async addTask() {
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
      if (user)
        this.taskObj.uid = user.uid; // Add the UID to the task
      await this.taskService.addTask(this.taskObj);
      await this.modalController.dismiss(null, 'success');
    } catch (error) {
      console.error('Error adding task:', error);
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