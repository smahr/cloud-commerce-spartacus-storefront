// export interface Translation {
//   key?: string;
//   params?: { [param: string]: any };
//   raw?: { [param: string]: any };
// }

// // export type OptionalTranslation = string | Translation;

// export function isTranslation(input: any): input is Translation {
//   return input && (<Translation>input).i18n !== undefined;
// }

export class Translation {
  key: string;
  params: { [param: string]: any };
  raw: string;

  constructor(key: any | { raw: string }, params?: { [param: string]: any }) {
    if (key && (<any>key).raw) {
      this.raw = (<any>key).raw;
    } else {
      this.key = key as string;
      this.params = params;
    }
  }
}

export function isTranslation(input: any): input is Translation {
  return (
    input &&
    ((<Translation>input).key !== undefined ||
      (<Translation>input).raw !== undefined)
  );
}
