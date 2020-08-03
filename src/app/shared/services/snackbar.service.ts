import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2500,
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
}
