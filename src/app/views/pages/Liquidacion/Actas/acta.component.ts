import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalActaComponent } from './modal-actas/modal-acta.component';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { SubActasComponent } from './sub-actas/sub-actas.component';
import { ActasService } from 'src/app/core/services/actas.service';

@Component({
  selector: 'app-acta',
  templateUrl: './acta.component.html',
  styleUrls: ['./acta.component.scss'],
})
export class ActaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loading = false;

  page = 1;
  totalActas: number = 0;
  pageSize = 10;
  showingidx = 0;

  constructor(
    private liquidacionService: LiquidacionService,
    private actasService: ActasService,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newFilfroForm();
    this.getAllActas();
    this.getAllSubservicios();
    this.getAllProyecto();
  }

  actasForm!: FormGroup;
  newFilfroForm(){
    this.actasForm = this.fb.group({
      idActa       : [''],
      idProyecto   : [''],
      importe      : [''],
      idSubservicio: [''],
      periodo      : [''],
      import       : [''],
      idEstado     : [''],

      montoMinimo  : [''],
      montoMaximo  : ['']
    })
  };

  listActas: any[] = [];
  getAllActas(){
    this.blockUI.start("Cargando lista de Actas...");
    this.actasService.getAllActas(this.actasForm.value).subscribe(resp => {
    this.blockUI.stop();

      this.listActas = resp;
      console.log('ACTAS-LIST', resp);
    })
  }

  eliminarActa(idActa: number){}

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
    })
  }

  listSubservicios:any[] = [];
  getAllSubservicios(){
    const request = {
      idGestor     : '',
      idProyecto   : '',
      idSubservicio: this.actasForm.controls['idSubservicio'].value,
    }

    this.liquidacionService.getAllSubserviciosFiltro(request).subscribe( (resp: any) => {
      this.listSubservicios = resp.result;
      // console.log('SUBS', this.listSubservicios);
    })
  }

  limpiarFiltro() {
    this.actasForm.reset('', {emitEvent: false})
    this.newFilfroForm()

    this.getAllActas();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalActas) {
      // this.facturacionService.getAllActas(offset.toString()).subscribe( (resp: any) => {
      //       this.listaLiquidacion = resp.list;
      //       this.spinner.hide();
      //     });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  abrirModalCrearOactualizar(DATA?: any) {
    console.log('DATA_ACTAS', DATA);
    this.dialog
      .open(ModalActaComponent, { width: '70%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllActas();
        }
      });
  }

  abrirActa(DATA?: any) {
    console.log('DATA_ACTA', DATA);
    this.dialog
      .open(SubActasComponent, { width: '75%', data: DATA }) // height:'80%'
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllActas();
        }
      });
  }




  dataMenuPrueba(){
    this.loading = true;
    this.listActas = [
      {
        id_acta: 1,
        gestor: 'Alberto Regalado',
        proyecto: 'TQACOR',
        subservicio: 'H DE SERV- H DE Testing Hispam',
        estado: 'Pendiente',
        importe: '20000',
        periodo: '09-2023',
        comentario: 'No hay presupuesto suficiente',
        usu_act: 'jysantiago',
        icon: 'settings_suggest',
        enable: true,
        detalle_acta: [
          {
            id_det: 101,
            acta: 'TQACOR-A0017',
            proyecto: 'TQACOR',
            subservicio: 'Tren Post Venta',
            estado:'completado',
            venta_total: '181,45',
            declarado:'10000',
            facturado:'10000',
            pendiente:'10000',
            comentario: 'Cantidad total 2',
            icon:'delete',
            enable: false,
          },
          {
            id_det: 102,
            acta: 'TQAFAB-A0012',
            proyecto: 'TQACOR',
            subservicio: 'COM',
            estado:'completado',
            venta_total: '181,45',
            declarado:'10000',
            facturado:'10000',
            pendiente:'10000',
            comentario: 'Cantidad total 2',
            icon:'delete',
            enable: false,
          },
          {
            id_det: 103,
            acta: 'TQACOR-A0017',
            proyecto: 'TQACOR',
            subservicio: 'Tren Post Venta',
            estado:'completado',
            venta_total: '181,45',
            declarado:'10000',
            facturado:'10000',
            pendiente:'10000',
            comentario: '-',
            icon:'delete',
            enable: false,
          }
        ],
      },

      {
        id_acta: 2,
        gestor: 'Bedwer Hernandez',
        proyecto: 'TQACOR',
        subservicio: 'H DE SERV- H DE Testing Hispam',
        estado: 'completado',
        importe: '12000',
        periodo: '08-2023',
        comentario: 'No hay presupuesto suficiente',
        usu_act: 'rxayala',
        icon: 'grid_view',
        enable: false,
        detalle_acta: [
          {
            id_det: 201,
            acta: 'TQACOR-A0017',
            proyecto: 'TQACOR',
            subservicio: 'Tren Post Venta',
            estado:'completado',
            venta_total: '181,45',
            declarado:'10000',
            facturado:'10000',
            pendiente:'10000',
            comentario: 'Cantidad total 2',
            // gestor: 'Bedwer Hernandez',
            // categoria: 'Analista de calidad',
            // analista: 'SOTELO GUTIERREZ, FRANCISCO            ',
            // jornadas: '25,46',
            icon:'delete',
            enable: false,
          },
          {
            id_det: 202,
            acta: 'TQACOR-A0017',
            proyecto: 'TQACOR',
            subservicio: 'Tren Post Venta',
            estado:'completado',
            venta_total: '181,45',
            declarado:'10000',
            facturado:'10000',
            pendiente:'10000',
            comentario: 'Cantidad total 2',
            icon:'delete',
            enable: false,
        }
       ]
      },

      {
        id_acta: 3,
        gestor: 'Bedwer Hernandez',
        proyecto: 'TQACOM',
        subservicio: 'H DE SERV- H DE Testing Hispam',
        estado: 'Pendiente',
        importe: '13000',
        periodo: '09-2023',
        comentario: 'No hay presupuesto suficiente',
        usu_act: 'rxayala',
        icon: 'currency_exchange',
        enable: false,
        detalle_acta: [
          {
            id_det: 301,
            acta: 'TRATDP-A00212',
            proyecto: 'TQACOR',
            subservicio: 'Averías',
            estado:'completado',
            venta_total: '8000',
            declarado:'8000',
            facturado:'6000',
            pendiente: '1',
            comentario: 'Cantidad total 1',
            icon:'delete',
            enable: false,

          },
          {
            id_det: 302,
            acta: 'TDPNEG-A00110',
            proyecto: 'TQACOR',
            subservicio: 'Chatbot',
            estado:'completado',
            venta_total: '5000',
            declarado:'3000',
            facturado:'20000',
            pendiente:'20000',
            comentario: 'Cantidad total 2',
            icon:'delete',
            enable: false,
        }
       ]
      },

      {
        id_acta: 4,
        gestor: 'Bedwer Hernandez',
        proyecto: 'TRAPRO',
        subservicio: 'H DE SERV- H DE Testing Hispam',
        estado: 'Pendiente',
        importe: '12000',
        periodo: '10-2023',
        comentario: 'No hay presupuesto suficiente',
        usu_act: 'rxayala',
        icon: 'currency_exchange',
        enable: true,
        detalle_acta: [  ]
      }
    ]

    this.loading = false;
  }
}
