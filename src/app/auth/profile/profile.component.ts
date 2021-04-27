import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AddToFav, RemoveFav } from 'src/app/store/user.action';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user;
  meals;
  mealsLen
  constructor(private store: Store<{ user }>, private auth: AuthService) {
    this.store.select("user").subscribe(data => {
      this.user = data.user
      this.meals = data.fav
      this.mealsLen = this.meals.length
    })
  }

  removeMeal(meal) {
    this.auth.removeFav(meal)
  }

}
