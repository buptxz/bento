import { Injectable } from '@angular/core';
import firebase from 'firebase';


@Injectable()
export class AuthData {
  // Here we declare the variables we'll be using.
  public fireAuth: any;
  public userProfile: any;

  constructor() {
    this.fireAuth = firebase.auth(); // We are creating an auth reference.
    // This declares a database reference for the userProfile/ node.
    this.userProfile = firebase.database().ref('/userProfile');
  }

  /**
   * [loginUser We'll take an email and password and log the user into the firebase app]
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * [signupUser description]
   * This function will take the user's email and password and create a new account on the Firebase app, once it does
   * it's going to log the user in and create a node on userProfile/uid with the user's email address, you can use
   * that node to store the profile information.
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  signupUser(email: string, password: string): any {
    return this.fireAuth.createUserWithEmailAndPassword(email, password).then((newUser) => {
      this.userProfile.child(newUser.uid).set({
        email: email
      });
    });
  }

  /**
   * [resetPassword description]
   * This function will take the user's email address and send a password reset link, then Firebase will handle the
   * email reset part, you won't have to do anything else.
   *
   * @param  {string} email    [User's email address]
   */
  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  /**
   * This function doesn't take any params, it just logs the current user out of the app.
   */
  logoutUser(): any {
    return this.fireAuth.signOut();
  }

  getUser(){
    return this.fireAuth.currentUser;
  }

  createAnonymousUser(): any {
    return this.fireAuth.signInAnonymously();
  }

  linkAccount(email, password): any {
    var credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return this.fireAuth.currentUser.link(credential).then( (user) => {
      this.userProfile.child(user.uid).update({
        email: email,
      });
    }, (error) => {
      console.log("Account linking error", error);
    });
  }

}
