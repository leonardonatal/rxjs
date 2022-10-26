import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export abstract class SnackbarAbstractClass {

  constructor(private snackbar: MatSnackBar) { }

  /*
   Abstract classes cannot be instantiated
  In abstract classes, you can easily inject dependencies into it and the derived classes are able to access the methods
  that fetch the data from your backend once and shared it across all the derived classes.
  */

  toast(msg: string) {
    this.snackbar.open(msg);
  }

}
