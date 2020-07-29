import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const user: User = { email, password };
    return this.http.post(`${environment.host}/users/signup`, user);
  }

  login(email: string, password: string) {
    return this.http.post(`${environment.host}/users/login`, {
      email,
      password,
    });
  }
}
