import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { inject } from '@angular/core';
import { TodosService } from './todos.service';

export const routes: Routes = [
  { path: 'all', component: AppComponent },
  { path: 'active', component: AppComponent },
  { path: 'completed', component: AppComponent },
  {
    path: 'cloud',
    resolve: [
      () => {
        inject(TodosService).syncWithCloud();
      },
    ],
    component: AppComponent,
  },
  { path: '', redirectTo: '/all', pathMatch: 'full' },
];
