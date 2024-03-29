// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {models} from '../models';

export function CheckRunningProcess(arg1:string,arg2:number,arg3:string,arg4:string):void;

export function Create(arg1:string,arg2:string,arg3:string,arg4:string,arg5:number):void;

export function DeleteApp(arg1:number):void;

export function FindAll():Promise<Array<models.Games>>;

export function FindMostPlayedGame():Promise<models.MosPlayedGame>;

export function FindOne(arg1:number):Promise<models.Games>;

export function FindTotalGamesPlayedLastWeek(arg1:string,arg2:string):Promise<Array<models.Games>>;

export function FindTotalTimePlayed():Promise<number>;

export function FindTotalTimePlayedByGameThisWeek(arg1:string,arg2:string,arg3:Array<number>):Promise<Array<number>>;

export function FindTotalTimePlayedByGameToday(arg1:string,arg2:string,arg3:Array<number>):Promise<Array<number>>;

export function FindTotalTimePlayedLastMonth(arg1:string,arg2:string):Promise<number>;

export function FindTotalTimePlayedLastWeek(arg1:string,arg2:string):Promise<number>;

export function FindTotalTimePlayedLastYear(arg1:string,arg2:string):Promise<number>;

export function FindTotalTimePlayedToday(arg1:string,arg2:string):Promise<number>;

export function GameExePath():Promise<string>;

export function HowlongtobeatRequest(arg1:string):Promise<any>;

export function Pcspecs():Promise<any>;

export function Play(arg1:string,arg2:string):void;

export function TimePlayedByDayThisWeek(arg1:models.WeekDay,arg2:models.WeekDay,arg3:models.WeekDay,arg4:models.WeekDay,arg5:models.WeekDay,arg6:models.WeekDay,arg7:models.WeekDay,arg8:number):Promise<models.Datas>;

export function Update(arg1:number,arg2:string,arg3:string,arg4:string):void;
