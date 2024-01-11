import { Component, OnInit } from '@angular/core';
import { UserDTO } from 'src/app/core/models/liquidacion.models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  showpage = false;
  showsetts = true;
  item: any = {};
  pageAction!: string;

  data: UserDTO[] = [];

  // constructor(private permissionsService: PermissionsService) {}

  ngOnInit(): void {
    this.updateUsers();
  }

  updateUsers() {
    // this.permissionsService
    //   .getAllUsers(0, 10)
    //   .subscribe((resp: any) => {
    //     this.data = resp;
    //   });
  }
  doShowPage(action: string, ite?: any) {
    this.item = ite || {};
    this.pageAction = action;
    this.showpage = true;
  }
}
