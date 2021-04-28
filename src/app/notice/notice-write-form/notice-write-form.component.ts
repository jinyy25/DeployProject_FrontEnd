import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'vex-notice-write-form',
  templateUrl: './notice-write-form.component.html',
  styleUrls: ['./notice-write-form.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class NoticeWriteFormComponent implements OnInit {

  selectedFiles?: FileList;

  files = [];
  fileNames  = [];

  form: FormGroup;

  display ="none";

  constructor(
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.form=this.fb.group({
      title:['',Validators.required]
    })
  }

  selectFiles(event): void {
    this.files=event.target.files;
    this.display="block";
  }
  close(obj,text:string): void{
    text=text.substr(1);
   for(let i =0 ; i<this.files.length;i++){


     if(this.files[i].name!=text){

      this.fileNames.push(this.files[i]);

     }//if end
     
    }//for end
    this.files=this.fileNames;
    this.fileNames=[];
    
  }//close() end

  upload():void{
    console.log(this.files);
  }
}
