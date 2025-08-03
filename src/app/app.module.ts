import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthService } from './service/authentication.service';
import { HomePage } from './home/home.page';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';
import { SigninPage } from './signin/signin.page';
import { SignupPage } from './signup/signup.page';
import { AddTaskComponent } from './component/add-task/add-task.component';
import { TaskService } from './service/task.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    TaskService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    // Initialize Firebase
    initializeApp(environment.firebaseConfig);
  }
}