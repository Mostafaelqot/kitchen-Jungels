import { Injectable } from '@angular/core';
import firebase from "firebase/app";
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { AddToFav, ClearFav, ClearUser, GetUser, isLogin, RemoveFav } from 'src/app/store/user.action';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token
  errorMessage
  userFaceFirstTime = false;


  constructor(
    private fireBaseAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<{ user }>,
    private Http: HttpClient,
    private route: Router
  ) {
    if (localStorage.getItem("token")) {
      this.token = JSON.parse(localStorage.getItem("token"))
    }
  }


  signUp(email, password) {
    console.log("sign up run")
    return this.fireBaseAuth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.token = res.user.uid
        localStorage.setItem('token', JSON.stringify(res.user.uid))
        this.route.navigate(['/profile-form']);
      })
  }

  signIn(email, password) {
    console.log("sign in run")
    return this.fireBaseAuth.signInWithEmailAndPassword(email, password)
      .then(res => {
        localStorage.setItem('token', JSON.stringify(res.user.uid))
        this.token = res.user.uid;
        this.getInfo()
        this.route.navigate(['/home']);
      })
  }

  logout() {
    console.log("logout run")
    localStorage.removeItem("token")
    this.store.dispatch(new ClearUser())
    this.store.dispatch(new isLogin(false))
    this.store.dispatch(new ClearFav())
    this.route.navigate(['/home']);
    //this.store.select("user").subscribe(data => console.log(data))
    // this.fireBaseAuth.signOut()
  }

  setUserInfo(photo, fName, age = null, weight = null, height = null) {
    console.log("setuser run")
    this.firestore.collection("users").doc(this.token).set({
      photo: photo,
      fName: fName,
      age: age,
      weight: weight,
      height: height,
    })
    this.getInfo()
    this.route.navigate(['/home']);
  }

  getInfo() {
    console.log("getinfo run")
    console.log(this.token)
    //get user data
    if (this.token != undefined) {
      this.firestore.collection('users').doc(this.token).get().subscribe(data => {
        this.store.dispatch(new GetUser(data.data()))
        this.store.dispatch(new isLogin(true))
      })
    }
    if (this.token != undefined) {
      this.firestore.collection('meals').doc(this.token).collection(this.token).get().subscribe(data => {
        let meals: {}[] = []
        data.docs.forEach(doc => {
          let meal: {} = {
            ...doc.data(),
            uid: doc.id
          }
          meals.push(meal)
        })
        this.store.dispatch(new AddToFav(meals))
      })
    }
  }




  setFavMeal(meal) {
    this.firestore.collection("meals").doc(this.token).collection(this.token).add(meal)
    this.firestore.collection('meals').doc(this.token).collection(this.token).get().subscribe(data => {
      let meals: {}[] = []
      data.docs.forEach(doc => {
        let meal: {} = {
          ...doc.data(),
          uid: doc.id
        }
        meals.push(meal)
      })
      this.store.dispatch(new AddToFav(meals))
    })

  }
  removeFav(meal) {
    this.store.dispatch(new RemoveFav(meal))
    this.firestore.collection('meals').doc(this.token).collection(this.token).doc(meal.uid).delete()
  }



  facebookLogin() {

    var provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider)
      .then((result) => {
        var user = result.user;
        localStorage.setItem('token', JSON.stringify(user.uid))
        this.token = user.uid
        this.firestore.collection('users').doc(this.token).get().subscribe(data => {
          if (data.data() == undefined) {
            this.setUserInfo(user.photoURL, user.displayName)
            this.userFaceFirstTime = true
            this.route.navigate(['/login']);
          } else {
            this.getInfo()
            this.userFaceFirstTime = false
            this.route.navigate(['/home']);
          }
        })
      })
      .catch((error) => {
        console.log(error)
      });
  }







}
