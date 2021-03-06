import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state';
import { AwaitSubject, ObserverFunction } from '../models/await-subject';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private _stateObservable = new AwaitSubject<GameState>();
  private _currentState = new GameState();
  public get currentState() {
    return this._currentState;
  }

  public subscribeToStateChanges(observer: ObserverFunction<GameState>) {
    return this._stateObservable.subscribe(observer);
  }

  public async changeGameState(nextState: GameState): Promise<void> {
    const oldState = this._currentState;
    this._currentState = nextState;
    await this._stateObservable.next({
      currentState: oldState,
      nextState
    });
  }
}
