import { Component, OnDestroy } from '@angular/core';
import { GameStateService } from 'src/app/services/game-state.service';
import { GamePosition } from 'src/app/models/game-position.enum';
import { GameState } from 'src/app/models/game-state';
import { ISubscription } from 'src/app/models/subscription.interface';
import { INextValue } from 'src/app/models/next-value.interface';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent {
  public changingState = false;

  constructor(private gameStateService: GameStateService, _: SoundService) {

  }

  public async incrementState(): Promise<void> {
    const currentPosition = this.gameStateService.currentState.position;

    let next = currentPosition + 1;
    if (next > GamePosition.top) {
      next = GamePosition.bottom;
    }

    const nextState = new GameState();
    nextState.position = next;

    this.changingState = true;
    await this.gameStateService.changeGameState(nextState);
    this.changingState = false;
  }
}
