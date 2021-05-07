import { CodeMgmtService } from './../../code-mgmt.service';
import { CodeMgmt } from './../../codemgmt.model';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'vex-insert-update-code',
  templateUrl: './insert-update-code.component.html',
  styleUrls: ['./insert-update-code.component.scss']
})
export class InsertUpdateCodeComponent implements OnInit {
  form : FormGroup;

  codeMgmt : CodeMgmt = new CodeMgmt();
  isInsertMode: boolean;
  isParentCode: boolean;
  codeId:string;

  constructor(
      private dialogRef : MatDialogRef<InsertUpdateCodeComponent>,
      private formBuilder : FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data : CodeMgmt,
      private codeMgmtService : CodeMgmtService) {
                this.codeId = data.codeId;
              }

  ngOnInit(): void {
    //dialog 열었을 때 codeId 정보 있었냐 없었냐에 따라서 등록인지 수정인지 구분
    if(this.codeId!=null) {
      this.isInsertMode =false;
    } else {
      this.isInsertMode =true;
    }

    this.form = this.formBuilder.group({
      isParentCode: [''],
      codeId: ['', [Validators.required]],
      codeName: ['', [Validators.required]],
      parentCodeId: [''],
      dsplOrder: ['', [Validators.required]],
      isInUse:  ['', [Validators.required]]
    });//url 주소에 따라 폼이 다르게 작성되어야 하므로 ngOnInit() method 안에 있어야 함

    if (!this.isInsertMode) {//update용 dialog인 경우에는
      this.codeMgmtService.selectOneCodeByCodeId(this.codeId)//codeId를 통해 codeMgmt 정보 불러옴
          .subscribe(x => 
          { this.form.patchValue(x);
            //codeUseYN 값이 Y이면 isInUse true로 setting
            if(x.codeUseYN=='Y') {
            this.form.get('isInUse').setValue(true);
          } else {
            this.form.get('isInUse').setValue(false);
          }//if~else end 

            //부모코드이면 isParentCode true로
            if(x.parentCodeId==null) {
            this.form.get('isParentCode').setValue(true);
            //다이얼로그에서 parentCodeId disable 되어있어야 함
            this.form.get('parentCodeId').disable();
          } else {
            this.form.get('isParentCode').setValue(false);
          }//if~else end
            this.form.get('codeId').disable();//코드 아이디 수정 못하게 막기
          }
          
          );//이 정보를 업데이트 dialog에 붙여줌!
    }
  }
  
  onSubmit(){ 
            if(this.form.value.isInUse==true){//코드 사용중이면, codeUseYN 값 Y로 setting 해주기
              this.codeMgmt.codeUseYN ='Y';
            } else {
              this.codeMgmt.codeUseYN ='N';
            }//if~else end 

            if(this.form.value.isParentCode==true){//부모 코드이면 parentCodeID null값 주기
              this.codeMgmt.parentCodeId = null;
            } else {
              this.codeMgmt.parentCodeId = this.form.value.parentCodeId;
            }
              this.codeMgmt.codeId = this.form.value.codeId;
              this.codeMgmt.codeName = this.form.value.codeName;
              this.codeMgmt.dsplOrder = this.form.value.dsplOrder;
              
              this.dialogRef.close(this.codeMgmt);
  }

  disable(){
    const isParentCode = this.form.value.isParentCode;
    if(!isParentCode){//부모코드이면 parentCodeId input요소 disable시키고 값 ''넣어줌
      this.form.get('parentCodeId').setValue('');
      this.form.get('parentCodeId').disable();
    } else { //부모코드가 아니면
      this.form.get('parentCodeId').enable();
    }
  }
  
    

}
