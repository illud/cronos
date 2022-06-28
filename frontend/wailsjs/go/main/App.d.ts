// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import { main } from '../models'

export function DeleteApp(arg1: number): void

export function FindAll(): Promise<Array<main.AppData>>

export function FindTotalGamesPlayedLastWeek(
  arg1: string,
  arg2: string,
): Promise<Array<main.AppData>>

export function FindTotalTimePlayedLastMonth(
  arg1: string,
  arg2: string,
): Promise<number>

export function FindTotalTimePlayedLastWeek(
  arg1: string,
  arg2: string,
): Promise<number>

export function Greet(arg1: string): Promise<string>

export function Play(arg1: string, arg2: string): void

export function CheckRunningProcess(arg1: string, arg2: number): void

export function Update(
  arg1: number,
  arg2: string,
  arg3: string,
  arg4: string,
): void

export function FindMostPlayedGame(): Promise<main.MosPlayedGame>

export function FindTotalTimePlayed(): Promise<number>

export function GameExePath(): Promise<string>

export function Create(
  arg1: string,
  arg2: string,
  arg3: string,
  arg4: number,
): void
