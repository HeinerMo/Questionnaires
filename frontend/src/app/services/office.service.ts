import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseDTO } from '../models/DataTranferObjects/ResponseDTO';
import { Office } from '../models/Office';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  private controllerURL: string;

  constructor(private httpClient: HttpClient) { 
    this.controllerURL = "Office";
  }

  public getOffices(): Observable<ResponseDTO<Office[]>> {
    return this.httpClient.get<ResponseDTO<Office[]>>(`${environment.apiUrl}/${this.controllerURL}/GetOffices`);
  }
}