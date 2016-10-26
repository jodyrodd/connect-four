import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { GameBoardComponent } from './board.component';
import { RowComponent } from './row.component';
import { HeadComponent } from './head.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [
    AppComponent,
    GameBoardComponent,
    HeadComponent,
    RowComponent
   ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
