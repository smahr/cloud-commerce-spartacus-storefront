import { NgModule, ModuleWithProviders } from '@angular/core';
import {
  CxDropdown,
  CxDropdownAnchor,
  CxDropdownToggle,
  CxDropdownMenu,
  CxDropdownItem,
} from './dropdown';

export {
  CxDropdown,
  CxDropdownAnchor,
  CxDropdownToggle,
  CxDropdownMenu,
  CxDropdownItem,
} from './dropdown';
export { CxDropdownConfig } from './dropdown-config';

const NGB_DROPDOWN_DIRECTIVES = [
  CxDropdown,
  CxDropdownAnchor,
  CxDropdownToggle,
  CxDropdownMenu,
  CxDropdownItem,
];

@NgModule({
  declarations: NGB_DROPDOWN_DIRECTIVES,
  exports: NGB_DROPDOWN_DIRECTIVES,
})
export class CxDropdownModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders {
    return { ngModule: CxDropdownModule };
  }
}
