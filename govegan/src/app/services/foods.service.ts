import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodsService {
  private apiUserResources = environment.apiUserResources;
  private apiUrlRecetas = environment.apiUrlRecetas;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }

  // Favorite Foods
  getFavoriteFoods(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get(`${this.apiUserResources}user-profile/favorite-foods`, { headers: this.getHeaders(), params });
  }

  addFavoriteFood(foodId: string): Observable<any> {
    return this.http.patch(`${this.apiUserResources}user-profile/add-favorite-food?foodId=${foodId}`, {}, { headers: this.getHeaders() });
  }

  removeFavoriteFood(foodId: string): Observable<any> {
    return this.http.delete(`${this.apiUserResources}user-profile/delete-favorite-food?foodId=${foodId}`, { headers: this.getHeaders() });
  }

  isFavoriteFood(foodId: string): Observable<any> {
    return this.http.get(`${this.apiUserResources}user-profile/is-favorite-food?foodId=${foodId}`, { headers: this.getHeaders() });
  }

  // Food Allergies
  getFoodAllergies(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get(`${this.apiUserResources}user-profile/food-alergies`, { headers: this.getHeaders(), params });
  }

  addFoodAllergy(foodId: string): Observable<any> {
    return this.http.patch(`${this.apiUserResources}user-profile/add-food-alergies?foodId=${foodId}`, {}, { headers: this.getHeaders() });
  }

  removeFoodAllergy(foodId: string): Observable<any> {
    return this.http.delete(`${this.apiUserResources}user-profile/delete-food-alergies?foodId=${foodId}`, { headers: this.getHeaders() });
  }

  isFoodAllergy(foodId: string): Observable<any> {
    return this.http.get(`${this.apiUserResources}user-profile/is-food-alergies?foodId=${foodId}`, { headers: this.getHeaders() });
  }

  // Unwanted Foods
  getUnwantedFoods(): Observable<any> {
    return this.http.get(`${this.apiUserResources}user-profile/unwanted-foods`, { headers: this.getHeaders() });
  }

  addUnwantedFood(foodId: string): Observable<any> {
    return this.http.patch(`${this.apiUserResources}user-profile/add-unwanted-food?foodId=${foodId}`, {}, { headers: this.getHeaders() });
  }

  removeUnwantedFood(foodId: string): Observable<any> {
    return this.http.delete(`${this.apiUserResources}user-profile/delete-unwanted-food?foodId=${foodId}`, { headers: this.getHeaders() });
  }

  isUnwantedFood(foodId: string): Observable<any> {
    return this.http.get(`${this.apiUserResources}user-profile/is-unwanted-food?foodId=${foodId}`, { headers: this.getHeaders() });
  }

  // General Food Operations
  getFoodById(foodId: string): Observable<any> {
    return this.http.get(`${this.apiUrlRecetas}foods/${foodId}`);
  }

  getAllFoods(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get(`${this.apiUrlRecetas}foods`, { params });
  }

  searchFoods(name: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('name', name).set('page', page.toString()).set('size', size.toString());
    return this.http.get(`${this.apiUrlRecetas}foods/search`, { params });
  }

  getFoodsCategories(): Observable<any> {
    return this.http.get(`${this.apiUrlRecetas}food-categories`);
  }

  getFoodsByCategory(categoryId: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get(`${this.apiUrlRecetas}foods/category/${categoryId}`, { params });
  }
}