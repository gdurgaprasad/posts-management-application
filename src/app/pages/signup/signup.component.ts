import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  isLoading = false;
  form: FormGroup;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  onSignup() {
    this.isLoading = true;
    this.userService
      .createUser(this.form.value.email, this.form.value.password)
      .subscribe(
        (createdUser) => {
          this.isLoading = false;
          console.log(createdUser);
        },
        (err) => {
          const errorMessage = err.error;
          console.log(errorMessage.error.message);
          this.isLoading = false;
        }
      );
  }
}
