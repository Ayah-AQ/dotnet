import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, model, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { mapTo, of, tap } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginationResult } from '../_models/pagination';
import { UserParams, UserParamsClass } from '../_models/userParams';
import { AccountService } from './account.service';
import { setPaginationRes,setPaginationHeaders } from './paginationhelper';


@Injectable({
  providedIn: 'root'
})
export class MembersService {

private http = inject (HttpClient);
private accountService = inject (AccountService);

members= signal<Member[]>([])
baseUrl= environment.apiUrl;
paginationResults = signal<PaginationResult<Member[]> | null>(null)
memberCache = new Map();
user=this.accountService.currentUser()
userParams= signal<UserParams>(new UserParamsClass(this.user))



resetuserParams(){
  this.userParams.set(new UserParamsClass(this.user))
}

// getMembers(pageNumber?: number, pageSize?: number){
  getMembers( ){

    const cacheKey = Object.values(this.userParams()).join('_');
    const cachedResponse = this.memberCache.get(cacheKey);

   if (cachedResponse) {
    return setPaginationRes(cachedResponse,this.paginationResults) 
   }

    
    let params = setPaginationHeaders(this.userParams().pageNum, this.userParams().pageSize)
    .append('minAge',this.userParams().minAge)
    .append('maxAge',this.userParams().maxAge)
    .append('gender',this.userParams().gender)
    .append('orderBy',this.userParams().orderBy)


  return this.http.get<Member[]>(this.baseUrl + 'user', {observe:'response', params}).subscribe({

    next: res => {
      setPaginationRes(res,this.paginationResults);
      this.memberCache.set(cacheKey, res);
    }
  })
}


getMember(username: string){
  // const member = this.members().find(x => x.username === username);
  // if (  member != undefined) return of(member);

const member:Member = [...this.memberCache.values()]
.reduce((arr, elem) => arr.concat(elem.body), [])
.find((m: Member) => m.username === username);

if (member) {
  return of(member);
}
  return this.http.get<Member>(`${this.baseUrl}user/${username}`);

}

updateMember(member: Member){
  return this.http.put(`${this.baseUrl}user` , member).pipe(
    // tap(()=> {
    //   this.members.update(members => members.map(m =>m.username === member.username ? member : m))
    //   })
    
  )
}

setMainPhoto(photo: Photo){
  return this.http.put(`${this.baseUrl}user/set-main-photo/${photo.id}` , {}).pipe(
    // tap(()=>{
    //   this.members.update(members => members.map(m=> {
    //     if(m.photos.includes(photo)){
    //       m.photoUrl = photo.url
    //     }
    //     return m
    //   }))
    // })  
  ) 
}
deletePhoto(photo:Photo){
  return this.http.delete(`${this.baseUrl}user/delete-photo/${photo.id}`).pipe(
    // tap(() => 
    // this.members.update(members =>
    //   members.map( m => {
    //     if (m.photos.includes(photo)) {
    //       m.photos= m.photos.filter(x=> x.id !== photo.id)
    //     }
    //     return m
    //   })
    // ))
  )
}

}
