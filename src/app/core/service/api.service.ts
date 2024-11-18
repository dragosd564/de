import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'https://localhost:44364/index.html'

  constructor(private http: HttpClient,) { }




}
