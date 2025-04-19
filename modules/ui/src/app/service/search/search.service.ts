import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchServiceConstants} from './search.service.constants';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private readonly http: HttpClient) { }

  search(query: string) {
    return this.http.post(SearchServiceConstants.SEARCH_BASE_URL, {query})
      .pipe(
        map((response: any) => {
          console.log(response);
          return response;
        }),
        catchError(err => {
          console.error(err);
          return of({error: 'Error searching'});
        })
      );
  }
}
