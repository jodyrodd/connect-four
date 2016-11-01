import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent }   from './app.component';
import { PlaymatComponent } from './playmat.component';
import { GameBoardComponent } from './board.component';
import { RowComponent } from './row.component';
import { HeadComponent } from './head.component';
import { FormsModule }   from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
        {
            path: '',
            redirectTo: '/games',
            pathMatch: 'full'
        },
        {
            path: 'games',
            component: PlaymatComponent
        }
    ])
  ],
  declarations: [
    AppComponent,
    PlaymatComponent,
    GameBoardComponent,
    HeadComponent,
    RowComponent
   ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
