import { Directive, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { View } from 'tns-core-modules/ui/core/view';

import { BaseValueAccessor } from 'nativescript-angular/forms/value-accessors/base-value-accessor';

const TEXT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextValueAccessor),
    multi: true
};

export type TextView = { text: string } & View;

/**
 * The accessor for writing a text and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <TextField [(ngModel)]="model.test">
 *  ```
 */
@Directive({
    selector: 'MaterialTextField[ngModel],MaterialTextField[formControlName],MaterialTextField[formControl]',
    providers: [TEXT_VALUE_ACCESSOR],
    host: {
        '(blur)': 'onTouched()',
        '(textChange)': 'onChange($event.value)'
    }
})
export class TextValueAccessor extends BaseValueAccessor<TextView> {
    // tslint:disable-line:directive-class-suffix
    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        const normalized = super.normalizeValue(value);
        this.view.text = normalized;
    }
}
