import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchandisingCarouselComponent } from './merchandising-carousel.component';
import { ConfigModule } from '@spartacus/core';
import { CmsConfig } from '@spartacus/core';


@NgModule({
    imports: [
        CommonModule,
        ConfigModule.withConfig(<CmsConfig>{
            cmsComponents: {
                MerchandisingCarouselComponent: { selector: 'cx-merchandising-carousel' },
            },
        }),
    ],
    declarations: [MerchandisingCarouselComponent],
    exports: [MerchandisingCarouselComponent],
    entryComponents: [MerchandisingCarouselComponent],
})
export class MerchandisingCarouselModule { }