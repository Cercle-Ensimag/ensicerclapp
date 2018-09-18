import {HammerGestureConfig} from '@angular/platform-browser';

declare var Hammer: any;

export class HammerFix extends HammerGestureConfig  {
  buildHammer(element: HTMLElement) {
    return new Hammer(element, {
      touchAction: "pan-y"
    });
  }
}
