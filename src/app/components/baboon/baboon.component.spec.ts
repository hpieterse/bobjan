import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaboonComponent } from './baboon.component';
import { GameStateService } from 'src/app/services/game-state.service';
import { GameState } from 'src/app/models/game-state';

describe('BaboonComponent', () => {
  let component: BaboonComponent;
  let fixture: ComponentFixture<BaboonComponent>;
  let gameStateServiceMock: any;
  let subscription: any;
  const currentGameState = new GameState();

  beforeEach(async(() => {
    gameStateServiceMock = {
      subscribeToStateChanges: jest.fn(),
      changeGameState: jest.fn(),
      get currentState() {
        return currentGameState;
      }
    };

    subscription = {
      unsubscribe: jest.fn()
    };
    gameStateServiceMock.subscribeToStateChanges.mockReturnValueOnce(subscription);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: GameStateService,
          useValue: gameStateServiceMock
        },
      ],
      declarations: [ BaboonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaboonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
