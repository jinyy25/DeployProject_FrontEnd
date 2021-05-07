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
      private codeMgmtService : CodeMgmtService
              ) {
                this.codeId = data.codeId;
               }

  ngOnInit(): void {
    if(this.codeId!=null) {//dialog 열었을 때 codeId 정보 있었냐 없었냐에 따라서 등록인지 수정인지 구분
      this.isInsertMode =false;
    } else {
      this.isInsertMode =true;
    }

    this.form = this.formBuilder.group({
      isParentCode: [''],//이 프로젝트의 경우는 id가 번호이고 순서대로 자동으로 부여되기 때문에
      //Validator를 required를 해놓으면, this.form.invalid가 계속 false가 뜰 것임
      //그래서 업데이트는 작동하는데 인서트는 작동하지 않았던 것
      codeId: ['', [Validators.required]],
      codeName: ['', [Validators.required]],
      parentCodeId: [''],
      dsplOrder: ['', [Validators.required]],
      isInUse:  ['', [Validators.required]]
    
    
    });//url 주소에 따라 폼이 다르게 작성되어야 하므로 ngOnInit() method 안에 있어야 함

    if (!this.isInsertMode) {//update용 dialog인 경우에는
      this.codeMgmtService.selectOneCodeByCodeId(this.codeId)//codeId를 통해 codeMgmt 정보 불러옴
          .subscribe(x => 
          { this.form.patchValue(x)
            //codeUseYN 값이 Y이면 isInUse true로 setting
            if(x.codeUseYN=='Y') {
            this.form.get('isInUse').setValue(true);
          } else {
            this.form.get('isInUse').setValue(false);
          }//if~else end 

            //부모코드이면 isParentCode true로
            if(x.parentCodeId==null) {
            this.form.get('isParentCode').setValue(true);
          } else {
            this.form.get('isParentCode').setValue(false);
          }//if~else end

          

          }
          
          
          );//이 정보를 업데이트 폼에 붙여줌!
    }
  }
  
  onSubmit(){ 
            if(this.form.value.isInUse==true){
              this.codeMgmt.codeUseYN ='Y';
              console.log(this.codeMgmt.codeUseYN);
            }else{
              this.codeMgmt.codeUseYN ='N';
            }
            if(this.form.value.isParentCode==true){
              this.codeMgmt.parentCodeId = null;
              console.log(this.codeMgmt.codeUseYN);
            }else{
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
