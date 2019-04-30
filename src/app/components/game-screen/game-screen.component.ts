import { Component, OnDestroy } from '@angular/core';
import { GameStateService } from 'src/app/services/game-state.service';
import { GamePosition } from 'src/app/models/game-position.enum';
import { GameState } from 'src/app/models/game-state';
import { ISubscription } from 'src/app/models/subscription.interface';
import { INextValue } from 'src/app/models/next-value.interface';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnDestroy {
  private subscription: ISubscription;

  public gameState: GameState;
  public changingState = false;

  constructor(private gameStateService: GameStateService) {
    this.subscription = this.gameStateService.subscribeToStateChanges(this.handleStateChanges);
    this.gameState = this.gameStateService.currentState;
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

  private handleStateChanges = async (value: INextValue<GameState>): Promise<void> => {
    this.gameState = Object.assign({}, value.nextState);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
