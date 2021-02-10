import {AbstractControl, FormGroup, ValidationErrors} from '@angular/forms';
import * as _ from 'lodash';
import {FormoRootType, IFormoRoot} from './interfaces';
import {FormValidationError} from './validation';

export class FormoRoot<
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends object
> implements IFormoRoot<T>{
  readonly _type: T;
  form: FormGroup;
  control: FormGroup;
  children: FormoRootType<T>['children']

  constructor(children: FormoRootType<T>['children']) {
    this.children = children;
    this.setParent();
    this.setRoot();
  }

  setParent() {
    Object.keys(this.children).forEach((key) => {
      this.children[key].setParent(this);
    });
  }
  setRoot() {
    Object.keys(this.children).forEach((key) => {
      this.children[key].setRoot(this);
    });
  }

  createForm() {
    this.generateControl();
    this.form = this.control;
    Object.keys(this.children).forEach((key) => {
      this.children[key].onGenerateForm(this.form);
    });
  }

  updateValidation(formValue: any) {
    Object.keys(this.children).forEach((key) => {
      this.children[key].updateValidation(formValue);
    });
  }



  prepareForValue(value) {
    Object.keys(this.children).forEach((key) => {
      this.children[key].prepareForValue(_.get(value, key));
    });
  }

  generateControl() {
    this.control = new FormGroup({});
  }


  valueByPath(pathString: string) {
    return;
  }

  path(t: this, name: string) {
    return t[name]
  }
  patchValue(value: Partial<T>) {
    this.prepareForValue(value);
    this.form.patchValue(value);
  }
  setValue(value, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }) {
    this.prepareForValue(value);
    this.form.setValue(value, options);
  }

  getValue() {
    return this.form.value;
  }

  isValid() {
    return this.form.valid;
  }

  getChildByKey(key: string | number) {
    return this.children[key];
  }

 get(prop: string) {
   return this.children[prop]
  }



  validationErrors(): FormValidationError[]{
    let errors: FormValidationError[] = [];
    Object.keys(this.children).forEach((key) => {
      errors = [...errors, ...this.children[key].validationErrors()]
    });
    console.log(errors)
    return errors;
  }
}


export interface FormGroupControls {
  [key: string]: AbstractControl;
}
