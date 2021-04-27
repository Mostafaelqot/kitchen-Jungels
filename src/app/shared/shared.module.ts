
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { ModalComponent } from './modal/modal.component';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TopscrollComponent } from './topscroll/topscroll.component';
import { StoreModule } from '@ngrx/store';
import { userReducer } from '../store/user.reducer';
import { SpinnerComponent } from './spinner/spinner.component';


@NgModule({
  declarations: [
    FooterComponent,
    NavBarComponent,
    TopscrollComponent,
    ModalComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    StoreModule.forRoot({ user: userReducer }),
  ],
  exports :[
    FooterComponent,
    NavBarComponent,
    TopscrollComponent,
    ModalComponent,
    SpinnerComponent
  ]
})
export class SharedModule { }
