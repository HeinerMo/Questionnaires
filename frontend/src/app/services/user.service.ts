import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageDTO } from '../models/DataTranferObjects/MessageDTO';
import { ResponseDTO } from '../models/DataTranferObjects/ResponseDTO';
import { Office } from '../models/Office';
import { User } from '../models/User';
import { UserToLogin } from '../models/UserToLogin';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private controllerURL: string;

  constructor(private httpClient: HttpClient) { 
    this.controllerURL = "User";
  }

  public getUserByOffice(officeId: number): Observable<ResponseDTO<User[]>> {
    let params = new HttpParams().set('officeId', officeId);
    return this.httpClient.get<ResponseDTO<User[]>>(`${environment.securityModuleUrl}/${this.controllerURL}/UsersByOffice`, {params: params});
  }

  public getOffices(): Observable<ResponseDTO<Office[]>> {
    return this.httpClient.get<ResponseDTO<Office[]>>(`${environment.securityModuleUrl}/${this.controllerURL}/Offices`);
  }

  public logout() {
    this.setLoggedIn(false);
    this.setRole('');
    return of({ success: this.isLoggedIn, role: this.getRole() });
  }

  public login(user:UserToLogin): Observable<ResponseDTO<User>> {   
    return this.httpClient.post<ResponseDTO<User>>(`${environment.securityModuleUrl}/${this.controllerURL}/Login`, user);
  }

  public getRole() {
    return localStorage.getItem('ROLE')!;
  }

  public setRole(userRole: string) {
    localStorage.setItem('ROLE', userRole);
  }

  public setLoggedIn(isLoggedIn:boolean) {
    if (isLoggedIn) {
      localStorage.setItem('STATE', 'true');
    } else {
      localStorage.setItem('STATE', 'false');
    }
  }

  public isLoggedIn():boolean {
    return (localStorage.getItem('STATE') == 'true');
  }

}
