import {Injectable} from '@angular/core';

import {Subject, pipe} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';

@Injectable()
export class DeviceSizeService {

  mobileSize: boolean;
  largeSize: boolean;
  currentSize: string;
	private unsubscribe: Subject<void> = new Subject();

  constructor(
    private media: ObservableMedia
  ) { }

  watchSizeChanges() {
    this.media.asObservable().pipe(
			takeUntil(this.unsubscribe)
		).subscribe((change: MediaChange) => {
      this.currentSize = change.mqAlias;
      this.setMobileSize(change.mqAlias);
      this.setLargeSize(change.mqAlias);
    });
  }

  start() {
    this.watchSizeChanges();
  }
  stop() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private setMobileSize(size: string) {
    this.mobileSize = size == 'xs';
  }

  private setLargeSize(size: string) {
    this.largeSize = size == 'lg' || size == 'xl';
  }

}
