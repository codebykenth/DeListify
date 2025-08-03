import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  isUpdated = false;
  constructor(private swUpdate: SwUpdate, private router: Router) { }

  async ngOnInit() {
    // Service Worker update logic
    this.swUpdate.versionUpdates.subscribe(() => {
      this.swUpdate.checkForUpdate().then(newVersion => {
        if (newVersion && !this.isUpdated && confirm('A new version is available. Do you want to load it?')) {
          this.isUpdated = true;
          window.location.reload();
        }
      });
    });

    // Firebase Auth state logic
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/signin']);
      }
    });
  }
}
