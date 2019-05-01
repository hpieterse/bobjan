import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SoundService } from './sound.service';
import { GameStateService } from './game-state.service';
import { GamePosition } from '../models/game-position.enum';
import { Renderer2, RendererFactory2 } from '@angular/core';

describe('SoundServiceService', () => {
  let gameStateServiceMock;
  let subscription;
  let service: SoundService;
  let renderedMock: Renderer2;

  beforeEach((() => {

    gameStateServiceMock = {
      subscribeToStateChanges: jest.fn(),
      changeGameState: jest.fn(),
    };

    subscription = {
      unsubscribe: jest.fn()
    };
    gameStateServiceMock.subscribeToStateChanges.mockReturnValueOnce(subscription);

    renderedMock = { createElement: jest.fn() } as any;
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GameStateService,
          useValue: gameStateServiceMock
        },
        {
          provide: RendererFactory2,
          useValue: {
            createRenderer: () => renderedMock
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {

  });

  beforeEach(() => {
    service = TestBed.get(SoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  test.each([
    [GamePosition.pos1, 'assets/theme_verse1.mp3'],
    [GamePosition.pos2, 'assets/theme_chorus.mp3'],
    [GamePosition.pos3, 'assets/theme_verse2.mp3'],
    [GamePosition.pos4, 'assets/theme_chorus.mp3'],
    [GamePosition.top, 'assets/theme_end.mp3'],
  ])(
    'For %s should play %s',
    (position, fileName) => {
      // arrange
      const audio: HTMLAudioElement = {
        play: jest.fn()
      } as any;

      (renderedMock.createElement as jest.Mock).mockReturnValueOnce(audio);

      // act
      gameStateServiceMock.subscribeToStateChanges.mock.calls[0][0]({ nextState: { position } });
      audio.onended({} as any);

      // assert
      expect(audio.src).toEqual(fileName);
    },
  );

  it('should play file and finish when done', fakeAsync(() => {
    const audio: HTMLAudioElement = {
      play: jest.fn()
    } as any;

    (renderedMock.createElement as jest.Mock).mockReturnValueOnce(audio);

    // act
    let done = false;
    gameStateServiceMock.subscribeToStateChanges.mock.calls[0][0]({ nextState: { position: GamePosition.pos1 } }).then(() => {
      done = true;
    });

    // assert
    expect((audio.play as jest.Mock).mock.calls.length).toEqual(1);
    tick();
    expect(done).toBeFalsy();
    audio.onended({} as any);
    tick();
    expect(done).toBeTruthy();
  }));

  it('should unsubscribe on destroy', fakeAsync(() => {
    // act
    service.ngOnDestroy();

    // assert
    expect(subscription.unsubscribe.mock.calls.length).toEqual(1);
  }));
});
