import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { LikesService } from '../_services/likes.service';
import { Member } from '../_models/member';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginationResult } from '../_models/pagination';
import { setPaginationHeaders, setPaginationRes } from '../_services/paginationhelper';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule,ButtonsModule,MemberCardComponent,PaginationModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy{
paginationResults() {
throw new Error('Method not implemented.');
}
likeService = inject(LikesService)


members:Member[]=[]
predicate= 'liked'
pageNumber = 1 ;
pageSize= 5 ;
currentPage: any;



ngOnInit(): void {
  this.loadLikes()
}

getTitle(){
  switch (this.predicate) {
    case 'liked':
      return "Members you liked"
      
      case 'likedBy':
        return "Members who liked you"
        
    default:
      return 'Matual'
  }
}

loadLikes(){
this.likeService.getLikes(this.predicate,this.pageNumber,this.pageSize)
}


pageChanged(e: any){
  if (this.pageNumber != e.page) {
    this.pageNumber= e.page;
    this.loadLikes()
  }
  }

ngOnDestroy(): void {
  this.likeService.paginationResults.set(null)
}
}

