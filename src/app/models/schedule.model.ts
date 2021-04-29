export class Schedule{//vo 객체
    scheduleNo : number;
    scheduleTitle : string;
    scheduleContent : string;
    writer : string;//작성자 아이디
    name : string;//이름
    startDate : string;//분까지
    endDate : string;
    startTime : string;
    endTime : string;
    allDay : boolean;
    complete : string;
    uploadDate : string;//일까지만
    updateDate : string;
    completeDate : string;
    disable : boolean;//본인인지 아닌지. 본인이 아니면 true
    teamName : string;
}