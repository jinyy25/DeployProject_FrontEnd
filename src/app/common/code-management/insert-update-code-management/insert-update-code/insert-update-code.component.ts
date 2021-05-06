import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
@Component({
  selector: 'vex-insert-update-code',
  templateUrl: './insert-update-code.component.html',
  styleUrls: ['./insert-update-code.component.scss']
})
export class InsertUpdateCodeComponent implements OnInit {
  form : FormGroup;

  constructor(private dialogRef : MatDialogRef<InsertUpdateCodeComponent>,
              private formBuilder: FormBuilder,
              ) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      isParentCode: [''],//이 프로젝트의 경우는 id가 번호이고 순서대로 자동으로 부여되기 때문에
      //Validator를 required를 해놓으면, this.form.invalid가 계속 false가 뜰 것임
      //그래서 업데이트는 작동하는데 인서트는 작동하지 않았던 것
      codeId: ['', [Validators.required]],
      codeName: ['', [Validators.required]],
      parentCodeId: ['', [Validators.required]],
      dsplOrder: ['', [Validators.required]],
      isInUse:  ['', [Validators.required]]
    
    
    });//url 주소에 따라 폼이 다르게 작성되어야 하므로 ngOnInit() method 안에 있어야 함
  }
  // form 요소에 편하게 접근하기 위한 getter
  get f() { return this.form.controls; }

  onSubmit(isParentCode,
          codeId,
          codeName,
          parentCodeId,
          dsplOrder,
          isInUse){}
    

}
