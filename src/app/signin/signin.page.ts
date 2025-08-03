import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/authentication.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage {
  email: string;
  password: string;
  loginIsDisabled: boolean = false;
  countdown: number = 0;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private alertController: AlertController
  ) { }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      localStorage.setItem('login', 'true'); // Set login status in local storage
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Signin error:', error);
      alert('Signin failed');
    }
  }

  async signInWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
    } catch (error: any) {
      console.error('Google signin error:', error);
      await this.presentErrorAlert(error.message || 'Google sign in failed');
    }
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Sign In Failed',
      message: message,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

  signup() {
    this.router.navigate(['/signup']);
  }
}