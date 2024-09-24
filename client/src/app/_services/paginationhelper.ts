import {  HttpParams, HttpResponse } from '@angular/common/http';
import { Member } from '../_models/member';
import { signal } from '@angular/core';
import { PaginationResult } from '../_models/pagination';


export function setPaginationRes<T>(res: HttpResponse<T>,paginationResultsSignal: ReturnType<typeof signal<PaginationResult<T>|null>>){
  paginationResultsSignal.set({
    items: res.body as T,
    pagination: JSON.parse(res.headers.get('Pagination')!)

  })
}
  
export function setPaginationHeaders(pageNumber: number, pageSize: number){
  
  let params = new HttpParams();

 if (pageNumber && pageSize) {
  params= params.append('pageNumber', pageNumber);
  params= params.append('pageSize', pageSize);
 } 
 return params
}
