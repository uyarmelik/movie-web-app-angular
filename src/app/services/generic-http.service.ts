import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { from, Observable, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GenericHttpService {
  token: string = '';
  isNetlify: boolean = true;
  baseUrl: string = 'https://api.themoviedb.org/3';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {}

  httpGet(url: string): Observable<any> {
    if(this.isNetlify) {
      return from(this.configService.getTokenNetlify()).pipe(
        switchMap((token: string) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
          });
          return this.httpClient.get(`${this.baseUrl}/${url}`, { headers });
        })
      );
    } else {
      this.token = this.configService.getTokenEnv();
      return this.httpClient.get(`${this.baseUrl}/${url}` as any, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

  }
}
