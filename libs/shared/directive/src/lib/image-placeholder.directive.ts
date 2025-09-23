import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
} from '@angular/core';

@Directive({ selector: 'img[libImagePlaceholder]' })
export class ImagePlaceholderDirective implements OnInit {
  private readonly elRef = inject(ElementRef<HTMLImageElement>);
  placeholderTarget = input<'image' | 'supplement'>('image');

  ngOnInit(): void {
    if (!this.elRef.nativeElement.src) {
      this._setFallbackSrc();
    }
  }

  @HostListener('error')
  onError(): void {
    this._setFallbackSrc();
  }

  private _setFallbackSrc(): void {
    this.elRef.nativeElement.src = `/assets/images/${this.placeholderTarget() === 'image' ? 'hl-no-image-placeholder' : 'hl-no-supplement-image-placeholder'}.png`;
  }
}
