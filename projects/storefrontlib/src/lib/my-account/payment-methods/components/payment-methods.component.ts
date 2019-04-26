import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  PaymentDetails,
  UserService,
  Translation,
  TranslationService,
} from '@spartacus/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { Card, CardAction } from '../../../ui/components/card/card.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cx-payment-methods',
  templateUrl: './payment-methods.component.html',
})
export class PaymentMethodsComponent implements OnInit, OnDestroy {
  paymentMethods$: Observable<PaymentDetails[]>;
  editCard: string;
  loading$: Observable<boolean>;
  userId: string;

  userServiceSub: Subscription;

  constructor(
    private userService: UserService,
    private translation: TranslationService
  ) {}

  ngOnInit(): void {
    this.paymentMethods$ = this.userService.getPaymentMethods();
    this.editCard = null;
    this.loading$ = this.userService.getPaymentMethodsLoading();
    this.userServiceSub = this.userService.get().subscribe(data => {
      this.userId = data.uid;
      this.userService.loadPaymentMethods(this.userId);
    });
  }

  // SPIKE NEW - REQUIRES ASYNC PIPE - UTIL FOR MANY TRANSLATIONS

  getCardContent({
    defaultPayment,
    accountHolderName,
    expiryMonth,
    expiryYear,
    cardNumber,
  }: PaymentDetails): Observable<Card> {
    return this.translation
      .translateMany([
        'common.setAsDefault',
        'common.delete',
        'paymentMethods.deleteConfirmation',
        {
          key: 'paymentForm.expires',
          params: { month: expiryMonth, year: expiryYear },
        },
      ])
      .pipe(
        map(
          ([
            textSetAsDefault,
            textDelete,
            textDeleteConfirmation,
            textExpires,
          ]) => {
            const actions: CardAction[] = [];
            if (!defaultPayment) {
              actions.push({ name: textSetAsDefault, event: 'default' });
            }
            actions.push({ name: textDelete, event: 'edit' });
            const card: Card = {
              header: defaultPayment ? 'DEFAULT' : null,
              textBold: accountHolderName,
              text: [cardNumber, textExpires],
              actions,
              deleteMsg: textDeleteConfirmation,
            };

            return card;
          }
        )
      );
  }

  // // SPIKE NEW - REQUIRES ASYNC PIPE

  // getCardContent({
  //   defaultPayment,
  //   accountHolderName,
  //   expiryMonth,
  //   expiryYear,
  //   cardNumber,
  // }: PaymentDetails): Observable<Card> {
  //   return combineLatest([
  //     this.translation.translate('common.setAsDefault'),
  //     this.translation.translate('common.delete'),
  //     this.translation.translate('paymentMethods.deleteConfirmation'),
  //     this.translation.translate('paymentForm.expires', {
  //       month: expiryMonth,
  //       year: expiryYear,
  //     }),
  //   ]).pipe(
  //     map(
  //       ([
  //         textSetAsDefault,
  //         textDelete,
  //         textDeleteConfirmation,
  //         textExpires,
  //       ]) => {
  //         const actions: CardAction[] = [];
  //         if (!defaultPayment) {
  //           actions.push({ name: textSetAsDefault, event: 'default' });
  //         }
  //         actions.push({ name: textDelete, event: 'edit' });
  //         const card: Card = {
  //           header: defaultPayment ? 'DEFAULT' : null,
  //           textBold: accountHolderName,
  //           text: [cardNumber, textExpires],
  //           actions,
  //           deleteMsg: textDeleteConfirmation,
  //         };

  //         return card;
  //       }
  //     )
  //   );
  // }

  // SPIKE NEW - NEW TRANSLATION

  // getCardContent({
  //   defaultPayment,
  //   accountHolderName,
  //   expiryMonth,
  //   expiryYear,
  //   cardNumber,
  // }: PaymentDetails): Card {
  //   const actions: CardAction[] = [];
  //   if (!defaultPayment) {
  //     actions.push({
  //       name: new Translation('common.setAsDefault'),
  //       event: 'default',
  //     });
  //   }
  //   actions.push({ name: new Translation('common.delete'), event: 'edit' });
  //   const card: Card = {
  //     header: defaultPayment ? new Translation({ raw: 'DEFAULT' }) : null,
  //     textBold: new Translation({ raw: accountHolderName }),
  //     text: [
  //       new Translation({ raw: cardNumber }),
  //       new Translation('paymentForm.expires', {
  //         month: expiryMonth,
  //         year: expiryYear,
  //       }),
  //     ],
  //     actions,
  //     deleteMsg: new Translation('paymentMethods.deleteConfirmation'),
  //   };

  //   return card;
  // }

  // SPIKE OLD:

  // getCardContent({
  //   defaultPayment,
  //   accountHolderName,
  //   expiryMonth,
  //   expiryYear,
  //   cardNumber,
  // }: PaymentDetails): Card {
  //   const actions: { name: string; event: string }[] = [];
  //   if (!defaultPayment) {
  //     actions.push({ name: 'Set as default', event: 'default' });
  //   }
  //   actions.push({ name: 'Delete', event: 'edit' });
  //   const card: Card = {
  //     header: defaultPayment ? 'DEFAULT' : null,
  //     textBold: accountHolderName,
  //     text: [cardNumber, `Expires: ${expiryMonth}/${expiryYear}`],
  //     actions,
  //     deleteMsg: 'Are you sure you want to delete this payment method?',
  //   };

  //   return card;
  // }

  deletePaymentMethod(paymentMethod: PaymentDetails): void {
    if (this.userId) {
      this.userService.deletePaymentMethod(this.userId, paymentMethod.id);
    }
    this.editCard = null;
  }

  setEdit(paymentMethod: PaymentDetails): void {
    this.editCard = paymentMethod.id;
  }

  cancelCard(): void {
    this.editCard = null;
  }

  setDefaultPaymentMethod(paymentMethod: PaymentDetails): void {
    if (this.userId) {
      this.userService.setPaymentMethodAsDefault(this.userId, paymentMethod.id);
    }
  }

  ngOnDestroy(): void {
    if (this.userServiceSub) {
      this.userServiceSub.unsubscribe();
    }
  }
}
