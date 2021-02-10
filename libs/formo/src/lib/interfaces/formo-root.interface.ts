import { FormGroup } from '@angular/forms';
import { FormValidationError } from '../validation';
import { FormoArrayType } from './formo-array.interface';
import {
  FormoArrayFieldType,
  FormoBooleanType,
  FormoNumberType,
  FormoStringType,
} from './formo-field.interface';
import { FormoGroupType } from './formo-group.interface';

export interface IFormoRoot<
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends object
> {
  readonly _type: T;
  form: FormGroup;
  control: FormGroup;
  children: {
    [K in keyof T & string]: T[K] extends string
      ? FormoStringType<
          T[K],
          FormoRootType<T>,
          K extends string ? K : string,
          FormoRootType<T>
        >
      : T[K] extends boolean
      ? FormoBooleanType<
          T[K],
          FormoRootType<T>,
          K extends string ? K : string,
          FormoRootType<T>
        >
      : T[K] extends number
      ? FormoNumberType<
          T[K],
          FormoRootType<T>,
          K extends string ? K : string,
          FormoRootType<T>
        >
      : T[K] extends Array<any>
      ? T[K][0] extends string
        ? FormoArrayFieldType<
            T[K],
            FormoRootType<T>,
            K extends string ? K : string,
            FormoRootType<T>
          >
        : T[K][0] extends boolean
        ? FormoArrayFieldType<
            T[K],
            FormoRootType<T>,
            K extends string ? K : string,
            FormoRootType<T>
          >
        : T[K][0] extends number
        ? FormoArrayFieldType<
            T[K],
            FormoRootType<T>,
            K extends string ? K : string,
            FormoRootType<T>
          >
        : FormoArrayType<
            T[K],
            FormoRootType<T>,
            K extends string ? K : string,
            FormoRootType<T>
          >
      : T[K] extends object
      ? FormoGroupType<
          T[K],
          FormoRootType<T>,
          K extends string ? K : string,
          FormoRootType<T>
        >
      : never;
  };
  createForm();
  validationErrors(): FormValidationError[];
  updateValidation(formValue: any);
  prepareForValue(value);
  generateControl();
  valueByPath(pathString: string);
  patchValue(value: Partial<T>);
  setValue(
    value: T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  );
  getValue(): T;
  isValid();
  getChildByKey(key: string | number);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type FormoRootType<T extends object> = IFormoRoot<T>;
