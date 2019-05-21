import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BaboonComponent } from './baboon.component';
import { GameStateService } from 'src/app/services/game-state.service';
import { GameState } from 'src/app/models/game-state';
import { INextValue } from 'src/app/models/next-value.interface';
import { GamePosition } from 'src/app/models/game-position.enum';

describe('BaboonComponent', () => {
  let component: BaboonComponent;
  let fixture: ComponentFixture<BaboonComponent>;
  let gameStateServiceMock: any;
  let subscription: any;
  const currentGameState = new GameState();
  const eightNoteMs = Math.round((60 * 1000) / (132 * 2));

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
      declarations: [BaboonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaboonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    window.requestAnimationFrame = jest.fn();

    component.baboon = {
      nativeElement: {
        clientHeight: 100,
        clientWidth: 50
      }
    };

    /* tslint:disable:no-string-literal */
    component['elem'].nativeElement = {
      /* tslint:enable:no-string-literal */
      clientHeight: 450,
      clientWidth: 450
    };
  });

  it('should start at start position', () => {
    // act
    component.ngOnInit();
    (window.requestAnimationFrame as jest.Mock).mock.calls[0][0](1000);
    (window.requestAnimationFrame as jest.Mock).mock.calls[0][0](2000);

    // assert
    expect(component.x).toEqual(-50);
    expect(component.y).toEqual(0);
    expect(component.angle).toEqual(0);
  });

  it('should unsubscribe on destroy', fakeAsync(() => {
    // act
    component.ngOnDestroy();

    // assert
    expect(subscription.unsubscribe.mock.calls.length).toEqual(1);
  }));

  it('should animate initial position', fakeAsync(() => {
    // arrange
    const nextValue: INextValue<GameState> = {
      nextState: {
        position: GamePosition.bottom
      },
      currentState: null,
    };

    // act
    let done = false;
    (gameStateServiceMock.subscribeToStateChanges as jest.Mock).mock.calls[0][0](nextValue).then(() => {
      done = true;
    });

    // assert

    // first frame
    (window.requestAnimationFrame as jest.Mock).mock.calls[0][0](1000);
    expect(component.x).toEqual(-100);
    expect(component.y).toEqual(0);
    expect(component.angle).toEqual(0);

    // middle
    (window.requestAnimationFrame as jest.Mock).mock.calls[0][0](1000 + eightNoteMs / 2);
    expect(component.x).toEqual(-75);
    expect(component.y).toEqual(60);
    expect(component.angle).toEqual(0);

    tick();
    expect(done).toBeFalsy();

    // finish
    (window.requestAnimationFrame as jest.Mock).mock.calls[0][0](1000 + eightNoteMs);
    expect(component.x).toEqual(-50);
    expect(component.y).toEqual(0);
    expect(component.angle).toEqual(0);

    tick();
    expect(done).toBeTruthy();
  }));

  it('should animate pos 1', fakeAsync(() => {
    // arrange
    const nextValue: INextValue<GameState> = {
      nextState: {
        position: GamePosition.pos1
      },
      currentState: null,
    };

    // act
    let done = false;
    (gameStateServiceMock.subscribeToStateChanges as jest.Mock).mock.calls[0][0](nextValue).then(() => {
      done = true;
    });

    // assert

    // first frame
    (window.requestAnimationFrame as jest.Mock).mock.calls[0][0](1000);
    expect(component.x).toEqual(-50);
    expect(component.y).toEqual(0);
    expect(component.angle).toEqual(0);

    // middle
    (window.requestAnimationFrame as jest.Mock).mock.calls[0][0](1000 + eightNoteMs / 2);
    expect(component.x).toEqual(0);
    expect(component.y).toEqual(60);
    expect(component.angle).toEqual(45 / 2);

    tick();
    expect(done).toBeFalsy();

    // finish
    (window.requestAnimationFrame as jest.Mock).mock.calls[0][0](1000 + eightNoteMs);
    expect(component.x).toEqual(50);
    expect(component.y).toEqual(50);
    expect(component.angle).toEqual(45);

    tick();
    expect(done).toBeTruthy();
  }));

  it('should animate pos 2 to pos 4', fakeAsync(() => {
    // arrange
    const nextValue: INextValue<GameState> = {
      nextState: {
        position: GamePosition.pos3
      },
      currentState: null,
    };

    const delta = 100;
    const peakDelta = 60;

    let startX = 50;
    let startY = 50;

    const testJump = (position: GamePosition) => {
      // arrange
      nextValue.nextState.position = position;

      // act
      let done = false;
      (gameStateServiceMock.subscribeToStateChanges as jest.Mock).mock.calls[0][0](nextValue).then(() => {
        done = true;
      });

      // first frame
      const frameMethodCount = (window.requestAnimationFrame as jest.Mock).mock.calls.length;
      const frameMethod = (window.requestAnimationFrame as jest.Mock).mock.calls[frameMethodCount - 1][0];
      frameMethod(1000);
      expect(component.x).toEqual(startX);
      expect(component.y).toEqual(startY);
      expect(component.angle).toEqual(45);

      // middle
      frameMethod(1000 + eightNoteMs / 2);
      expect(component.x).toEqual(startX + delta / 2);
      expect(component.y).toEqual(startY + peakDelta);
      expect(component.angle).toEqual(45);

      tick();
      expect(done).toBeFalsy();

      // finish
      frameMethod(1000 + eightNoteMs);

      startX += delta;
      startY += delta;
      expect(component.x).toEqual(startX);
      expect(component.y).toEqual(startY);
      expect(component.angle).toEqual(45);

      tick();
      expect(done).toBeTruthy();
    };

    // act & assert
    testJump(GamePosition.pos2);
    testJump(GamePosition.pos3);
    testJump(GamePosition.pos4);
  }));

  it('should animate top', fakeAsync(() => {
    // arrange
    const nextValue: INextValue<GameState> = {
      nextState: {
        position: GamePosition.top
      },
      currentState: null,
    };

    // act
    let done = false;
    (gameStateServiceMock.subscribeToStateChanges as jest.Mock).mock.calls[0][0](nextValue).then(() => {
      done = true;
    });

    // assert

    // first jump frame
    (window.requestAnimationFrame as jest.Mock).mock.calls[0][0](1000);
    expect(component.x).toEqual(350);
    expect(component.y).toEqual(350);
    expect(component.angle).toEqual(45);

    // middle jump
    (window.requestAnimationFrame as jest.Mock).mock.calls[0][0](1000 + eightNoteMs / 2);
    expect(component.x).toEqual(400);
    expect(component.y).toEqual(410);
    expect(component.angle).toEqual(45 / 2);

    // finish jump
    (window.requestAnimationFrame as jest.Mock).mock.calls[0][0](1000 + eightNoteMs);
    expect(component.x).toEqual(450);
    expect(component.y).toEqual(450);
    expect(component.angle).toEqual(0);

    // end animation
    const testDanceMove1 = () => {
      const frameMethodCount = (window.requestAnimationFrame as jest.Mock).mock.calls.length;
      const frameMethod = (window.requestAnimationFrame as jest.Mock).mock.calls[frameMethodCount - 1][0];
      frameMethod(1000);
      expect(component.x).toEqual(450);
      expect(component.y).toEqual(450);
      expect(component.angle).toEqual(0);

      frameMethod(1000 + eightNoteMs);
      expect(component.x).toEqual(475);
      expect(component.y).toEqual(460);
      expect(component.angle).toEqual(25);
    };

    const testDanceMove2A = () => {
      const frameMethodCount = (window.requestAnimationFrame as jest.Mock).mock.calls.length;
      const frameMethod = (window.requestAnimationFrame as jest.Mock).mock.calls[frameMethodCount - 1][0];
      frameMethod(1000);
      expect(component.x).toEqual(475);
      expect(component.y).toEqual(460);
      expect(component.angle).toEqual(25);

      frameMethod(1000 + eightNoteMs);
      expect(component.x).toEqual(450);
      expect(component.y).toEqual(460);
      expect(component.angle).toEqual(-25);
    };
    const testDanceMove2B = () => {
      const frameMethodCount = (window.requestAnimationFrame as jest.Mock).mock.calls.length;
      const frameMethod = (window.requestAnimationFrame as jest.Mock).mock.calls[frameMethodCount - 1][0];
      frameMethod(1000);
      expect(component.x).toEqual(450);
      expect(component.y).toEqual(460);
      expect(component.angle).toEqual(-25);

      frameMethod(1000 + eightNoteMs);
      expect(component.x).toEqual(475);
      expect(component.y).toEqual(460);
      expect(component.angle).toEqual(25);
    };

    const testDanceMove2 = () => {
      const frameMethodCount = (window.requestAnimationFrame as jest.Mock).mock.calls.length;
      const frameMethod = (window.requestAnimationFrame as jest.Mock).mock.calls[frameMethodCount - 1][0];
      frameMethod(1000);
      expect(component.x).toEqual(475);
      expect(component.y).toEqual(460);
      expect(component.angle).toEqual(25);

      frameMethod(1000 + eightNoteMs);
      expect(component.x).toEqual(450);
      expect(component.y).toEqual(450);
      expect(component.angle).toEqual(0);
    };

    const testEndJump = () => {
      const frameMethodCount = (window.requestAnimationFrame as jest.Mock).mock.calls.length;
      const frameMethod = (window.requestAnimationFrame as jest.Mock).mock.calls[frameMethodCount - 1][0];
      frameMethod(1000);
      expect(component.x).toEqual(450);
      expect(component.y).toEqual(450);
      expect(component.angle).toEqual(0);

      frameMethod(1000 + eightNoteMs);
      expect(component.x).toEqual(550);
      expect(component.y).toEqual(450);
      expect(component.angle).toEqual(0);
    };

    tick(eightNoteMs * 3);
    expect(component.endAnimation).toBeTruthy();
    testDanceMove1();

    tick(eightNoteMs * 2);
    testDanceMove2A();
    tick(eightNoteMs * 2);
    testDanceMove2B();

    tick(eightNoteMs * 2);
    testDanceMove2A();
    tick(eightNoteMs * 2);
    testDanceMove2B();

    tick(eightNoteMs * 2);
    testDanceMove2A();
    tick(eightNoteMs * 2);
    testDanceMove2B();

    tick(eightNoteMs * 2);
    testDanceMove2();

    tick(eightNoteMs * 2);
    expect(component.endAnimation).toBeFalsy();
    testEndJump();

    tick(eightNoteMs * 2);
    expect(gameStateServiceMock.changeGameState.mock.calls[0].length).toBe(1);
    expect(gameStateServiceMock.changeGameState.mock.calls[0][0].position).toBe(GamePosition.bottom);

    expect(done).toBeTruthy();
  }));
});
