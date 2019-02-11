import {Component, Input, OnInit} from '@angular/core';
import {DicoService} from '../../language/dico.service';

@Component({
	selector: 'app-paged-grid',
	templateUrl: './paged-grid.component.html',
	styleUrls: ['./paged-grid.component.css']
})
export class PagedGridComponent implements OnInit {

	@Input() public pageIndex: number = 0;
	@Input() public pageSize: number = 10;
	@Input() public emptyMessage: string = this.d.l.emptyMessage;

	@Input()
	public set list(list: any[]) {
		this.pageIndex = 0;
		this._list = list;
	};
	public get list() {
		return this._list;
	};
	private _list: any[] = null;

	constructor(
		public d: DicoService
	) { }

	ngOnInit() { }

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
