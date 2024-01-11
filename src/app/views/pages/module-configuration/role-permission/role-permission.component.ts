import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  useritem,
  moduleDetails,
  prMenus,
  prFunc,
  permissionRequest,
} from '../module-config.models';
import { picklist } from 'src/app/core/models/liquidacion.models';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss'],
  animations: [
    trigger('fadeanimation', [
      state('in', style({ maxWidth: '400px', opacity: 1 })),
      transition(
        ':leave',
        animate('.3s  ease-in', style({ maxWidth: '0', opacity: 0 }))
      ),
    ]),
  ],
})
export class RolePermissionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;

  // constructor(private permissionsService: PermissionsService) {}

  ngOnInit(): void {
    this.doGetModules();
  }

  //--------- USERS
  searchtext = '';
  searchshowresult = false;
  searchresult: picklist[] = [];
  users: useritem[] = [];

  //---------- MODULES
  loadingModules = false;
  moduleList: moduleDetails[] = [];
  selectedModule: string = 'N/A';
  smoduledata: moduleDetails[] = [];

  modMenus: prMenus[] = [];
  mfunction: prFunc[] = [];
  msegment: prMenus[] = [];

  //----------------- ASIGNACIÓN
  request: permissionRequest = {
    module: '',
    users: [],
    menus: [],
    // segments: [],
    // functions: [],
  };

  doSearchPerson() {
    // const subs: Subscription = this.permissionsService
    //   .searchUsers(this.searchtext)
    //   .subscribe((resp: any) => {
    //     this.searchresult = resp;
    //     this.searchshowresult = true;
    //     subs.unsubscribe();
    //   });
  }

  doGetModules() {
    // this.loadingModules = true;
    // const subs: Subscription = this.permissionsService
    //   .getModules()
    //   .subscribe((resp: moduleDetails[]) => {
    //     console.log('MODULOS-->', resp);
    //     this.moduleList = resp;
    //     this.loadingModules = false;
    //     subs.unsubscribe();
    //   });
  }

  doCancelSearch() {
    this.searchresult = [];
    this.searchtext = '';
    this.searchshowresult = false;
  }

  doPickUser(element: any) {
    this.users.push({ id: element.id, value: element.name });
    this.doCancelSearch();
  }

  doPickModule(code: string) {
    // this.smoduledata = { ...this.moduleList.find((p) => p.code == code) };
    // this.modMenus = this.smoduledata.menus.map((resp) => {
    //   return {
    //     code: resp.code,
    //     name: resp.name,
    //     icon: resp.filter,
    //     selected: false,
    //   };
    // });

    // this.msegment = this.smoduledata.segments.map((m) => { return { code: m.code, name: m.name, icon: null, selected: false }});
    // this.mfunction = this.smoduledata.functions.map((m) => { return { code: m.code, name: m.name, lvl: 'N/A' }});
  }

  doRequestPermissions() {
    this.request.users = this.users.map((u) => u.id);
    // this.request.module = this.smoduledata.code;
    // this.request.menus = this.mmenus.filter(f=>f.selected).map(m=>m.code);
    // this.request.segments = this.msegment.filter(f=>f.selected).map(m=>m.code);
    // this.request.functions = this.mfunction.map(m=>{return{code:m.code, lvl:m.lvl}});
    // this.blockUI.start('Guardando...');
    // const subs: Subscription = this.permissionsService
    //   .addPermissions(this.request)
    //   .subscribe((resp: any) => {
    //     this.blockUI.stop();
    //     if (resp.status) {
    //       Swal.fire({
    //         icon: 'success',
    //         text: 'Permisos asignados',
    //         title: 'Operación exitosa',
    //       });
    //     } else {
    //       // this.serv.showAlertError(resp.message);
    //     }
    //     subs.unsubscribe();
    //   });
  }
}
