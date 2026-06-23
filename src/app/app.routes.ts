import { Routes } from '@angular/router';
import { MenuComponent } from '../app/snake/pages/menu/menu'; // Ajuste o caminho se precisar
import { GameContainerComponent } from '../app/snake/pages/game-container/game-container'; // Ajuste o caminho se precisar

export const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'game', component: GameContainerComponent },
  { path: '**', redirectTo: '' } 
];