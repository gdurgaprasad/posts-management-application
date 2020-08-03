import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { User, LoginResponse } from "../models/user.model";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public currentUser: Observable<LoginResponse>;

  private currentUserSubject: BehaviorSubject<LoginResponse>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<LoginResponse>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoginResponse {
    return this.currentUserSubject.value;
  }

  createUser(email: string, password: string) {
    const user: User = { email, password };
    return this.http.post(`${environment.host}/users/signup`, user);
  }

  login(email: string, password: string) {
    const data = { email, password };
    return this.http
      .post<LoginResponse>(`${environment.host}/users/login`, data)
      .pipe(
        map((response) => {
          if (response && response.token) {
            localStorage.setItem("currentUser", JSON.stringify(response));
            this.currentUserSubject.next(response);
            return response;
          }
        })
      );
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.clear();
  }
}
