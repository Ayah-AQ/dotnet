import { NgIf } from '@angular/common';
import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-pickers',
  standalone: true,
  imports: [NgIf,BsDatepickerModule,ReactiveFormsModule],
  templateUrl: './date-pickers.component.html',
  styleUrl: './date-pickers.component.scss'
})
export class DatePickersComponent implements ControlValueAccessor{
 label= input<string>('')
 maxDate= input<Date>()
 bsConfig?: Partial<BsDatepickerConfig>

 constructor(@Self() public ngControl: NgControl){
  this.ngControl.valueAccessor = this
  this.bsConfig = {
    containerClass:'theme-red',
    dateInputFormat:'YYYY MMM DD',
  }
}

  writeValue(obj: any): void {
    
  }
  registerOnChange(fn: any): void {
    
  }
  registerOnTouched(fn: any): void {
    
  }
 
get control(): FormControl{
  var formCont= this.ngControl.control as FormControl
  // console.log(formCont)
  
  return formCont
}


}
