import { Translation } from '../../i18n';

export enum GlobalMessageType {
  MSG_TYPE_CONFIRMATION = '[GlobalMessage] Confirmation',
  MSG_TYPE_ERROR = '[GlobalMessage] Error',
  MSG_TYPE_INFO = '[GlobalMessage] Information',
}

export interface GlobalMessage {
  text: Translation | string; //spike new remove
  type: GlobalMessageType;
}
