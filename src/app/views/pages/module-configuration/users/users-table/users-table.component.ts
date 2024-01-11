import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioDTO } from 'src/app/core/models/liquidacion.models';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit {
  // data!:UsuarioDTO[]
  data!:any[]

  table_settings = {
    page: 1,
    size: 10,
  };
  loadingItem = false;
  searcher = '';


  ngOnInit(): void {
    this.callItemApi('', '');
    this.dataUser();
  }

dataUser(){
  this.data = [
    {
    id: 123,
    name: 'Yovani',
    email: 'Yovani SE',
    rol: 'Admin'
    },
    {
      id: 234,
      name: 'Yosaes',
      email: 'Yovani SE',
      rol: 'Admin'
    },
    {
      id: 456,
      name: 'Yelsy',
      email: 'Yovani SE',
      rol: 'Admin'
    }
  ]

  }

  doUpdateRow(idx: number) {}

  doPageChange(i: number) {
    this.table_settings.page = this.table_settings.page + i;
    this.callItemApi('', '');
  }

  callItemApi(location: string, status: string) {
    // this.loadingItem = true;
    // const subs: Subscription = this.permissionsService.getAllUsers(
    //     this.table_settings.page - 1,
    //     this.table_settings.size,
    //     this.searcher
    //   )
    //   .subscribe((resp: any) => {
    //     this.data = resp;
    //     this.loadingItem = false;
    //     subs.unsubscribe();
    //   });
  }
}
