import { CdkDragEnter } from '@angular/cdk/drag-drop';
import { Portal } from '@angular/cdk/portal';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { BoardFile } from 'src/app/models/boardfile.model';
import { DefaultPathList } from 'src/app/models/default-path-list.model';
import { DeployFile } from 'src/app/models/deploy-file.model';
import { DefaultPathService } from 'src/app/services/default-path.service';
import { DeployService } from 'src/app/services/deploy.service';
import { UploadService } from 'src/app/services/upload.service';
import { Deploy } from '../../models/deploy.model';
import { Script } from '../../models/script.model';
import { User } from '../../models/user.model';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'vex-default-path-form',
  templateUrl: './default-path-form.component.html',
  styleUrls: ['./default-path-form.component.scss']
})
export class DefaultPathFormComponent implements OnInit {

  //로그인 관련
  loginUser :User;
  check:string;
  
  layoutCtrl = new FormControl('boxed');
  defaultPathForm : FormGroup;

  defaultPathList : DefaultPathList = new DefaultPathList();

  constructor(
    private formBuilder : FormBuilder,
    private jwtService : JwtService,
    private router : Router,
    private service : DefaultPathService
    ) {
    this.buildForm();
   }

  buildForm(): void{
    this.defaultPathForm = this.formBuilder.group({
      developportal:['',[Validators.required,Validators.pattern(/^\//)]],
      developtbwapp:['',[Validators.required,Validators.pattern(/^\//)]],
      developcenter:['',[Validators.required,Validators.pattern(/^\//)]],
      developtmp:['',[Validators.required,Validators.pattern(/^\//)]],
      prdtmp:['',[Validators.required,Validators.pattern(/^\//)]],
      portaljava:['',[Validators.required,Validators.pattern(/^\//)]],
      portaljsp:['',[Validators.required,Validators.pattern(/^\//)]],
      portaljs:['',[Validators.required,Validators.pattern(/^\//)]],
      portalxml:['',[Validators.required,Validators.pattern(/^\//)]],
      tbwappjava:['',[Validators.required,Validators.pattern(/^\//)]],
      tbwappxml:['',[Validators.required,Validators.pattern(/^\//)]],
      centerjava:['',[Validators.required,Validators.pattern(/^\//)]],
      centerxml:['',[Validators.required,Validators.pattern(/^\//)]],
    });
  }

  ngOnInit() {
    this.check = localStorage.getItem("AUTH_TOKEN");
    if(this.check !=null){
      this.loginUser = this.jwtService.decodeToUser(this.check);
    }else{
      this.check= sessionStorage.getItem("AUTH_TOKEN");
      if(this.check !=null){
        this.loginUser = this.jwtService.decodeToUser(this.check);
      }
    }
  }

  reset(){
    this.defaultPathForm.reset();
  }

  getDefaultPath(){
    this.service.selectDefaultpath()
    .subscribe(data => {

      for(let i = 0 ; i < data.data.length ; i++){
        this.defaultPathForm.get(data.data[i].id).setValue(data.data[i].path);
      }

    });

    
   
    
    
  }

  cancel(){

    this.router.navigate(['/deploy-list']);
  }

  send(defaultPathForm:FormGroup){
      
      this.defaultPathList = this.defaultPathForm.value;
   
      this.service.insertDefaultPath(this.defaultPathList)
      .subscribe(data => { 
        if(data.success){
          alert("기본경로 등록 완료");
          location.href='/#/deploy-list/default-path-list';
        }else{
          alert("기본경로 등록 실패");
        }
          
        }
      );

  }

}
