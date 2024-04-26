import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Mapa1Component } from './mapa1/mapa1.component';
import { Mapa2Component } from './mapa2/mapa2.component';

const routes: Routes = [
  { path: '', redirectTo: '/mapa2', pathMatch: 'full' },
  { path: 'mapa1', component: Mapa1Component },
  { path: 'mapa2', component: Mapa2Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
