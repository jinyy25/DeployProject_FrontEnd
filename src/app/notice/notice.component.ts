import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'vex-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class NoticeComponent implements OnInit {

  form: FormGroup;

  constructor(
     private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.form=this.fb.group({
      type:['',Validators.required],
      word:['',Validators.required]
    })
  }

}
