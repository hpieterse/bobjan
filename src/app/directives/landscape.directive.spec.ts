import { LandscapeDirective } from './landscape.directive';
import { ElementRef } from '@angular/core';

describe('LandscapeDirective', () => {
  let element: ElementRef;
  let directive: LandscapeDirective;
  beforeEach(() => {
    element = {
      nativeElement: {
        clientHeight: 100,
        clientWidth: 100,
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
        }
      }
    };

    directive = new LandscapeDirective(element);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should set portrait class on startup', () => {
    // arrange
    element.nativeElement.clientHeight = 101;
    // act
    directive.ngOnInit();

    // assert
    expect(element.nativeElement.classList.add.mock.calls[0][0]).toEqual('portrait');
    expect(element.nativeElement.classList.remove.mock.calls[0][0]).toEqual('landscape');
  });

  it('should set landscape class on startup', () => {
    // arrange
    element.nativeElement.clientHeight = 100;
    // act
    directive.ngOnInit();

    // assert
    expect(element.nativeElement.classList.add.mock.calls[0][0]).toEqual('landscape');
    expect(element.nativeElement.classList.remove.mock.calls[0][0]).toEqual('portrait');
  });

  it('should set portrait class on window resize', () => {
    // arrange
    element.nativeElement.clientHeight = 100;
    window.addEventListener = jest.fn();
    directive.ngOnInit();
    element.nativeElement.clientHeight = 101;

    // act
    (window.addEventListener as jest.Mock).mock.calls[0][1]();

    // assert
    expect((window.addEventListener as jest.Mock).mock.calls[0][0]).toEqual('resize');
    expect(element.nativeElement.classList.add.mock.calls[1][0]).toEqual('portrait');
    expect(element.nativeElement.classList.remove.mock.calls[1][0]).toEqual('landscape');
  });
});
