import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SoundService } from './sound.service';
import { GameStateService } from './game-state.service';
import { GamePosition } from '../models/game-position.enum';
import { Renderer2, RendererFactory2 } from '@angular/core';

describe('SoundServiceService', () => {
  let gameStateServiceMock: any;
  let subscription: any;
  let service: SoundService;
  let renderedMock: Renderer2;
  let audioMocks: Array<HTMLAudioElement>;

  beforeEach((() => {
    audioMocks = [];
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
    for (let i = 0; i < 4; i++) {
      const audio = {
        play: jest.fn()
      } as any;
      (renderedMock.createElement as jest.Mock).mockReturnValueOnce(audio);

      audioMocks.push(audio);
    }
  });

  beforeEach(() => {
    service = TestBed.get(SoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  test.each([
    [0, GamePosition.pos1, 'assets/theme_verse1.mp3'],
    [2, GamePosition.pos2, 'assets/theme_chorus.mp3'],
    [1, GamePosition.pos3, 'assets/theme_verse2.mp3'],
    [2, GamePosition.pos4, 'assets/theme_chorus.mp3'],
    [3, GamePosition.top, 'assets/theme_end.mp3'],
  ])(
    'For %s should play %s',
    (audioMockIndex: number, position: number, fileName: string) => {
      // arrange

      // act
      gameStateServiceMock.subscribeToStateChanges.mock.calls[0][0]({ nextState: { position } });
      audioMocks[audioMockIndex].onended({} as any);

      // assert
      expect(audioMocks[audioMockIndex].src).toEqual(fileName);
    },
  );

  it('should play file and finish when done', fakeAsync(() => {
    // act
    let done = false;
    gameStateServiceMock.subscribeToStateChanges.mock.calls[0][0]({ nextState: { position: GamePosition.pos1 } }).then(() => {
      done = true;
    });

    // assert
    expect((audioMocks[0].play as jest.Mock).mock.calls.length).toEqual(1);
    tick();
    expect(done).toBeFalsy();
    audioMocks[0].onended({} as any);
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
