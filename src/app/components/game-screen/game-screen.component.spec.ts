import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GameScreenComponent } from './game-screen.component';
import { GameStateService } from 'src/app/services/game-state.service';
import { GameState } from 'src/app/models/game-state';
import { GamePosition } from 'src/app/models/game-position.enum';
import { INextValue } from 'src/app/models/next-value.interface';
import { SoundService } from 'src/app/services/sound.service';
import { BaboonComponent } from '../baboon/baboon.component';

describe('GameScreenComponent', () => {
  let component: GameScreenComponent;
  let fixture: ComponentFixture<GameScreenComponent>;
  let gameStateServiceMock: any;
  let subscription: any;
  const currentGameState = new GameState();

  beforeEach((() => {

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
        {
          provide: SoundService,
          useValue: {}
        }
      ],
      declarations: [GameScreenComponent, BaboonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment position', fakeAsync(() => {
    // arrange
    let changeObserver: (value?: void) => void;
    gameStateServiceMock.changeGameState.mockReturnValue(new Promise<void>((o) => {
      changeObserver = o;
    }));

    const checkIncrement = (from: GamePosition, expectedPosition: GamePosition) => {
      currentGameState.position = from;
      component.incrementState();
      expect(component.changingState).toBeTruthy();
      const mockCalls = gameStateServiceMock.changeGameState.mock.calls;
      expect(mockCalls[mockCalls.length - 1][0].position).toEqual(expectedPosition);
      changeObserver();
      tick();
      expect(component.changingState).toBeFalsy();
    };

    // act & assert
    checkIncrement(GamePosition.bottom, GamePosition.pos1);
    checkIncrement(GamePosition.pos1, GamePosition.pos2);
    checkIncrement(GamePosition.pos2, GamePosition.pos3);
    checkIncrement(GamePosition.pos3, GamePosition.pos4);
    checkIncrement(GamePosition.pos4, GamePosition.top);
    checkIncrement(GamePosition.top, GamePosition.bottom);
  }));
});
