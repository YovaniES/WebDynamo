import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Menu } from 'src/app/core/models/menu.models';
import Swal from 'sweetalert2';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-modal-edit-module',
  templateUrl: './modal-edit-module.component.html',
  styleUrls: ['./modal-edit-module.component.scss'],
})
export class ModalEditModuleComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;

  modecode = '';
  menu: Menu = {
    code    : '',
    text    : '',
    order   : 0,
    icon    : '',
    type    : '',
    link    : '',
    enable  : true,
    module  : '',
    submenus: [],
  };

  constructor( public dialogRef: MatDialogRef<ModalEditModuleComponent>,
               @Inject(MAT_DIALOG_DATA)
    public data: {
      module    : Menu;
      ismodule  : boolean;
      isnew     : boolean;
      modulename: string;
    }
  ) {}

  ngOnInit(): void {
    if (!this.data.isnew) this.menu = { ...this.data.module };

    if (!this.data.ismodule) {
      if (!this.data.isnew) this.modecode = this.data.module.module;
      else this.modecode = this.data.module.code;
    }
  }

  save() {
    this.blockUI.start('Guardando...');
    // MÓDULOS
    // if (this.data.ismodule) {
    //   this.menu.module = this.data.isnew ? 'ADD' : 'EDT';
    //   const sub: Subscription = this.permissionService
    //     .postModule(this.menu)
    //     .subscribe((resp: any) => {
    //       this.blockUI.stop();
    //       if (resp.status) this.dialogRef.close(this.menu);
    //       else this.showAlertError(resp.message);
    //       sub.unsubscribe();
    //     });

    //   // MENÚS
    // } else {
    //   this.menu.module = this.modecode;
    //   const sub: Subscription = this.permissionService
    //     .postMenu(this.menu)
    //     .subscribe((resp: any) => {
    //       this.blockUI.stop();
    //       if (resp.status) this.dialogRef.close(this.menu);
    //       else this.showAlertError(resp.message);
    //       sub.unsubscribe();
    //     });
    // }
  }

  showAlertError(message: string) {
    Swal.fire({
      title: 'Error',
      icon : 'error',
      text : message,
    });
  }
}

