import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnDestroy {

  private subscription: Subscription = new Subscription();
  username;
  password;
  error;
  loading = false;

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>, private translateService: TranslateService,
    private userService: UserService, private authService: AuthService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //Try to login the user
  login(): void {
    this.loading = true;

    this.subscription.add(this.userService.validateUser(this.username, this.password).subscribe(response => {
      //Look if the user is valid or not
      if (response.isValid !== true) {
        this.error = this.translateService.instant('error.userNotfound');
      } else {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.authService.currentUserSubject.next(response.user);
        //Close the dialog
        this.dialogRef.close();
      }
      this.loading = false;
    }, error => {
      //Error handling
      if (error.name === 'NotFound') {
        this.error = this.translateService.instant('error.userNotfound');
      } else {
        this.error = this.translateService.instant('error.unexpected');
      }
      this.loading = false;
    }));
  }
}