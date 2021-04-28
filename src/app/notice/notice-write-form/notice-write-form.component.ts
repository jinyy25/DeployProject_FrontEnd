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

  form: FormGroup;
  constructor(
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.form=this.fb.group({
      title:['',Validators.required]
    })
  }

}
