import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, delay, exhaustMap, interval, mergeMap, Observable, of, shareReplay, switchMap, take } from 'rxjs';
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

  public getexhaustMapDogs() {
    //The ExhaustMap will ignore any observable in meantime until he finishes the current one.
    return of("hound", "mastiff", "retriever")        //outer observable
    .pipe(
      exhaustMap(breed => {
        const url = 'https://dog.ceo/api/breed/' + breed + '/list';
        return this.http.get<Dogs>(url)       //inner observable
      })
    )
  };

  public concatMapDogs() {
    const delayedObservable = interval(0).pipe(
      take(5),
      concatMap(i => of("hound", "mastiff", "retriever").pipe(delay(Math.random() * 5000))));
    console.log(delayedObservable.subscribe((time) => console.log(time)));
    return  delayedObservable      //outer observable
    .pipe(
      concatMap(breed => {
        const url = 'https://dog.ceo/api/breed/' + breed + '/list';
        return this.http.get<Dogs>(url)       //inner observable
      })
    )
  };
}


/*
-🤯mergeMap: I'm a hard worker, I can prepare multiple orders at the same time ! But I don't respect orders sequence.

-😇concatMap: I respect orders sequence! You will get your order as soon as I finish what I'm currently doing.

-🙄exhaustMap: I'm exhausted ! when I prepare an order, I won't listen to any other order.

-😈switchMap: I'm mean ! your order will be in trash if I receive new one.
*/
