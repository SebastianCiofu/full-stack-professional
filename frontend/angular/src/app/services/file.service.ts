import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly customerUrl = `${environment.api.baseUrl}/${environment.api.customerUrl}`;

  constructor(
    private http: HttpClient
  ) { }

  addImageToEvent(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // the key must match the backend's @RequestParam("file")

    return this.http.post(`${this.customerUrl}/${id}/profile-image`, formData);
  }

  getImage(id: number): Observable<any> {
    return this.http.get(`${this.customerUrl}/${id}/profile-image`);
  }
}
