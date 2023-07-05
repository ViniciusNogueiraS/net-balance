import { Type } from "./enums"

export interface IUser {
    id: string,
    email: string,
    password: string,
    nickname: string
  }
  
export interface IPeriod {
    init: Date | null,
    end: Date | null
}

export interface IEntry {
    id: string,
    date: Date | null,
    description: string,
    type: Type,
    value: string
}

export interface IStorage {
    registers: IEntry[],
    plans: IEntry[]
}