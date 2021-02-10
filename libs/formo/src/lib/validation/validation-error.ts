export interface FormValidationError{
    formoType: 'group' | 'field' | 'array';
    key: string;
    value: any;
    error: string

}