import { Component } from '@angular/core';
import { AuthService } from '../service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  emailForgotPassword: string;
  resetPasswordIsDisabled: boolean = false;
  countdown: number = 0;

  constructor(private authService: AuthService, private router: Router) { }

  async resetPassword() {
    try {
      await this.authService.resetPassword(this.emailForgotPassword);
      alert('Password reset email sent');
    } catch (error) {
      console.error('Reset password error:', error);
      alert('Reset password failed');
    }
  }

  back() {
    this.router.navigate(['/signin']);
  }
}