import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  getToken(): string {
    return environment.token ||  '';
  }
}
