import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { AddTaskComponent } from '../component/add-task/add-task.component';
import { EditTaskComponent } from '../component/edit-task/edit-task.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
     
  ],
  declarations: [HomePage, AddTaskComponent, EditTaskComponent]
})
export class HomePageModule { }
