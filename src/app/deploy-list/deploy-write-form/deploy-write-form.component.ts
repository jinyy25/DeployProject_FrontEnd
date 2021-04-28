import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'vex-deploy-write-form',
  templateUrl: './deploy-write-form.component.html',
  styleUrls: ['./deploy-write-form.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class DeployWriteFormComponent implements OnInit {

  form: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }

}
