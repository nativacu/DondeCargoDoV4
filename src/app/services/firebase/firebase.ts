import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { FirebaseUser } from '../../models/user';
/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable({ providedIn: 'root' })
export class FirebaseProvider implements OnInit {
  usersRef: AngularFireList<any>;      // Reference to users list, Its an Observable
  userRef: AngularFireObject<any>;     // Reference to user object, Its an Observable too
  constructor(public http: HttpClient, private db: AngularFireDatabase) {
    console.log('Hello FirebaseProvider Provider');
  }
  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.usersRef = this.db.list('users');
  }
  // Create User
  AddUser(user: FirebaseUser) {
    this.usersRef.push({
      name: user.name,
      email: user.email,
      type: user.type
    });
  }
  // Read User
  GetUser(id: string) {
    this.userRef = this.db.object('users/' + id);
    return this.userRef;
  }

  // Read Users List
  GetUsersList() {
    this.usersRef = this.db.list('users');
    return this.usersRef;
  }
  // Update User
  async UpdateUser(user: FirebaseUser) {
    await this.userRef.update({
      name: user.name,
      email: user.email,
      type: user.type
    });
  }
  // Delete User
  DeleteUser(id: string) {
    this.userRef = this.db.object('users/' + id);
    this.userRef.remove();
  }
}
