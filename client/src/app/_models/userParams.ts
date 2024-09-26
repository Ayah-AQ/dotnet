// import { User } from "./user";

// export interface UserParams{
//     gender:string;
//     minAge: 18;
//     maxAge:100;
// pageNum:1;
// pageSize:5;

// constructor(user: User | null){
//     this.gender = user?.gender === 'female' ? 'male' : 'female'

// }

// }

import { User } from './user';

// Define the UserParams interface
export interface UserParams {
  gender: string;
  minAge: number; // `number` instead of `18`
  maxAge: number; // `number` instead of `100`
  pageNum: number; // `number` instead of `1`
  pageSize: number; // `number` instead of `5`
  orderBy: string;
}

// Define a class that implements UserParams
export class UserParamsClass implements UserParams {
  gender: string;
  minAge: number;
  maxAge: number;
  pageNum: number;
  pageSize: number;
  orderBy: string;

  constructor(user: User | null) {
    this.gender = user?.gender === 'female' ? 'male' : 'female';
    this.minAge = 18;
    this.maxAge = 100;
    this.pageNum = 1;
    this.pageSize = 5;
    this.orderBy = 'lastActive';
  }
}
