import { Component, EventEmitter, inject, input, Input, OnInit, output, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { TextInputsComponent } from "../_forms/text-inputs/text-inputs.component";
import { DatePickersComponent } from "../_forms/date-pickers/date-pickers.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf,DatePickersComponent,FormsModule, ReactiveFormsModule, JsonPipe, TextInputsComponent, DatePickersComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{



  private accountService= inject(AccountService)  
  private toastr= inject(ToastrService)  
  private fb= inject(FormBuilder)   

  // @Input() usersFromHomeComponent: any;
  // usersFromHomeComponent = input.required<any>();
  
  //  @Output() cancelRegister = new EventEmitter();

  cancelRegister= output<boolean>()
  model: any ={};
  registerForm: FormGroup = new FormGroup({})
maxDate = new Date()
validationErrors: string[] | undefined

ngOnInit(): void {
  this.initializeForm()
  this.maxDate.setFullYear(this.maxDate.getFullYear()-18)
}


initializeForm(){
  this.registerForm= this.fb.group({
    gender:['male'],
    username: ["", Validators.required],
    knownAs:['' ,Validators.required],
    dateOfBirth:['' ,Validators.required],
    city:['' ,Validators.required],
    country:['' ,Validators.required],
    password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
    confirmPassword: ['',[Validators.required, this.matchValues("password")]],

  })
  this.registerForm.controls['password'].valueChanges.subscribe({
    next:()=> this.registerForm.controls['confirmPassword'].updateValueAndValidity()
  })
}


matchValues(matchTo: string): ValidatorFn{
 return(control:AbstractControl)=>{
  return control.value === control.parent?.get(matchTo)?.value? null : {isMatching:true}
}
}

  register() {
    const dob =this.getDateOnly(this.registerForm.get('dateOfBirth')?.value)
    this.registerForm.patchValue({dateOfBirth:dob})
    this.accountService.register(this.registerForm.value).subscribe({
      next:response => {
        console.log(response);
        this.cancel()
      },
      error: error => this.validationErrors=error

      
    })
  }

  cancel() {
    this.cancelRegister.emit(false)
  }


private getDateOnly(dob: string | undefined){
  if(!dob) return;
  return new Date(dob).toISOString().slice(0,10);
}




}
