import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appLandscape]'
})
export class LandscapeDirective implements OnInit {
  constructor(private elem: ElementRef) {
  }

  ngOnInit(): void {
    this.checkLayout();
    window.addEventListener('resize', () => {
      this.checkLayout();
    });
  }

  private checkLayout() {
    if (this.elem.nativeElement.clientHeight > this.elem.nativeElement.clientWidth) {
      this.elem.nativeElement.classList.add('portrait');
      this.elem.nativeElement.classList.remove('landscape');
    } else {
      this.elem.nativeElement.classList.add('landscape');
      this.elem.nativeElement.classList.remove('portrait');
    }
  }
}
