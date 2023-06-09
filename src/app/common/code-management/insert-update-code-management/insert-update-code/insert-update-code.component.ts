import { CodeMgmtService } from './../../code-mgmt.service';
import { CodeMgmt } from './../../codemgmt.model';
import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'vex-insert-update-code',
  templateUrl: './insert-update-code.component.html',
  styleUrls: ['./insert-update-code.component.scss']
})

export class InsertUpdateCodeComponent implements OnInit {
  form : FormGroup;
  // form 요소에 편하게 접근하기 위한 getter
  get f() { return this.form.controls; }

  codeMgmt : CodeMgmt = new CodeMgmt();
  isInsertMode: boolean;
  isParentCode: boolean;
  codeId: string;
  dsplOrder: number;//업데이트 다이얼로그에서 같은 번호는 에러창 뜨지 않게 하기 위함

  //subscribe에서 넘어온 data 받기 용
  dataRegister: any={}


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
      this.isInsertMode = false;
      
    } else {
      this.isInsertMode =true;
      this.isParentCode = true;//등록일 때 최상위 코드 체크박스 체크되어있게 할 것
    }

    this.form = this.formBuilder.group({
      isParentCode: ['isParentCode'],//최상위 코드 체크 default 설정을 위해 작성
      codeId: ['', [Validators.required, Validators.pattern(/^\S*$/)]],//공백 허용하지 않음
      codeName: ['', [Validators.required,Validators.pattern(/^(?=.*\S).+$/)]],//문자간 공백은 허용함
      parentCodeId: ['',[Validators.required, Validators.pattern(/^\S*$/)]],
      dsplOrder: ['', [Validators.required,Validators.pattern("^[0-9]*$")]],
      isInUse:  ['']
    });//url 주소에 따라 폼이 다르게 작성되어야 하므로 ngOnInit() method 안에 있어야 함
    if(this.isInsertMode) {
      this.form.get('parentCodeId').disable();
    }
    if (!this.isInsertMode) {//update용 dialog인 경우에는
      this.codeMgmtService.selectOneCodeByCodeId(this.codeId)//codeId를 통해 codeMgmt 정보 불러옴
          .subscribe(data => 
          { this.dataRegister = data;
            this.dsplOrder = this.dataRegister.data.dsplOrder;
            this.form.patchValue(this.dataRegister.data);
            //codeUseYN 값이 Y이면 isInUse true로 setting
            if(this.dataRegister.data.codeUseYN=='Y') {
            this.form.get('isInUse').setValue(true);
          } else {
            this.form.get('isInUse').setValue(false);
          }//if~else end 

            //부모코드이면 isParentCode true로
            //부모 코드 아이디도  diable 되어있어야 함
            if(this.dataRegister.data.parentCodeId==null) {
            this.form.get('isParentCode').setValue(true);
            this.form.get('parentCodeId').disable();
            
          } else {//자식코드 수정이면 최상위 코드는 체크 안되어 있어야 함
            this.form.get('isParentCode').setValue(false);

          }//if~else end
            this.form.get('codeId').disable();//코드 아이디 수정 못하게 막기
          }
          
          );//이 정보를 업데이트 dialog에 붙여줌!
    }
  }

  //코드아이디 중복체크
  checkCodeId(codeId) {

    this.codeMgmtService.checkCodeId(codeId)
        .subscribe(data =>{
          this.dataRegister = data;

         if(this.dataRegister.success==true) {
        this.form.controls.codeId.setErrors({checkError:true});

         }//if end
    });//subscribe end 
  }//checkCodeId end
  
  checkParentCodeId(parentCodeId) {//최상위 코드 존재하지 않는 것 입력하면 에러메시지 뜨도록 함
    
    this.codeMgmtService.checkParentCodeId(parentCodeId)
        .subscribe(data =>{
          this.dataRegister = data;
         if(this.dataRegister.success==false) {
          this.form.controls.parentCodeId.setErrors({noParentCodeError:true});

         }//if end
    });//subscribe end 

  }//checkParentCodeId

  

  onSubmit(){
            this.form.markAllAsTouched();//에러 한번에 다 뜨게
           
        
            if (this.form.controls.codeId.errors != null) {
              return false;
            } else if(this.form.controls.codeName.errors != null) {
              return false;
            } else if(this.form.controls.dsplOrder.errors != null) {
              return false;
            } else if(this.form.controls.parentCodeId.errors != null) {
              return false;
            }

            if(this.form.value.isInUse==true){//코드 사용중이면, codeUseYN 값 Y로 setting 해주기
              this.codeMgmt.codeUseYN ='Y';
            } else {
              this.codeMgmt.codeUseYN ='N';
            }//if~else end 

            if(this.form.value.isParentCode==true){//부모 코드이면 parentCodeID null값 주기
              this.codeMgmt.parentCodeId = null;
            } else {
              if(this.isInsertMode==true){
                this.codeMgmt.parentCodeId = this.form.value.parentCodeId;
              } else {
                this.codeMgmt.parentCodeId = this.data.parentCodeId;
              }
              
            }
              this.codeMgmt.codeId = this.form.value.codeId;
              this.codeMgmt.codeName = this.form.value.codeName;
              this.codeMgmt.dsplOrder = this.form.value.dsplOrder;
              
              this.dialogRef.close(this.codeMgmt);
  }

  disableParentCodeId() {
    const isParentCode = this.form.value.isParentCode;
    if(!isParentCode){//부모코드이면 parentCodeId input요소 disable시키고 값 null넣어줌
      this.form.get('parentCodeId').setValue(null);
      this.form.get('parentCodeId').disable();
    } else { //부모코드가 아니면
      this.form.get('parentCodeId').enable();
    }//if~else end 
  }//disableParentCodeId() end



  //디스플레이 순서 중복 검사
  //업데이트 다이얼로그 열 때 dsplOrder 값을 받아서 전역변수로 넣어주어 값 비교하였음
  checkDsplOrder(dsplOrder,isParentCode,parentCodeId) {

    if(isParentCode == true && this.isInsertMode == true) {//부모코드 insert 시에 순서비교
      this.codeMgmtService.checkParentCodeDsplOrder(dsplOrder)
      .subscribe(data => {
        if(data.success==true){
        this.form.controls.dsplOrder.setErrors({checkError:true});
        }
      })//subscribe end 

    } else if (isParentCode == false && this.isInsertMode == true) {//자식코드 insert 시에 순서비교
      this.codeMgmtService.checkChildCodeDsplOrder(dsplOrder, parentCodeId)
          .subscribe(data => {
        if(data.success==true){
          this.form.controls.dsplOrder.setErrors({checkError:true});
        }
      })//subscribe end 
    } else if (isParentCode == true && this.isInsertMode == false) {//부모코드 update시에 순서비교
        if(this.dsplOrder==dsplOrder){
          this.form.controls.dsplOrder.valid;
        } else {
          this.codeMgmtService.checkParentCodeDsplOrder(dsplOrder)
          .subscribe(data => {
        if(data.success==true){
        this.form.controls.dsplOrder.setErrors({checkError:true});
        }
      })//subscribe end 
      }

    } else if (isParentCode == false && this.isInsertMode == false) {
      if(this.dsplOrder==dsplOrder) {
      this.form.controls.dsplOrder.valid;
      } else {
        this.codeMgmtService.checkChildCodeDsplOrder(dsplOrder,parentCodeId)
      .subscribe(data => {
        if(data.success==true){
          this.form.controls.dsplOrder.setErrors({checkError:true});
        }
      })//subscribe end 

      }//업데이트 자식코드 비교 내 if~else end 
    }//if~ else if ~ else if ~else if end 
  }//checkDsplOrder() end

}
