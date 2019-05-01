import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { GameScreenComponent } from './components/game-screen/game-screen.component';
import { SoundService } from './services/sound.service';
import { BaboonComponent } from './components/baboon/baboon.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        {
          provide: SoundService,
          value: {}
        }
      ],
      declarations: [
        AppComponent,
        GameScreenComponent,
        BaboonComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
