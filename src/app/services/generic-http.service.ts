import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GenericHttpService {
  baseUrl: string = 'https://api.themoviedb.org/3';
  token: string = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {}

  httpGet(url: string): Observable<any> {
    this.token = this.configService.getToken();
    return this.httpClient.get(`${this.baseUrl}/${url}` as any, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
}
