import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap, Observable, of, shareReplay, switchMap } from 'rxjs';
import { Dogs } from '../interfaces/dogs.interface';
import { List } from '../interfaces/list.interface';

@Injectable({
  providedIn: 'root'
})
export class RxjsService {

  constructor(private http: HttpClient) { }

  public getColdList(): Observable<any> {
    return this.http.get<List[]>(`https://jsonplaceholder.typicode.com/posts`);
  }

  public getHotList(): Observable<any> {
    return this.http.get<any[]>(`https://jsonplaceholder.typicode.com/posts`).pipe(shareReplay());
  }

  public getMergeMapDogs() {
    //The MergeMap automatically subscribes to all of its inner observable and waits for them to complete. It then pushes the values from them into the subscribers
    return of("hound", "mastiff", "retriever")        //outer observable
    .pipe(
      mergeMap(breed => {
        const url = 'https://dog.ceo/api/breed/' + breed + '/list';
        return this.http.get<Dogs>(url)       //inner observable
      })
    )
  };

  public getSwitchMapdogs() {
    //when the SwitchMap creates the second observable it unsubscribes from all the previous observable, returnning only the last research
    return of("hound", "mastiff", "retriever")        //outer observable
    .pipe(
      switchMap(breed => {
        const url = 'https://dog.ceo/api/breed/' + breed + '/list';
        return this.http.get<Dogs>(url)       //inner observable
      })
    )
  };
}
