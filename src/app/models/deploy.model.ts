import { BoardFile } from "./boardfile.model"
import { DeployFile } from "./deploy-file.model"
import { Script } from "./script.model"

export class Deploy{
    //배포이력
    deployNo:number
    deployTitle:string 
    deployContent:string
    writer:string
    deployDate:Date
    
    filename:string
    // fileName:String

    //스크립트 textarea구분
    scriptDTO:Script[]

    //파일 list 구분
    fileNames:string[]=[];
    names:string[]=[];
    directoryPaths:string[]=[];
}