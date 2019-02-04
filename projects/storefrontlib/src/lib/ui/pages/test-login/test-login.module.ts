import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CartNotEmptyGuard } from '../../../cart/guards/cart-not-empty.guard';
import { CmsPageGuards } from '../../../cms/guards/cms-page.guard';

import { TestLoginComponent } from './test-login.component';

const routes: Routes = [
  {
    path: null,
    canActivate: [CmsPageGuards, CartNotEmptyGuard],
    component: TestLoginComponent,
    data: { pageLabel: 'login', cxPath: 'guest' }
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [TestLoginComponent],
  exports: [TestLoginComponent]
})
export class TestLoginModule {}
