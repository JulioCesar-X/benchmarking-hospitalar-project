import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, { value: any, expiry: number }>();

  set(key: string, value: any, ttl: number = 300000) { // ttl em milissegundos, padrão 5 minutos
    if (value !== null && value !== undefined) {
      const expiry = Date.now() + ttl;
      this.cache.set(key, { value, expiry });
    }
  }

  get(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    return cached.value;
  }

  has(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  clear() {
    this.cache.clear();
  }
}