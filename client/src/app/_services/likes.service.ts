import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/member';
import { PaginationResult } from '../_models/pagination';
import { setPaginationHeaders, setPaginationRes } from './paginationhelper';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
baseUrl = environment.apiUrl;
paginationResults = signal<PaginationResult<Member[]> | null>(null)

private http= inject(HttpClient)
likeIds= signal<number[]>([]);



  toggleLike(targetId: number) { 
return this.http.post(`${this.baseUrl}likes/${targetId}`,{})
  }


  getLikes(predicate: string, pageNumber:number,pageSize: number){

    let params = setPaginationHeaders(pageNumber, pageSize)
    .append('predicate',predicate)
   


    return this.http.get<Member[]>(`${this.baseUrl}likes?predicate=${predicate}`, {observe:'response', params})
    .subscribe({

      next: res => {
        setPaginationRes(res,this.paginationResults);
        
      }
    })
  }

getLikeIds(){
return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
  next:ids => this.likeIds.set(ids)
})
  
}

}
