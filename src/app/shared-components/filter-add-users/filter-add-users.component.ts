import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UsersService} from './users.service';
import {User} from 'firebase/app';
import {Subscription} from '../../../../node_modules/rxjs';
import {ToolsService} from '../../providers/tools.service';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth-service/auth.service';
import {DeviceSizeService} from '../../providers/device-size.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-filter-add-users',
  templateUrl: './filter-add-users.component.html',
  styleUrls: ['./filter-add-users.component.css']
})
export class FilterAddUsersComponent implements OnInit {

  @Input() filter: any = () => true;
  @Input() placeholderString: string = 'Adresse email';
  @Input() addString: string = 'Ajouter';
  @Output() add: EventEmitter<string> = new EventEmitter<string>();
  @Output() remove: EventEmitter<string> = new EventEmitter<string>();

  private users: User[];
  private filteredUsers: User[];
  private usersWatcher: Subscription;
  private emailCtrl: FormControl;
  private emailCtrlWatcher: Subscription;

  constructor(
    private usersService: UsersService,
    private auth: AuthService,
    private tools: ToolsService,
    private media: DeviceSizeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.usersWatcher = this.usersService.getUsers().subscribe((users: User[]) => {
      this.users = users.filter(this.filter);
      this.filterUsers();
    });
    this.emailCtrl = new FormControl('', [this.auth.emailDomainValidator, Validators.email]);
    this.emailCtrl.valueChanges.subscribe((email) => {
      this.filterUsers();
    });
  }

  ngOnDestroy() {
    this.usersWatcher.unsubscribe();
    this.emailCtrlWatcher.unsubscribe();
  }

  filterUsers(): void {
    if (!this.users) return;
    this.filteredUsers = this.users.filter(
      user => user[user.uid].admin.email.includes(this.emailCtrl.value)
    );
  }

  getName(user: any): string {
    return this.tools.titleCase(
      user[user.uid].admin.email
        .split('@')[0].split('.').join(' ')
        .replace(/[0-9]/g, "")
    );
  }

  checkAndAdd(): void {
    const emailId = this.tools.getEmailIdFromEmail(this.emailCtrl.value);
    this.usersService.exists(emailId).then(exists => {
      if (exists) this.add.emit(emailId);
      else this.snackBar.open(`Cet email n'est pas enregistré`, 'ok', {duration:2000});
    })
  }
}
