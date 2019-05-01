import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GameStateService } from './game-state.service';
import { GameState } from '../models/game-state';
import { GamePosition } from '../models/game-position.enum';
import { INextValue } from '../models/next-value.interface';

describe('GameStateService', () => {
  let service: GameStateService;
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(GameStateService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should observe state changes', fakeAsync(() => {
    const nextState = new GameState();
    let subscribedObserver: (nextValue: void) => void;
    nextState.position = GamePosition.pos2;

    let nextValueReported: INextValue<GameState>;
    service.subscribeToStateChanges((nextValue): Promise<void> => {
      return new Promise<void>((o) => {
        nextValueReported = nextValue;
        subscribedObserver = o;
      });
    });

    // act
    let stateChangeDone = false;
    service.changeGameState(nextState).then(() => {
      stateChangeDone = true;
    });
    tick();

    // assert
    expect(nextValueReported).toEqual({
      currentState: { position: 0 },
      nextState: { position: 2 }
    });

    // make sure the state change is awaited
    expect(stateChangeDone).toBeFalsy();
    subscribedObserver();
    tick();
    expect(stateChangeDone).toBeTruthy();
  }));

  it('should handle unsubscribe', fakeAsync(() => {
    const nextState = new GameState();

    nextState.position = GamePosition.pos2;

    let called = false;
    const subscription = service.subscribeToStateChanges(async (_): Promise<void> => {
      called = true;
    });
    subscription.unsubscribe();

    // act
    let stateChangeDone = false;
    service.changeGameState(nextState).then(() => {
      stateChangeDone = true;
    });
    tick();

    // assert
    expect(called).toBeFalsy();
    expect(stateChangeDone).toBeTruthy();
    expect(service.currentState.position).toEqual(GamePosition.pos2);
  }));
});
