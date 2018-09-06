import {Component, OnInit} from '@angular/core';
import {ActusService} from '../actus-service/actus.service';

@Component({
  selector: 'app-journalist',
  templateUrl: './journalist.component.html',
  styleUrls: ['./journalist.component.css']
})
export class JournalistComponent implements OnInit {

  constructor(
    public actus: ActusService
  ) {}

  ngOnInit () { }
}
