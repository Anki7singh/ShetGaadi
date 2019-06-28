import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-addresource',
  templateUrl: './addresource.component.html',
  styleUrls: ['./addresource.component.css']
})
export class AddresourceComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  error: {};
  addResourcResponseError: string;
  addResourcResponseSuccess: string;
  public userid;
  public phoneNumber;
  public ownername;
  
  private _addResourceUrl="http://127.0.0.1:5000/addResource";

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private http:HttpClient,
    private  fb: FormBuilder) 
    {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      resourceNumber:['',Validators.required],
      resourceStatus:['',Validators.required],
      avatar: null,
      userID : localStorage.getItem('id'),
      mobilenumber : localStorage.getItem('phoneNumber'),
      resourceOwnBy : localStorage.getItem('name')
    });
    // this.form.patchValue({
    //   userid: this.userid,
    //   phoneNumber:this.phoneNumber,
    //   ownername:this.ownername
     
    // });
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result
        })
      };
    }
  }

  onSubmit() {
    const formModel = this.form.value;
  
    

    console.log(formModel);
    
    console.log("<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>");

    this.http.post(this._addResourceUrl, formModel).subscribe((data:any) => {
      // console.log(data);
    
      console.log(data.fail);
      if (data.success) {
        this.addResourcResponseSuccess = data.message;
        console.log(data.message);
        this.form.reset()
        } 
      else {        
        this.addResourcResponseError = data.fail;
        this.loading = false;
        this.form.reset()
      }
      
     },
     error => this.error = error


   );
    // setTimeout(() => {
    //   // console.log(formModel);
    //   alert('done!');
    //   this.loading = false;
    // }, 1000);
  }

  clearFile() {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }


  ngOnInit() {
    this.userid = localStorage.getItem('id');
    this.phoneNumber = localStorage.getItem('phoneNumber');
    this.ownername = localStorage.getItem('name');

  }

}


// import { Component, OnInit } from '@angular/core';
// import { registerLocaleData } from '@angular/common';
// import{ResourcesService} from '../resources.service' ;
// import { ToastrService } from 'ngx-toastr';
// import { merge } from 'rxjs';

// @Component({
//   selector: 'app-addresource',
//   templateUrl: './addresource.component.html',
//   styleUrls: ['./addresource.component.css']
// })
// export class AddresourceComponent implements OnInit {

//   constructor(private _resourcesService:ResourcesService) { }

//   addResourceData={}
//   image: string | ArrayBuffer;

//   addResource(){
//     this._resourcesService.addResource(this.addResourceData)
//       .subscribe( 
//         res => console.log(res),
//         err => console.log(err)    
//         )
//     console.log(this.addResourceData)
//   }

//   changeListener(event) : void {
//     this.readThis(event.target);
//   }
  
//   readThis(inputValue: any): void {
//     const filelist:FileList = inputValue.files;
//     console.log(filelist)
//     // var myReader:FileReader = new FileReader();

//     // myReader.onloadend = (e) => {
//     //   this.image = myReader.result;
//     //   console.log(myReader.result);
//     // }
//     // myReader.readAsDataURL(filelist); 
//     // console.log(this.image);
//   }


//   ngOnInit() {
//   }

// }
