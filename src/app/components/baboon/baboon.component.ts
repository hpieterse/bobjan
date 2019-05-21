import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { GameState } from 'src/app/models/game-state';
import { GamePosition } from 'src/app/models/game-position.enum';
import { ISubscription } from 'src/app/models/subscription.interface';
import { GameStateService } from 'src/app/services/game-state.service';
import { INextValue } from 'src/app/models/next-value.interface';

@Component({
  selector: 'app-baboon',
  templateUrl: './baboon.component.html',
  styleUrls: ['./baboon.component.scss']
})
export class BaboonComponent implements OnDestroy, OnInit {
  private _bpm = 132;
  private _eightNoteMs = Math.round((60 * 1000) / (this._bpm * 2));
  private subscription: ISubscription;

  public x = 0;
  public y = 0;
  public angle = 0;
  public endAnimation = false;

  constructor(private elem: ElementRef, private gameStateService: GameStateService) {
    this.subscription = this.gameStateService.subscribeToStateChanges(this.handleStateChanges);
  }

  @ViewChild('baboon')
  public baboon: ElementRef;

  ngOnInit(): void {
    this.update(GamePosition.bottom);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private handleStateChanges = async (value: INextValue<GameState>): Promise<void> => {
    await this.update(value.nextState.position);
  }

  private async update(position: GamePosition): Promise<void> {
    const targetX = this.getFinalPositionX(position);
    const targetY = this.getFinalPositionY(position);
    const targetA = this.getAngle(position) * 180 / Math.PI;

    let startX = this.getFinalPositionX(position - 1);
    let startY = this.getFinalPositionY(position - 1);
    let startA = this.getAngle(position - 1) * 180 / Math.PI;

    if (position === GamePosition.bottom) {
      startX = 2 * targetX;
      startY = targetY;
      startA = targetA;
    }

    await this.animateJump({
      startX, startY, startA, targetX, targetY, targetA, animationLength: this._eightNoteMs
    });

    if (position === GamePosition.top) {
      await this.endGameAnimation();
      await this.animateJump({
        startX: targetX,
        startY: targetY,
        startA: targetA,
        targetX: targetX + this.baboon.nativeElement.clientWidth * 2,
        targetY,
        targetA,
        animationLength: this._eightNoteMs
      });
      const newState = new GameState();
      newState.position = GamePosition.bottom;
      await this.sleepQuarterNote();
      await this.sleepQuarterNote();
      this.gameStateService.changeGameState(newState);
    }
  }

  private async endGameAnimation(): Promise<void> {
    this.endAnimation = true;

    const standX = this.x;
    const standY = this.y;
    const standA = this.angle;

    const posOneX = this.x + this.baboon.nativeElement.clientWidth / 2;
    const posOneY = this.y + 10;
    const posOneA = 25;
    const posTwoX = this.x;
    const posTwoY = this.y + 10;
    const posTwoA = -25;
    const peak = this.y + this.baboon.nativeElement.clientHeight / 4;
    await this.sleepQuarterNote();
    await this.sleepQuarterNote();
    await this.sleepQuarterNote();
    await this.animateJump({
      startX: standX,
      startY: standY,
      startA: standA,
      targetX: posOneX,
      targetY: posOneY,
      targetA: posOneA,
      peakY: peak,
      animationLength: this._eightNoteMs
    });

    for (let i = 0; i < 3; i++) {
      await this.sleepQuarterNote();
      await this.sleepQuarterNote();
      await this.animateJump({
        startX: posOneX,
        startY: posOneY,
        startA: posOneA,
        targetX: posTwoX,
        targetY: posTwoY,
        targetA: posTwoA,
        peakY: peak,
        animationLength: this._eightNoteMs
      });

      await this.sleepQuarterNote();
      await this.sleepQuarterNote();
      await this.animateJump({
        startX: posTwoX,
        startY: posTwoY,
        startA: posTwoA,
        targetX: posOneX,
        targetY: posOneY,
        targetA: posOneA,
        peakY: peak,
        animationLength: this._eightNoteMs
      });
    }

    await this.sleepQuarterNote();
    await this.sleepQuarterNote();
    await this.animateJump({
      startX: posOneX,
      startY: posOneY,
      startA: posOneA,
      targetX: standX,
      targetY: standY,
      targetA: standA,
      peakY: peak,
      animationLength: this._eightNoteMs
    });

    await this.sleepQuarterNote();
    await this.sleepQuarterNote();
    this.endAnimation = false;
  }

  private async animateJump(p:
    {
      startX: number,
      startY: number,
      startA: number,
      targetX: number,
      targetY: number,
      targetA: number,
      peakY?: number,
      animationLength: number,
    }): Promise<void> {
    return new Promise<void>((done) => {
      let first = true;
      let start = 0;

      const parabolaPeakY = p.peakY == null ? p.startY + this.baboon.nativeElement.clientHeight * 0.6 : p.peakY;
      const parabolaPeakX = p.startX + (p.targetX - p.startX) / 2;

      // calculate parabola through three points
      // https://www.desmos.com/calculator/lac2i0bgum
      const a1 = p.targetX * p.targetX - p.startX * p.startX;
      const b1 = p.targetX - p.startX;
      const d1 = p.targetY - p.startY;
      const a2 = parabolaPeakX * parabolaPeakX - p.targetX * p.targetX;
      const b2 = parabolaPeakX - p.targetX;
      const d2 = parabolaPeakY - p.targetY;
      const bMul = -1 * (b2 / b1);
      const a3 = bMul * a1 + a2;
      const d3 = bMul * d1 + d2;
      const a = d3 / a3;
      const b = (d1 - a1 * a) / b1;
      const c = p.startY - a * p.startX * p.startX - b * p.startX;

      const parabolaFunction = (x: number) => a * x * x + b * x + c;

      const frame = (timeStamp) => {
        if (first) {
          start = timeStamp;
        }
        first = false;

        const timePassed = timeStamp - start;
        if (timePassed < p.animationLength) {
          const completed = timePassed / p.animationLength;
          this.x = p.startX + (p.targetX - p.startX) * completed;
          this.y = parabolaFunction(this.x);
          this.angle = p.startA + (p.targetA - p.startA) * completed;
          window.requestAnimationFrame(frame);
        } else {
          this.x = p.targetX;
          this.y = p.targetY;
          this.angle = p.targetA;
          done();
        }
      };

      window.requestAnimationFrame(frame);
    });
  }

  private getFinalPositionY(position: GamePosition): number {
    switch (position) {
      case GamePosition.bottom:
        return 0;
      case GamePosition.top:
        return this.elem.nativeElement.clientHeight;
      case GamePosition.pos1:
      case GamePosition.pos2:
      case GamePosition.pos3:
      case GamePosition.pos4:
        const x = this.getFinalPositionX(position);
        const angle = this.getAngle(position);
        return Math.round(Math.tan(angle) * x);
    }
  }

  private getFinalPositionX(position: GamePosition): number {
    const rightMost = this.elem.nativeElement.clientWidth;
    const leftMost = -this.baboon.nativeElement.clientWidth;
    const stepWidth = (rightMost - leftMost) / 5;
    switch (position) {
      case GamePosition.bottom:
        return leftMost;
      case GamePosition.pos1:
        return leftMost + stepWidth;
      case GamePosition.pos2:
        return leftMost + stepWidth * 2;
      case GamePosition.pos3:
        return leftMost + stepWidth * 3;
      case GamePosition.pos4:
        return leftMost + stepWidth * 4;
      case GamePosition.top:
        return rightMost;
    }
  }

  private getAngle(position: GamePosition): number {
    switch (position) {
      case GamePosition.top:
      case GamePosition.bottom:
        return 0;
      case GamePosition.pos1:
      case GamePosition.pos2:
      case GamePosition.pos3:
      case GamePosition.pos4:
        return Math.atan(this.elem.nativeElement.clientHeight / this.elem.nativeElement.clientWidth);
    }
  }

  private async sleepQuarterNote(): Promise<void> {
    return new Promise<void>((o) => {
      setTimeout(() => {
        o();
      }, this._eightNoteMs);
    });
  }
}
