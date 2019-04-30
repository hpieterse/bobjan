import { Injectable, OnDestroy } from '@angular/core';
import { GameStateService } from './game-state.service';
import { ISubscription } from '../models/subscription.interface';
import { INextValue } from '../models/next-value.interface';
import { GameState } from '../models/game-state';

@Injectable({
  providedIn: 'root'
})
export class SoundServiceService implements OnDestroy {

  private subscription: ISubscription;
  constructor(gameStateService: GameStateService) {
    this.subscription = gameStateService.subscribeToStateChanges(this.handleStateChange);
  }

  private async handleStateChange(nextState: INextValue<GameState>): Promise<void> {
    console.log(nextState);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
