import {Injectable} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';

@Injectable()
export class DeviceSizeService {

  mobileSize: boolean;
  largeSize: boolean;
  currentSize: string;
  watcher: Subscription;

  constructor(
    private media: ObservableMedia
  ) { }

  watchSizeChanges() {
    this.watcher = this.media.subscribe((change: MediaChange) => {
      this.currentSize = change.mqAlias;
      this.setMobileSize(change.mqAlias);
      this.setLargeSize(change.mqAlias);
    });
  }

  start() {
    this.watchSizeChanges();
  }
  stop() {
    this.watcher.unsubscribe();
  }

  private setMobileSize(size: string) {
    if (size == 'xs') {
      this.mobileSize = true;
    } else {
      this.mobileSize = false;
    }
  }

  private setLargeSize(size: string) {
    if (size == 'lg' || size == 'xl') {
      this.largeSize = true;
    } else {
      this.largeSize = false;
    }
  }

}
