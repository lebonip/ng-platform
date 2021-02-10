import {FormArray, FormGroup, ValidationErrors} from '@angular/forms';
import {FormoArrayType, FormoRootType, IFormoArray,} from './interfaces';
import {FormValidationError} from './validation';

export class FormoArray<
  T extends Array<any>,
  R extends FormoRootType<any>,
  N extends string,
  P = any,
  RT = R['_type']
> implements IFormoArray<T, R, N, P> {
  root: R;
  parent: P;
  key: N;
  control: FormArray;
  model: FormoArrayType<T, R, N, P>['model'];
  children: ReturnType<FormoArray<T, R, N, P>['model']>[];
  config: FormoArrayType<T, R, N, P>['config'];
  listeners: FormoArrayType<T, R, N, P>['listeners'];
  absolutePath: string;

  constructor(
    key: N,
    model: FormoArrayType<T, R, N, P>['model'],
    config: FormoArrayType<T, R, N, P>['config'] = {},
    listeners: FormoArrayType<T, R, N, P>['listeners'] = {}
  ) {
    this.key = key;
    this.model = model;
    this.children = [];
    this.generateControl();
    this.setConfig(config);
    this.setListeners(listeners);
    if (this.listeners.valueChanged) {
      this.control.valueChanges.subscribe((value) => {
        this.valueChanged(value);
      });
    }
  }

  onGenerateForm(parent: FormGroup | FormArray) {
    if (parent instanceof FormArray) {
      parent.push(this.control);
    } else {
      parent.addControl(this.key, this.control);
    }
  }

  setValue(
    value: T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ) {
    this.removeAllChildren();
    for (let i = 0; i < value.length; i++) {
      this.addModel();
    }
    this.setParent(this.parent);
    this.setRoot(this.root);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].prepareForValue(value);
    }
    this.control.setValue(value, options);
  }

  prepareForValue(value: []) {
    this.removeAllChildren();
    if (value && Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        this.addModel();
      }
      this.setParent(this.parent);
      this.setRoot(this.root);
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].prepareForValue(value[i]);
      }
    }
  }

  addModel(
    value?: T[0],
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ) {
    const clone = this.model();
    clone.onGenerateForm(this.control);
    if (value) {
      clone.control.setValue(value, options);
    }
    this.children.push(clone);
    this.setParent(this.parent);
    this.setRoot(this.root);
  }

  removeAt(index: number) {
    this.control.removeAt(index);
    this.children = this.children.filter((v, i) => i !== index);
  }

  removeAllChildren() {
    while (this.control.length !== 0) {
      this.control.removeAt(0);
    }
    this.children = [];
  }

  generateControl() {
    this.control = new FormArray([]);
  }

  getChildByPath(key, nextPath: string[] = []) {
    if (nextPath.length > 0) {
      const futureKey = nextPath[0];
      const futurePath = nextPath.filter((item, i) => i !== 0);
      return (this.children[key] as any).getChildByPath(futureKey, futurePath);
    }
    return this.children[key];
  }

  updateValidation(formValue: any) {
    this.listeners.onUpdateValidation(this.root, this);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateValidation(formValue);
    }
  }

  valueChanged(value: T) {
    this.listeners.valueChanged(this.root, this, value);
  }
  formValueChanged(value: RT) {
    this.listeners.formValueChanged(this.root, this, value);
  }

  setParent(parent: P) {
    this.parent = parent;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setParent(this);
    }
  }
  setRoot(root: R) {
    this.root = root;
    if (this.listeners.formValueChanged) {
      this.root.control.valueChanges.subscribe((value) => {
        this.formValueChanged(value);
      });
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setRoot(root);
    }
  }

  getValue(): T {
    return this.control.value;
  }

  setConfig(config: FormoArrayType<T, R, N, P>['config']) {
    this.config = {
      visible: config.visible || true,
    };
  }
  setListeners(listeners: FormoArrayType<T, R, N, P>['listeners']) {
    this.listeners = {
      onUpdateValidation:
        listeners.onUpdateValidation === undefined
          ? undefined
          : listeners.onUpdateValidation,
      valueChanged:
        listeners.valueChanged === undefined
          ? undefined
          : listeners.valueChanged,
      formValueChanged:
        listeners.formValueChanged === undefined
          ? undefined
          : listeners.formValueChanged,
    };
  }

  validationErrors(): FormValidationError[]{
    const errors: FormValidationError[] = []
    const controlErrors: ValidationErrors = this.control.errors;
    if (controlErrors !== null) {
      Object.keys(controlErrors).forEach(keyError => {
        errors.push({
          key: this.key,
          error: keyError,
          value: controlErrors[ keyError ],
          formoType: 'array'
        });
      });
    }
    this.children.forEach((child) => {
      errors.concat(child.validationErrors())
    });
    return errors;
  }
  getChildByKey(key: number) {
    return this.children[key];
  }
}
