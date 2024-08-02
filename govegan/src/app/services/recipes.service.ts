import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private apiUserResources = environment.apiUserResources;
  private apiUrlRecetas = environment.apiUrlRecetas;
  private apiUrlComentarios = environment.apiUrlComentarios;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }

  addFavoriteRecipe(recipeId: string): Observable<any> {
    return this.http.patch(`${this.apiUserResources}user-profile/add-favorite-recipe?recipeId=${recipeId}`, {}, { headers: this.getHeaders() });
  }

  removeFavoriteRecipe(recipeId: string): Observable<any> {
    return this.http.delete(`${this.apiUserResources}user-profile/delete-favorite-recipe?recipeId=${recipeId}`, { headers: this.getHeaders() });
  }

  getRecipeById(recipeId: string): Observable<any> {
    return this.http.get(`${this.apiUrlRecetas}recipes/${recipeId}`);
  }

  getAllRecipes(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get(`${this.apiUrlRecetas}recipes`, { params });
  }

  getAllRecipesImages(page: number, size: number): Observable<string[]> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get(`${this.apiUrlRecetas}recipes`, { params }).pipe(
      map((response: any) => {
        const recipes = response.page.content;
        return recipes
          .filter((recipe: any) => recipe.image !== null)
          .map((recipe: any) => recipe.image);
      }),
    );
  }

  getFavoriteRecipes(page: number, size: number): Observable<any> {
    const url = `${this.apiUserResources}user-profile/favorite-recipes`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    return this.http.get(url, { params });
  }

  searchRecipes(query: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('query', query).set('page', page.toString()).set('size', size.toString());
    return this.http.get(`${this.apiUrlRecetas}recipes/search`, { params });
  }

  commentFindById(recipeId: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('recipeId', recipeId).set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.apiUrlComentarios}comments/findByRecipeId`, { params });
  }

  commentFindByUser(username: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('username', username).set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.apiUrlComentarios}comments/findByUsername`, { params });
  }

  commentFindByUserAndRecipeId(username: string, recipeId: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('username', username).set('recipeId', recipeId).set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.apiUrlComentarios}comments/findByUsernameAndRecipeId`, { params });
  }

  postComment(body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrlComentarios}comments`, body, { responseType: 'text' as 'json' });
  }

  postSpecialNeeds(page: number, size: number, body: any): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.post<any>(`${this.apiUrlRecetas}recipes/special-needs`, body, { params });
  }

  addRating(body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrlComentarios}ratings/add`, body, { responseType: 'text' as 'json' });
  }

  getRatingByRecipeId(recipeId: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('recipeId', recipeId).set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.apiUrlComentarios}ratings/findByRecipeId`, { params });
  }

  getRatingByRecipeIdNumber(recipeId: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('recipeId', recipeId).set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.apiUrlComentarios}ratings/findByRecipeId`, { params }).pipe(
      map((response: any) => {
        const ratings = response.content;
        return ratings
          .filter((rating: any) => rating.rating !== null)
          .map((rating: any) => rating.rating);
      }),
    );
  }

  deleteCommentByUsernameAndRecipeId(recipeId: string, username: string): Observable<any> {
    const params = new HttpParams()
      .set('recipeId', recipeId)
      .set('username', username);
    return this.http.delete(`${this.apiUrlComentarios}comments/delete`, { params });
  }
}