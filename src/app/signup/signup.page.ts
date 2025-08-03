import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/authentication.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  email: string;
  password: string;
  reEnterPassword: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  login() {
    this.router.navigate(['/signin']);
  }

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Signup Failed',
      message: message,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

  async signup() {
    if (this.password !== this.reEnterPassword) {
      await this.presentErrorAlert('Passwords do not match');
      return;
    }

    try {
      await this.authService.signup(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Signup error:', error);
      await this.presentErrorAlert(error.message || 'Failed to create account');
    }
  }
}