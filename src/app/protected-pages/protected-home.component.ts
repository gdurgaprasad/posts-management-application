import { Component } from "@angular/core";
import { UserService } from "../shared/services/user.service";
import { PAGES, SNACKBAR_MESSAGES, RESPONSES } from "../shared/utils/constant";
import { Router } from "@angular/router";
import { SnackbarService } from "../shared/services/snackbar.service";

@Component({
  selector: "app-protected-home",
  templateUrl: "./protected-home.component.html",
  styleUrls: ["./protected-home.component.scss"],
})
export class ProtectedHomeComponent {
  constructor(
    private userService: UserService,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  logout(): void {
    this.userService.logout();
    this.snackbar.show(SNACKBAR_MESSAGES.LOGOUT_SUCCESS, RESPONSES.SUCCESS);
    this.router.navigate([PAGES.PUBLIC]);
  }
}
