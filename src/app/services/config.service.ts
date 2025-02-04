import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private token: string = '';

  constructor() {
    this.fetchToken();
  }

  async fetchToken() {
    try {
      const response = await fetch('/.netlify/functions/getToken');
      const data = await response.json();
      this.token = data.token || '';
    } catch (error) {
      console.error(error);
      this.token = '';
    }
  }

  async getTokenNetlify(): Promise<string> {
    if (!this.token) {
      await this.fetchToken();
    }
    return this.token;
  }

  getTokenEnv(): string {
    return environment.TMDB_TOKEN || '';
  }
}
