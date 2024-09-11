import { CommonModule } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, OnInit, viewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounce, debounceTime, of } from 'rxjs';
// import { debounceTime } from 'rxjs';//used to stored the data in localstorage after some milisecond 

function mustContainQuestionMark(control: AbstractControl){
  if(control.value.includes('?')){
    return null;
  } 
  return {doesNotContainQuestionMark: true}
}

function emailIsUnquie(control : AbstractControl){
if(control.value !== 'test@gmail.com'){
  return of(null)// convert argument into observable;

}
return of({doesNotHaveUnquieEmail : true})
}

let initialEmailValue =''
  const savedForm = window.localStorage.getItem('saved-login-form')

  if(savedForm){
   const loadedFormData = JSON.parse(savedForm);
    initialEmailValue= loadedFormData.email
  }


@Component({
  selector: 'app-login',
  standalone: true,
  imports:[FormsModule, ReactiveFormsModule],//For forms approach=FormsModule and for reactiveForms approach= ReactiveFormsModule
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
  private destoryRef = inject(DestroyRef)
form= new FormGroup(
  {
    email: new FormControl(initialEmailValue, {
      validators:[
        Validators.email,
         Validators.required
        ],
      asyncValidators:[
        emailIsUnquie
      ]

    }), //2nd argument should be array of validators 
    password: new FormControl('',{
      validators :[
        Validators.required, 
        Validators.minLength(6), 
        mustContainQuestionMark 
      ],
    })
  }
);

ngOnInit(): void {
  // const savedForm = window.localStorage.getItem('saved-login-form')

  // if(savedForm){
  //   const loadedFormData = JSON.parse(savedForm);
  //   this.form.patchValue({
  //     email: loadedFormData.email,//this control recived new value other stay ubntouched 
  //   })//used to partially update the value.
  // }
  const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
    next:(value)=>{
      window.localStorage.setItem('saved-login-form', JSON.stringify({email:value.email}))
    }
  })
  this.destoryRef.onDestroy(()=>{
    subscription.unsubscribe()
  })

}

get emailIsInvalid(){
  return (
    this.form.controls.email.touched && 
    this.form.controls.email.dirty &&
     this.form.controls.email.invalid
    )
}

get passwordIsInvalid(){
  return (
    this.form.controls.password.touched && 
    this.form.controls.password.dirty && 
    this.form.controls.password.invalid
  )
}

onSubmit(){
  console.log(this.form)
  const enterdEmail = this.form.value.email;
  const enteredPassword = this.form.value.password ; 
console.log(enterdEmail);
console.log(enteredPassword);

}










// private form = viewChild.required<NgForm>('form')
// private destroyRef = inject(DestroyRef)

// constructor(){
//   afterNextRender(()=>{
//    const savedForm = window.localStorage.getItem('saved-login-form');

//    if(savedForm){
//     const loadedFormData = JSON.parse(savedForm)
//     const savedEmail = loadedFormData.email;
//     const savedPassword = loadedFormData.password;
//     setTimeout(() => {
//       this.form().controls['email'].setValue(
//       savedEmail,
//       )
      
//     }, 1);
//    }
//     const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
//       next:(value)=> window.localStorage.setItem('saved-login-form', JSON.stringify({email: value.email}))
//     })
//     this.destroyRef.onDestroy(()=> subscription?.unsubscribe())
//   })

// }

//   onSubmit(formData : NgForm){
//     if(formData.form.invalid){
//       return ;
//     }
//    const enteredEmail =  formData.form.value.email; //email same what we add as name="" in template
//    const enteredPassword = formData.form.value.password
//    console.log(formData.form)
//    console.log(enteredEmail);     
//    console.log(enteredPassword)

//    //reset form 
//   //  formData.resetForm();
//   formData.form.reset();
//   }


} 
