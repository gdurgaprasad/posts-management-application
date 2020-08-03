import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";
import { Router } from "@angular/router";
import {
  PAGES,
  RESPONSES,
  SNACKBAR_MESSAGES,
} from "src/app/shared/utils/constant";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  isLoading = false;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  onSignup(): void {
    this.isLoading = true;
    this.userService
      .createUser(this.form.value.email, this.form.value.password)
      .subscribe(
        () => {
          this.snackbar.show(
            SNACKBAR_MESSAGES.SIGNUP_SUCCESS,
            RESPONSES.SUCCESS
          );
          this.isLoading = false;
          this.router.navigate([PAGES.LOGIN]);
        },
        (error) => {
          this.snackbar.show(error, RESPONSES.FAILED);
          this.isLoading = false;
        }
      );
  }
}
