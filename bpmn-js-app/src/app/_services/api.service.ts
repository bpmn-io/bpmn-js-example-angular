import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

export interface ApiError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  getBpmnXml(url: string): Observable<string> {
    return this.httpClient
      .get(url, {responseType: 'text'})
      .pipe(catchError(this._handleError));
  }

  private _handleError(error: ApiError) {
    return throwError(error.message || 'Could not complete your request; please try again later.');
  }

}
