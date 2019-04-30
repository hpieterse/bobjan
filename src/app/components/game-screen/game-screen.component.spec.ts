import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GameScreenComponent } from './game-screen.component';
import { GameStateService } from 'src/app/services/game-state.service';
import { GameState } from 'src/app/models/game-state';
import { GamePosition } from 'src/app/models/game-position.enum';
import { INextValue } from 'src/app/models/next-value.interface';

describe('GameScreenComponent', () => {
  let component: GameScreenComponent;
  let fixture: ComponentFixture<GameScreenComponent>;
  let gameStateServiceMock;
  let subscription;
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
        }
      ],
      declarations: [GameScreenComponent]
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

  it('should subscribe to state changes', fakeAsync(() => {
    // arrange
    expect(gameStateServiceMock.subscribeToStateChanges.mock.calls.length).toBe(1);
    expect(component.gameState).toEqual({ position: GamePosition.bottom });

    // act
    const newState = new GameState();
    newState.position = GamePosition.pos1;
    const newValue: INextValue<GameState> = {
      currentState: null,
      nextState: newState,
    };

    let done = false;
    gameStateServiceMock.subscribeToStateChanges.mock.calls[0][0](newValue).then(() => {
      done = true;
    });
    tick();

    // assert
    expect(done).toBeTruthy();
    expect(component.gameState.position).toEqual(GamePosition.pos1);
  }));

  it('should unsubscribe on destroy', fakeAsync(() => {
    // act
    component.ngOnDestroy();

    // assert
    expect(subscription.unsubscribe.mock.calls.length).toEqual(1);
  }));

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
