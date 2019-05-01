import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameScreenComponent } from './components/game-screen/game-screen.component';
import { BaboonComponent } from './components/baboon/baboon.component';
import { LandscapeDirective } from './directives/landscape.directive';

@NgModule({
  declarations: [
    AppComponent,
    GameScreenComponent,
    BaboonComponent,
    LandscapeDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
