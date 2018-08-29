import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-paged-list',
  templateUrl: './paged-list.component.html',
  styleUrls: ['./paged-list.component.css']
})
export class PagedListComponent implements  OnInit {

  @Input() public pageIndex: number = 0;
  @Input() public pageSize: number = 15;
  @Input() public list: any[] = null;

  constructor() { }

  ngOnInit() {
  }

  updateList(event) {
    this.pageIndex = event.pageIndex;
  }

  public firstElement(): number {
    return this.pageIndex*this.pageSize;
  }

  public lastElement(): number {
    return (this.pageIndex+1)*this.pageSize;
  }

  public reset() {
    this.pageIndex = 0;
  }

  public truncatedList(): any[] {
    return this.list ? this.list.slice(this.firstElement(), this.lastElement()): [];
  }
}
