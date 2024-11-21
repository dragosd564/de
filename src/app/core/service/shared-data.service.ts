import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private codigo: any;

  constructor() { }

  setData(data: any) {
    this.codigo = data;
  }

  getData() {
    return this.codigo;
  }
}
