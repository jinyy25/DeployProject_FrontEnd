import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/common/pagination/user.model';

@Component({
  selector: 'vex-search-schedule',
  templateUrl: './search-schedule.component.html',
  styleUrls: ['../schedule.component.scss']
})
export class SearchScheduleComponent implements OnInit {
  
  name = new FormControl('');
  userList : Array<User> = [];
  form : FormGroup;

  constructor(
    private dialogRef : MatDialogRef<SearchScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      users: this.fb.array([])
    });
  }

  ngOnInit(): void {//본인 빼고 리스트 보여줌
    this.userList = this.data.userList;
  }

  search(){//이름 검색
    this.userList = [];
    const keyword = this.name.value;
    this.name.markAsTouched();
    this.name.setErrors({nameError:null});
    this.name.updateValueAndValidity({emitEvent : false});
    
    for (let index = 0; index < this.data.userList.length; index++) {
      const element = this.data.userList[index];

      if(element.name.includes(keyword)){//검색어를 포함하는 이름이 있으면
        this.userList.push(element);
      }
    }

    if(this.userList.length == 0){
      this.name.setErrors({nameError:true});
    }
  }

  showAll(){//전체 유저 보여주기
    this.userList = this.data.userList;
  }

  showUser(team){//팀별 유저 보여주기
    this.userList = this.data.userList.filter((user) => user.team == team.codeName);
  }

  showMine(){//본인꺼 보여주기
    this.dialogRef.close([this.data.loginUser.id]);
  }

  submit(){//일정 보기
    const list = this.form.value.users;
    const id = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      id.push(element.id);
    }

    if(id.length == 0){
      alert("선택된 팀원이 없습니다");
    }else{
      this.dialogRef.close(id);//id만 전달
    }
  }

  onChange(event){//체크박스 선택할때마다 달라지는거
    const users = <FormArray>this.form.get('users') as FormArray;

    //event.source.value는 방금 선택한 user
    if(event.checked) {//체크되어있으면 users에 추가
      users.push(new FormControl(event.source.value));
    } else {//체크 해제 시 users에서 삭제
      const i = users.controls.findIndex(x => x.value === event.source.value);
      users.removeAt(i);
    }
  }
}
