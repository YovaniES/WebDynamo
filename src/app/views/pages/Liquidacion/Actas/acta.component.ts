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
    this.getAllSubservicios();
    this.getListGestor();
    this.getAllEstadosDetActa();
    this.getAllProyecto();
  }

  actasForm!: FormGroup;
  newFilfroForm(){
    this.actasForm = this.fb.group({
      idActa          : [''],
      idProyecto      : [''],
      importe         : [''],
      idSubservicio   : [''],
      idGestor        : [''],
      periodo         : [''],
      import          : [''],
      idEstado        : [''],
      montoMinimo     : [''],
      montoMaximo     : [''],
      estadoAgrupacion: ['']
    })
  };

  listActas: any[] = [];
  getAllActas(){
    this.blockUI.start("Cargando lista de Actas...");
    const request = {... this.actasForm.value}
    request.periodo = request.periodo? '' : request.periodo + '-' + '01';

    const formaValues = this.actasForm.getRawValue();

    const req = {
        idActa          : formaValues.idActa,
        idProyecto      : formaValues.proyecto,
        idSubservicio   : formaValues.idSubservicio,
        idEstado        : formaValues.idEstado,
        periodo         : this.actasForm.controls['periodo'].value? '': formaValues.periodo,
        // periodo         : formaValues.periodo? '' : formaValues.periodo + '-' + '01',
        montoMinimo     : formaValues.montoMinimo,
        montoMaximo     : formaValues.montoMaximo,
        idGestor        : formaValues.idGestor,
        estadoAgrupacion: formaValues.estadoAgrupacion
      }

    this.actasService.getAllActas(req).subscribe(resp => {
    this.blockUI.stop();

      this.listActas = resp;
      // this.ID_ACTA = resp.actaResponses.idActa;
      console.log('ACTAS-LIST-FILTRO', resp);
      console.log('ID_ACTA', this.ID_ACTA);
    })
  }

  eliminarActa(idActa: number){}

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY', this.listProyectos);
    })
  }

  listGestores: any[] = [];
  getListGestor(){
    this.liquidacionService.getAllGestores().subscribe((resp: any) => {
      this.listGestores = resp;
    })
  }

  listSubservicios:any[] = [];
  getAllSubservicios(){
    this.liquidacionService.getAllSubservicios().subscribe( (resp: any) => {
      this.listSubservicios = resp.result;
      // console.log('SUBSERV', this.listSubservicios);
    })
  };

  listEstadoDetActa: any[] = [];
  getAllEstadosDetActa(){
    this.actasService.getAllEstadosDetActa().subscribe(resp => {
      this.listEstadoDetActa = resp.filter((x:any) => x.eliminacion_logica == 1 );
      // console.log('EST_DET_ACTA', this.listEstadoDetActa);
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
      .open(ModalActaComponent, { width: '70%', data: {DATA, proyectos_x: this.listProyectos} })
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
