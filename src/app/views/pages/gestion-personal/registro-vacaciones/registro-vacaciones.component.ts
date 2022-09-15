import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PersonalService } from 'src/app/core/services/personal.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import { ModalVacacionesComponent } from './modal-vacaciones/modal-vacaciones.component';
import { CrearVacacionesComponent } from './crear-vacaciones/crear-vacaciones.component';

@Component({
  selector: 'app-registro-vacaciones',
  templateUrl: './registro-vacaciones.component.html',
  styleUrls: ['./registro-vacaciones.component.scss']
})
export class RegistroVacacionesComponent implements OnInit {


  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  filtroForm!: FormGroup;

  page = 1;
  totalVacaciones: number = 0;
  pageSize = 10;

  constructor(
    private personalService: PersonalService,
    private vacacionesService: VacacionesPersonalService,
    private exportExcellService: ExportExcellService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarVacaciones();
    this.getListProyectos();
    this.getLstEstadoVacaciones();
    this.getListAdminVacaciones();
    // console.log('DIF-DATE', this.time_difference);
    this.getCantDias();

    // this.difFechas();
  }

    newFilfroForm(){
    this.filtroForm = this.fb.group({
      cod_corp       : [''],
      nombres        : [''],
      apellidos      : [''],
      id_cod_proy    : [''],
      id_responsable : [''],
      id_estado_vac  : [''],
      id_sist_vac    : [''],
      fechaCreaVacIni: [''],
      fechaCreaVacFin: [''],
    })
  };

  listaRegVacaciones: any[] = [];
  fechaI: any
  cargarOBuscarVacaciones(){
    this.blockUI.start("Cargando Registro de Vacaciones...");
    let parametro: any[] = [{
      "queryId": 133,
      "mapValue": {
          nombre         : this.filtroForm.value.nombres + " " + this.filtroForm.value.apellidos,
          id_estado_vac  : this.filtroForm.value.id_estado_vac,
          cod_corp       : this.filtroForm.value.cod_corp,
          id_responsable : this.filtroForm.value.id_responsable,
          codigo_proyecto: this.filtroForm.value.id_cod_proy,
          sist_vac       : this.filtroForm.value.id_sist_vac,
          inicio         : this.datepipe.transform(this.filtroForm.value.fechaCreaVacIni,"yyyy/MM/dd"),
          fin            : this.datepipe.transform(this.filtroForm.value.fechaCreaVacFin,"yyyy/MM/dd"),
      }
    }];
    this.vacacionesService.cargarOBuscarVacaciones(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-VACACIONES-APROB', resp, resp.list.length);
      this.listaRegVacaciones = [];
      this.listaRegVacaciones = resp.list;
      this.fechaI = resp.list.map((fecha: any) => fecha.fecha_ini_vac);
      console.log('FECHA_I', this.fechaI);


      this.spinner.hide();
    });
  }

   difference(date1: any, date2: any) {
    const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    const day = 1000*60*60*24;

    return(date2utc - date1utc)/day
  }

  cantDias: number = 0;
  getCantDias(){
    // const date1 = new Date("08/10/2022");
    // const date2 = new Date("20/10/2022");
    const date1 = new Date("2020-12-3");
    const date2 = new Date("2020-12-31");

    this.cantDias = this.difference(date1 , date2)
  }


  listCodProy: any[] = [];
  getListProyectos() {
    let arrayParametro: any[] = [{ queryId: 1 }];

    this.personalService.getListProyectos(arrayParametro[0]).subscribe((resp: any) => {
        this.listCodProy = resp.list;
        // console.log('COD_PROY', resp);
      });
  }

  listEstadoVacacionesAprobadas: any[] = [];
  getLstEstadoVacaciones(){
  let parametro: any[] = [{ queryId: 132}];
  this.vacacionesService.getLstEstadoVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listEstadoVacacionesAprobadas = resp.list;
    // console.log('VACAC-ESTADO-APROB', resp.list);
    })
  }

  listAdminVacaciones: any[] = [];
  getListAdminVacaciones(){
  let parametro: any[] = [{ queryId: 127}];
  this.vacacionesService.getListAdminVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listAdminVacaciones = resp.list;
    // console.log('ADMIN-VACAS', resp.list);
    })
  }


  limpiarFiltro() {
    this.filtroForm.reset('', { emitEvent: false });
    this.newFilfroForm();

    this.cargarOBuscarVacaciones();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalVacaciones) {
      this.vacacionesService.cargarOBuscarVacaciones(offset.toString())
        .subscribe((resp: any) => {
          this.listaRegVacaciones = resp.list;
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
    }
    this.page = event;
  }

  crearVacaciones() {
    const dialogRef = this.dialog.open(CrearVacacionesComponent, {width: '55%',});

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.cargarOBuscarVacaciones();
      }
    });
  }

  actualizarVacaciones(DATA: any) {
    // console.log('DATA_PERSONA_HC', DATA);
    this.dialog
      .open(ModalVacacionesComponent, {width: '55%', height: '90%', data: DATA})
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarVacaciones();
        }
      });
  }

  exportarRegistro() {
    this.exportExcellService.exportarExcel(this.listaRegVacaciones, 'Vacaciones');
  }
}
