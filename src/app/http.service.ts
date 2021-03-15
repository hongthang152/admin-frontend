import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getBusiness(id?: any) {
    let params = new HttpParams()
    if(id) params.set('_id', id);
    return this.http.get<any>(`${environment.backend}/business` ,{ params: params })
  }

  getVisit() {
    return this.http.get<any>(`${environment.backend}/visit`);
  }

  createBusiness(body: any) {
    return this.http.post<any>(`${environment.backend}/business` , body);
  }

  updateBusiness(id: string, body: any) {
    return this.http.put<any>(`${environment.backend}/business/${id}`, body);
  }

  deleteBusiness(id: string) {
    return this.http.delete<any>(`${environment.backend}/business/${id}`);
  }
}
