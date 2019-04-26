import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { TranslationService } from './translation.service';
import { isTranslation, Translation } from './translation';
import { TranslatePipe } from './translate.pipe';

@Pipe({ name: 'cxTranslateOptional', pure: false })
export class TranslateOptionalPipe extends TranslatePipe
  implements PipeTransform, OnDestroy {
  constructor(service: TranslationService, cd: ChangeDetectorRef) {
    super(service, cd);
  }

  transform(input: string | Translation, options: object = {}): string {
    if (!isTranslation(input)) {
      return input;
    }

    const key = input.key;
    options = { ...options, ...input.params };
    return super.transform(key, options);
  }

  // SPIKE REMOVE:

  // transform(input: any | Translation, options: object = {}): string {
  //   if (!input) {
  //     return input;
  //   } else if (input.plain) {
  //     return input.plain;
  //   }

  //   const key = input.i18n ? input.i18n : input; // key can be simply string or property of object
  //   options = { ...options, ...input.i18nParams };
  //   this.translate(key, options);
  //   return this.translatedValue;
  // }

  // private translate(key: any, options: object) {
  //   if (
  //     key !== this.lastKey ||
  //     !shallowEqualObjects(options, this.lastOptions)
  //   ) {
  //     this.lastKey = key;
  //     this.lastOptions = options;

  //     if (this.sub) {
  //       this.sub.unsubscribe();
  //     }
  //     this.sub = this.service
  //       .translate(key, options, true)
  //       .subscribe(val => this.markForCheck(val));
  //   }
  // }

  // private markForCheck(value: string) {
  //   this.translatedValue = value;
  //   this.cd.markForCheck();
  // }

  // ngOnDestroy(): void {
  //   if (this.sub) {
  //     this.sub.unsubscribe();
  //   }
  // }
}
