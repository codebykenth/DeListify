import { Injectable } from '@angular/core';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor( private router: Router) {}

  async signup(email: string, password: string): Promise<void> {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);
  }

   async signInWithGoogle(): Promise<void> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      this.router.navigate(['/home']);
      localStorage.setItem("delistify_login", "true")
    } catch (error) {
      console.error('Google signin error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("delistify_login", "true")
  }

  async logout(): Promise<void> {
    const auth = getAuth();
    await signOut(auth);
    this.router.navigate(['/signin']);
    localStorage.removeItem("delistify_login")
  }

  async resetPassword(email: string): Promise<void> {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  }

  canActivate() {
    if (localStorage.getItem('delistify_login') === 'true') {
      // If the user is already logged in even if the page is reloaded the authentication is set to true
      return true;
    } else {
      // Will navigate to router if the user is not logged in
      this.router.navigate(['signin']);
      return false;
    }
  }
}