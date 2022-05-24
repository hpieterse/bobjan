
import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { GameStateService } from './game-state.service';
import { ISubscription } from '../models/subscription.interface';
import { INextValue } from '../models/next-value.interface';
import { GameState } from '../models/game-state';
import { GamePosition } from '../models/game-position.enum';
import { Sounds } from '../models/sounds.enum';

@Injectable({
  providedIn: 'root'
})
export class SoundService implements OnDestroy {

  private subscription: ISubscription;
  private rendered: Renderer2;
  private sounds: Map<Sounds, HTMLAudioElement> = new Map();
  constructor(gameStateService: GameStateService, rendererFactory: RendererFactory2) {
    this.subscription = gameStateService.subscribeToStateChanges(this.handleStateChange);
    this.rendered = rendererFactory.createRenderer(null, null);

    Object.keys(Sounds).forEach((sound: Sounds) => {
      const audio = this.rendered.createElement('audio') as HTMLAudioElement;
      audio.src = Sounds[sound];
      this.sounds.set(Sounds[sound], audio);
    });
  }

  private handleStateChange = async (nextState: INextValue<GameState>): Promise<void> => {

    switch (nextState.nextState.position) {
      case GamePosition.pos1:
        await this.playSound(Sounds.verse1);
        break;
      case GamePosition.pos2:
      case GamePosition.pos4:
        await this.playSound(Sounds.chorus);
        break;
      case GamePosition.pos3:
        await this.playSound(Sounds.verse2);
        break;
      case GamePosition.top:
        await this.playSound(Sounds.end);
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private async playSound(sound: Sounds): Promise<void> {
    return new Promise((o) => {
      const audio = this.sounds.get(sound);
      audio.volume = 0.2;
      audio.play();
      audio.onended = () => {
        o();
      };
    });
  }
}
