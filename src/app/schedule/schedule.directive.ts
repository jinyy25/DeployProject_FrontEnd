import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

export const dateCheck: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const startDate = control.get('startDate').value;
  const startTime = control.get('startTime').value;
  const endDate = control.get('endDate').value;
  const endTime = control.get('endTime').value;

  return endDate+" "+endTime <= startDate+" "+startTime ? { dateError : true } : null;
};

@Directive({
  selector: '[vexSchedule]',
  providers : [{
    provide : NG_VALIDATORS,
    useExisting : ScheduleDirective,
    multi : true
  }]
})
export class ScheduleDirective implements Validator{

  constructor() { }
  
  validate(control: AbstractControl): {[key:string] : any} | null {
    return dateCheck(control);
  }
  
  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }

}
