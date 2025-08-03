import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query } from 'firebase/firestore';
import { Task } from '../models/task.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private firestore = getFirestore(); 
  private tasksCollection = collection(this.firestore, 'tasks');

  constructor() { }

  getTasks(): Observable<Task[]> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return from(Promise.resolve([])); 

    const q = query(this.tasksCollection, where('uid', '==', user.uid));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)))
    );
  }

  addTask(task: Task) {
    return addDoc(this.tasksCollection, task);
  }

  updateTask(task: Task) {
    const taskDoc = doc(this.firestore, `tasks/${task.id}`);
    return updateDoc(taskDoc, { ...task });
  }

  deleteTask(taskId: string) {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    return deleteDoc(taskDoc);
  }
}