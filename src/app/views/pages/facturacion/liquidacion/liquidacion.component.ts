import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { CrearLiquidacionComponent } from '../liquidacion/crear-liquidacion/crear-liquidacion.component';
import { ActualizarLiquidacionComponent } from '../liquidacion/actualizar-liquidacion/actualizar-liquidacion.component';
import { ActualizacionMasivaComponent } from './actualizacion-masiva/actualizacion-masiva.component';
import { FacturacionService } from 'src/app/core/services/facturacion.service';

@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.scss']
})
export class LiquidacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  filtroForm!: FormGroup;

  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;
  // pageSizes = [3, 6, 9];

  constructor(
    private facturacionService: FacturacionService,
    private exportExcellService: ExportExcellService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarLiquidacion();
    this.getListEstados();
    this.getListProyectos();
    this.getListGestores();
    this.getListLiquidaciones();
    this.exportListVD_Fact();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      codFact            : [''],
      id_proy            : [''],
      id_liquidacion     : [''],
      id_estado          : [''],
      fechaRegistroInicio: [''],
      fechaRegistroFin   : [''],
      id_gestor          : [''],
      importe            : ['']
    })
  };

  listaLiquidacion: any[] = [];
  cargarOBuscarLiquidacion(){
    this.blockUI.start("Cargando liquidaciones...");
    let parametro: any[] = [{
      "queryId": 118,
      "mapValue": {
          cod_fact       : this.filtroForm.value.codFact,
          id_proy        : this.filtroForm.value.id_proy,
          id_liquidacion : this.filtroForm.value.id_liquidacion,
          id_estado      : this.filtroForm.value.id_estado,
          id_gestor      : this.filtroForm.value.id_gestor,
          importe        : this.filtroForm.value.importe,
          inicio         : this.datepipe.transform(this.filtroForm.value.fechaRegistroInicio,"yyyy/MM/dd"),
          fin            : this.datepipe.transform(this.filtroForm.value.fechaRegistroFin,"yyyy/MM/dd"),
      }
    }];
    this.facturacionService.cargarOBuscarLiquidacion(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Liquidaciones', resp.list, resp.list.length);
      this.listaLiquidacion = [];
      this.listaLiquidacion = resp.list;

      this.spinner.hide();
    });
  }

  eliminarLiquidacion(id: number){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 122,
      mapValue: {
        p_idFactura: id,
      }
    }];
    Swal.fire({
      title: '¿Eliminar Liquidación?',
      text: `¿Estas seguro que deseas eliminar la Liquidación: ${id}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if (resp.value) {
        this.facturacionService.eliminarLiquidacion(parametro[0]).subscribe(resp => {

          this.cargarOBuscarLiquidacion();

            Swal.fire({
              title: 'Eliminar Liquidación',
              text: `La Liquidación: ${id}, fue eliminado con éxito`,
              icon: 'success',
            });
          });
      }
    });
    this.spinner.hide();
  }

  listEstados: any[] = [];
  getListEstados(){
    let parametro: any[] = [{queryId: 101}];

    this.facturacionService.getListEstados(parametro[0]).subscribe((resp: any) => {
            this.listEstados = resp.list;
            // console.log('EST-FACT', resp);
    });
  }

  listVD_Fact: any[] = [];
  exportListVD_Fact(){
    let parametro: any[] = [{queryId: 136}];

    this.facturacionService.exportListVD_Fact(parametro[0]).subscribe((resp: any) => {
            this.listVD_Fact = resp.list;
            console.log('EXPORT-VD_FACT', resp);
    });
  }

  listGestores: any[] = [];
  getListGestores(){
    let parametro: any[] = [{queryId: 102}];

    this.facturacionService.getListGestores(parametro[0]).subscribe((resp: any) => {
            this.listGestores = resp.list;
            // console.log('GESTORES', resp);
    });
  };

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.facturacionService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp.list;
            // console.log('COD_PROY', resp.list);
    });
  };

  listLiquidaciones: any[] = [];
  getListLiquidaciones(){
    let parametro: any[] = [{queryId: 82}];
    this.facturacionService.getListLiquidaciones(parametro[0]).subscribe((resp: any) => {
            this.listLiquidaciones = resp.list;
            // console.log('LIQUIDAC', resp);
    });
  }


  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})
    this.newFilfroForm()

    this.cargarOBuscarLiquidacion();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalFacturas) {
      this.facturacionService.cargarOBuscarLiquidacion(offset.toString()).subscribe( (resp: any) => {
            this.listaLiquidacion = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  crearLiquidacion(){
    const dialogRef = this.dialog.open(CrearLiquidacionComponent, {width:'55%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarLiquidacion()
      }
    })
  }

  actualizacionMasiva(){
    const dialogRef = this.dialog.open(ActualizacionMasivaComponent, {width:'20%', });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarLiquidacion()
      }
    })
  }


  actualizarFactura(DATA: any) {
    // console.log('DATA_LIQUID', DATA);

    this.dialog
      .open(ActualizarLiquidacionComponent, { width: '70%', height: '95%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarLiquidacion();
        }
      });
  }

  exportarRegistro(){
    this.exportExcellService.exportarExcel(this.listaLiquidacion, 'Factura_Filtro')
  }

  exportarVD_FACT(){
    this.exportExcellService.exportarExcel(this.listVD_Fact, 'FACTURACION-VENT_DECLARADA')
  }
}



