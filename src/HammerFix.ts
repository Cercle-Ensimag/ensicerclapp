import { HammerGestureConfig } from '@angular/platform-browser';
import { Injectable } from "@angular/core";

declare var Hammer: any;

@Injectable()
export class HammerFix extends HammerGestureConfig  {
  buildHammer(element: HTMLElement) {
    return new Hammer(element, {
      touchAction: "pan-y"
    });
  }
}
