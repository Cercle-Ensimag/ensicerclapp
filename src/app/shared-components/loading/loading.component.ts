import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input() public loading: any = null;
  @Input() public fullPage: boolean = true;

  constructor() { }

  ngOnInit() { }
}
