import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-paged-grid',
  templateUrl: './paged-grid.component.html',
  styleUrls: ['./paged-grid.component.css']
})
export class PagedGridComponent implements OnInit {

  @Input() public pageIndex: number = 0;
  @Input() public pageSize: number = 10;
  @Input() public list: any[] = null;
  @Input() public emptyMessage: string = 'Aucun élément à afficher !';

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

  public truncatedList(): any[] {
    return this.list ? this.list.slice(this.firstElement(), this.lastElement()): [];
  }
}
