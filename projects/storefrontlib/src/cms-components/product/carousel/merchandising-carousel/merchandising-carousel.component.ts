import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CmsComponentData } from '../../../../cms-structure/page/model/cms-component-data';
import { CarouselComponent } from './carouselinitialiser/carousel.component';
import { WindowRef } from '@spartacus/core';
import { OnInit } from '@angular/core';



@Component({
    selector: 'cx-merchandising-carousel',
    templateUrl: './merchandising-carousel-test.component.html',
    //styleUrls: ['./css/owl.carousel.css', './css/acc_old.css', './css/merchandisingaddon.css'],

    // "projects/storefrontlib/src/cms-components/product/carousel/merchandising-carousel/css/owl.carousel.css",
    //"projects/storefrontlib/src/cms-components/product/carousel/merchandising-carousel/css/acc_old.css",
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class MerchandisingCarouselComponent implements OnInit {
    private window: Window;


    constructor(
        public component: CmsComponentData<any>,
        winRef: WindowRef
    ) {
        this.window = winRef.nativeWindow;

    }
    ngOnInit() {
        console.log("window lalal", window);

        this.component.data$.subscribe(data => {
            var componentUid = data.uid;
            console.log("data is ", data);
            var window = this.window;
            CarouselComponent.init();

            setTimeout(function () {
                'use strict';
                console.log('in script');
                var current = {
                    el: window.document.querySelector('#merchcarouselComponent' + componentUid)
                };
                window['__merchcarousels'] = window['__merchcarousels'] || {};
                window['__merchcarousels'][current.el.id] = current;
                console.log('window looks like that:', current);

                if (window['__merchcarousels'].CarouselComponent) {
                    window['__merchcarousels'].CarouselComponent.init();
                }
            });

        });

    }

}