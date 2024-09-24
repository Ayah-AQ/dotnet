import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationResult } from '../_models/pagination';
import { Message } from '../_models/messages';
import { setPaginationHeaders, setPaginationRes } from './paginationhelper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl= environment.apiUrl
  private http= inject(HttpClient)
  paginatedResult = signal<PaginationResult<Message[]>| null> (null)

getMessages(pageNumber:number, pageSize:number,container:string){
  let params= setPaginationHeaders(pageNumber,pageSize)
  .append("Container",container);

  return this.http.get<Message[]>(`${this.baseUrl}messages`, {observe:'response', params})
  .subscribe({
    next: res =>
      setPaginationRes(res,this.paginatedResult)
  })
}

messageThread(username: string){

  return this.http.get<Message[]>(`${this.baseUrl}messages/thread/${username}`)
}


sendMessages(username: string, content: string){

  return this.http.post<Message>(`${this.baseUrl}messages`, {receiverName: username, content})
}

deleteMessages(id: number){

  return this.http.delete<Message>(`${this.baseUrl}messages/${id}`)
}

}
