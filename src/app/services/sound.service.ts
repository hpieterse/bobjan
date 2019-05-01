
import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { GameStateService } from './game-state.service';
import { ISubscription } from '../models/subscription.interface';
import { INextValue } from '../models/next-value.interface';
import { GameState } from '../models/game-state';
import { GamePosition } from '../models/game-position.enum';

@Injectable({
  providedIn: 'root'
})
export class SoundService implements OnDestroy {

  private subscription: ISubscription;
  private rendered: Renderer2;
  constructor(gameStateService: GameStateService, rendererFactory: RendererFactory2) {
    this.subscription = gameStateService.subscribeToStateChanges(this.handleStateChange);
    this.rendered = rendererFactory.createRenderer(null, null);
  }

  private handleStateChange = async (nextState: INextValue<GameState>): Promise<void> => {

    switch (nextState.nextState.position) {
      case GamePosition.pos1:
        await this.playSound('assets/theme_verse1.mp3');
        break;
      case GamePosition.pos2:
      case GamePosition.pos4:
        await this.playSound('assets/theme_chorus.mp3');
        break;
      case GamePosition.pos3:
        await this.playSound('assets/theme_verse2.mp3');
        break;
      case GamePosition.top:
        await this.playSound('assets/theme_end.mp3');
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private async playSound(fileName: string): Promise<void> {
    return new Promise((o) => {
      const audio = this.rendered.createElement('audio') as HTMLAudioElement;
      audio.src = fileName;
      audio.play();
      audio.onended = () => {
        o();
      };
    });
  }
}
