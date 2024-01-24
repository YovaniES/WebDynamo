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
import Swal from 'sweetalert2';

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

  ID_ACTA: number | undefined ;
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
    this.getAllSubserviciosCombo();
    this.getListGestorCombo();
    this.getAllEstadosActa();
    this.getAllProyecto();
  }

  actasForm!: FormGroup;
  newFilfroForm(){
    this.actasForm = this.fb.group({
      idActa          : [''],
      idProyecto      : [''],
      idSubservicio   : [''],
      idGestor        : [''],
      periodo         : [''],
      idEstado        : [''],
      montoMinimo     : [''],
      montoMaximo     : [''],
      estadoAgrupacion: ['']
    })
  };

  total_actas: number = 0;
  contarActas(){
    const params = this.actasForm.getRawValue();

    this.actasService.totalActas(params).subscribe(resp => {
      this.total_actas = resp;
      // console.log('CONTAR_aCTAS', this.total_actas);
    })
  };

  listActasFilterExportar: any[] = [];
  exportarFiltroActas(){
    const params = this.actasForm.getRawValue();

    this.actasService.getActaExportableResume(params).subscribe( (resp: any) => {
      this.listActasFilterExportar = resp
      // console.log('EXPORT_ACTA', this.listActasFilterExportar);

    })
  }

  listVentasDeclaradasExport: any[] = [];
  exportarVentasDeclaradas(){
    this.actasService.exportarVentasDeclaradas().subscribe( resp => {
      this.listVentasDeclaradasExport = resp;
      // console.log('EXPORT_VD', this.listVentasDeclaradasExport);

    })
  }

  listActas: any[] = [];
  getAllActas(){
    this.blockUI.start("Cargando lista de Actas...");
    const request = {... this.actasForm.value}
    // request.periodo = request.periodo? '' : request.periodo + '-' + '01';

    const formaValues = this.actasForm.getRawValue();

    const req = {
        idActa          : formaValues.idActa,
        idProyecto      : formaValues.idProyecto,
        idSubservicio   : formaValues.idSubservicio,
        idEstado        : formaValues.idEstado,
        periodo         : this.actasForm.controls['periodo'].value? formaValues.periodo+'-01': '',
        montoMinimo     : formaValues.montoMinimo,
        montoMaximo     : formaValues.montoMaximo,
        idGestor        : formaValues.idGestor,
        estadoAgrupacion: formaValues.estadoAgrupacion
      }

    this.actasService.getAllActas(req).subscribe(resp => {
      this.blockUI.stop();
      this.listActas = resp;
      // console.log('ACTAS-LIST-FILTRO', resp);
    })
    this.contarActas();
    this.exportarVentasDeclaradas();
    this.exportarFiltroActas();

  }

  eliminarActa(acta: any) {
    // console.log('DEL_ACTA', acta);

    Swal.fire({
      title: '¿Eliminar acta?',
      text: `¿Estas seguro que deseas eliminar el acta: ${acta.idActaConcat}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actasService.eliminarActa(acta.idActa).subscribe((resp) => {
            Swal.fire({
              title: 'Eliminar acta',
              text: `${acta.idActaConcat}: ${resp.message} exitosamente`,
              icon: 'success',
            });
            this.getAllActas();
          });
      }
    });
  };

  exportarActa(){
    this.actasService.exportarExcel(this.listActasFilterExportar, 'actas')
  };


  exportarVentaDeclarada(){
    this.actasService.exportarExcel(this.listVentasDeclaradasExport, 'ventas_declaradas')
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectos = resp;
      // console.log('PROY', this.listProyectos);
    })
  }

  listGestoresCombo: any[] = [];
  getListGestorCombo(){
    this.liquidacionService.getAllGestorCombo().subscribe((resp: any) => {
      this.listGestoresCombo = resp;
      // console.log('GESTOR_COMBO', this.listGestoresCombo);

    })
  }

  listSubserviciosCombo:any[] = [];
  getAllSubserviciosCombo(){
    this.liquidacionService.getAllSubserviciosCombo().subscribe( (resp: any) => {
      this.listSubserviciosCombo = resp;
      // console.log('SUBSERV', this.listSubserviciosCombo);
    })
  };

  listEstadoActa: any[] = [];
  getAllEstadosActa(){
    this.liquidacionService.getAllEstadosActa().subscribe(resp => {
      this.listEstadoActa = resp;
      // console.log('EST_ACTA', this.listEstadoActa);
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
      .open(ModalActaComponent, { width: '70%', data: {DATA,} })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllActas();
        }
      });
  }

  abrirActa(DATA?: any) {
    // console.log('DATA_ACTA', DATA);
    this.dialog
      .open(SubActasComponent, { width: '75%', data: DATA }) // height:'80%'
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllActas();
        }
      });
  }

}
