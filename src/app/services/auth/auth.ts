import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable({ providedIn: 'root' })
export class AuthProvider {
  email:string;
  currUser: BehaviorSubject<any>;
  constructor(public http: HttpClient, public afAuth: AngularFireAuth) {
    this.currUser = new BehaviorSubject(null);
    console.log('Hello AuthProvider Provider');
    this.email = "placeholder";
  }
  doRegister(value){
   return new Promise<any>((resolve, reject) => {
     this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

  doLogin(value){
   return new Promise<any>((resolve, reject) => {
    this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => {
         this.email = value.email
         resolve(res)
        },
       err => reject(err))
   })
  }

	doLogout(){
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut()
      .then(() => {
        resolve();
      }).catch((error) => {
        reject();
      });
    })
  }

  getUser(){
    return this.afAuth.user
  }

}
