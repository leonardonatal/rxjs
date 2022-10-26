import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { Dogs } from '../interfaces/dogs.interface';
import { List } from '../interfaces/list.interface';
import { RxjsService } from '../services/rxjs.service';
import { SnackbarAbstractClass } from '../snackbar/snackbar.abstract';


const hotObservable = (): Observable<number> => {
  const timestamp = Date.now();
  return new Observable((subscriber) => {
    subscriber.next(timestamp);
  })
}

const coldObservable = (): Observable<number> => {
  return new Observable((subscriber) => {
    const timestamp = Date.now();
    subscriber.next(timestamp);
  })
}

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.scss']
})

export class RxjsComponent extends SnackbarAbstractClass implements OnInit {

  /*
      Cold / Hot Observables

      Cold Observables start to emit values only when we subscribe to them.
      Cold Observables are unicast.
      Cold Observables data source is created and activated inside of Observable.

      Hot Observables emit always.
      Hot Observables are multicast (share value between nultiple subscribers).
      Hot Observables data source is created and activated outside of Observable.
      ex: fromEvent(); RxJs Subjects
  */

  subject = new Subject<number>();
  coldList$!: Observable<List[]>;
  hotList$!: Observable<List[]>;
  mergeMapDogs: Dogs[] = [];
  switchMapDogs: Dogs[] = [];
  coldVar1!: number;
  coldVar2!: number;
  hotVar1!: number;
  hotVar2!: number;
  subj1!: number;
  subj2!: number;
  title!: string;

  constructor(private rxjs: RxjsService, snackbar: MatSnackBar) {
    super(snackbar);
    // Real case hot vs cold observables from api
    this.hotList$ = rxjs.getHotList();
    this.coldList$ = rxjs.getColdList();

  }

  ngOnInit(): void {
    this.subscribeToCold();
    this.subscribeToHot();
    this.subscribeToSubject();
    this.mergingMap();
    this.switchingMap();
  }

  public subscribeToCold() {
    // every subscriber gets a new instance
    const obs$ = coldObservable();
    obs$.subscribe((value) => {
      this.coldVar1 = value;
    });

    setTimeout(() => {
      obs$.subscribe((value) => {
        this.coldVar2 = value;
      });
    }, 2000);
  }

  public subscribeToHot() {
    // because it is outside the functions every subscriber will get the same instance of this cached constant
    const obs$ = hotObservable();
    obs$.subscribe((value) => {
      this.hotVar1 = value;
    });

    setTimeout(() => {
      obs$.subscribe((value) => {
        this.hotVar2 = value;
      });
    }, 2000);
  }

  public subscribeToSubject() {
    //  you can see that each time we update the value of the subject, both subscribers get triggered and execute the individual's callback functions.
    this.subject.subscribe((value) => {
      this.subj1 = value;
    });

    this.subject.next(1);

    setTimeout(() => {
      this.subject.subscribe((value) => {
        this.subj2 = value;
      });
      this.subject.next(2);
    }, 3000);
  }

  public mergingMap() {
    this.rxjs.getMergeMapDogs().subscribe((dogs) => {
      this.mergeMapDogs.push(dogs);
    })
  }

  public switchingMap() {
    this.rxjs.getSwitchMapdogs().subscribe((dogs) => {
      this.switchMapDogs.push(dogs);
    })
  }

  public toastMessage(msg: string) {
    this.toast(msg);
  }

}

