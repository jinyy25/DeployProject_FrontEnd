import { Component, OnInit } from '@angular/core';

import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadFilesService } from './upload-files.service';
//upload-files.component 파일 업로드, 프로그레스바, 파일 리스트 디스플레이
@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {

  selectedFiles?: FileList;
 
  progressInfos: any[] = [];//각각 파일의 업로드 프로그레스 보여주기 위함. 각각의 아이템 value와 file 필드 갖고있음
 
  message: string[] = [];

  fileInfos?: Observable<any>;

  constructor(private uploadService: UploadFilesService) {}

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }

  selectFiles(event): void {//업로드 하기위해 선택한 파일 얻어옴
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }
  uploadFiles(): void {
    this.message = [];
  
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
  upload(idx: number, file: File): void {

    this.progressInfos[idx] = { value: 0, fileName: file.name };
  
    if (file) {
      this.uploadService.upload(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {//업로드 프로그레스 정보 받음
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            //transmission이 끝나면, 이벤트는 HttpResponse 객체가 될 것 
            //uploadService.getFiles() 호출해서 파일 정보 얻고 결과를 fileInfos 변수에 assign
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
          this.fileInfos = this.uploadService.getFiles();
        });
    }
  }
  

}