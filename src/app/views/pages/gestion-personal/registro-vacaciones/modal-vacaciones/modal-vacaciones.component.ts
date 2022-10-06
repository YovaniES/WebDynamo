import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilService } from 'src/app/core/services/util.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import Swal from 'sweetalert2';
import { AsignarVacacionesComponent } from './asignar-vacaciones/asignar-vacaciones.component';

@Component({
  selector: 'app-modal-vacaciones',
  templateUrl: './modal-vacaciones.component.html',
  styleUrls: ['./modal-vacaciones.component.scss']
})

export class ModalVacacionesComponent implements OnInit {
  // moment().format("L"); 16/02/2021

  minDate = new Date();
  maxDate = new Date(2022, 9, 9);

  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  vacacionesForm!: FormGroup;

  constructor(
    private vacacionesService: VacacionesPersonalService,
    private utilService: UtilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ModalVacacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_VACACIONES: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUsuario();
    this.getListEstadoVacaciones();
    this.getLstSistemaVacaciones();
    this.cargarPeriodoVacaciones(false);
    this.cargarVacacionesById();
    this.getHistoricoCambiosEstado(this.DATA_VACACIONES);
    console.log('DATA_VACACIONES', this.DATA_VACACIONES);
    console.log('ID_DATA_VACACIONES', this.DATA_VACACIONES.id_vacaciones);
    this.vacacionesForm.controls['idVacaciones'].setValue(this.DATA_VACACIONES)
    // console.log('FECHA_1', moment(this.DATA_VACACIONES.fecha_ini_vac).format("YYYY-MM-DD hh:mm A"));
    // console.log('FECHA_123', moment(Date.now()).format('YYYY-MM-DD hh:mm A'));
  }

    newForm(){
      this.vacacionesForm = this.fb.group({
       nombre        : ['', [Validators.required]],
       apPaterno     : [''],
       apMaterno     : [''],
       codCorp       : [''],
       fechaInicVac  : [''],
       fechaFinVac   : [''],
       id_proyecto   : [''],
       estado_persona: [''],
       proyecto      : [''],
       id_estado_vac : [''],
       estado_vac    : [''],
       idSistema     : [''],
       periodoVac    : [''],
       fecha_ingreso : [''],
       total_dias_vac: [''],
       idVacaciones  : [''],
      })
     }

  // filtroFecha(calendario: Date): boolean {
  //   // const dateIni = moment.utc(this.DATA_VACACIONES.fecha_ini_vac).format('YYYY-MM-DD')
  //   // console.log('FECHA_START', dateIni);
  //   const fechaInicial = '2022-09-25'
  //   return calendario > new Date(fechaInicial);
  // }

  getFechaIni(event: any){
    console.log('FECHA-INI-IMPUT', event.target.value);
  }

  getFechaInit(e: any){
    console.log('F_INI', e.target.value);
  }

  actualizarVacaciones(estadoVacaciones?: number ){
    this.spinner.show();

    const formValues = this.vacacionesForm.getRawValue();
    let parametro: any[] = [{
        queryId: 138,
        mapValue: {
          p_idVac             : this.DATA_VACACIONES.idVac,
          p_id_persona        : this.DATA_VACACIONES.id_persona,
          p_id_sist_vac       : formValues.idSistema,
          p_fecha_ini_vac     : moment.utc(formValues.fechaInicVac).format('YYYY-MM-DD'),
          p_fecha_fin_vac     : moment.utc(formValues.fechaFinVac).format('YYYY-MM-DD'),
          p_id_estado_vac     : estadoVacaciones? estadoVacaciones : formValues.id_estado_vac, // ENVIAR EL ESTADO DEL PERIODO CON ESTADO 'PLANIFICADO', COMPLETADO
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: ''
        },
      }];
    this.vacacionesService.actualizarVacaciones(parametro[0]).subscribe( resp => {
      this.spinner.hide();
      console.log('DATA_ACTUALIZADO', resp);
      console.log('FECHA_INI',moment.utc(formValues.fechaInicVac).format('YYYY-MM-DD') );

      this.cargarVacacionesById();
      this.close(true)

      Swal.fire({
        title: 'Actualizar Vacaciones!',
        text : `La vacación de: ${ formValues.nombre } ${ formValues.apPaterno }, fue actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    });
  };

  actionBtn: string = 'Registrar';
  cargarVacacionesById(){
    this.spinner.show();

      this.vacacionesForm.controls['nombre'        ].setValue(this.DATA_VACACIONES.nombres);
      this.vacacionesForm.controls['apPaterno'     ].setValue(this.DATA_VACACIONES.apellido_paterno);
      this.vacacionesForm.controls['apMaterno'     ].setValue(this.DATA_VACACIONES.apellido_materno);
      this.vacacionesForm.controls['codCorp'       ].setValue(this.DATA_VACACIONES.codigo_corporativo);
      this.vacacionesForm.controls['proyecto'      ].setValue(this.DATA_VACACIONES.codigo_proyecto);
      this.vacacionesForm.controls['id_proyecto'   ].setValue(this.DATA_VACACIONES.id_proyecto);
      this.vacacionesForm.controls['estado_persona'].setValue(this.DATA_VACACIONES.estado_persona);
      this.vacacionesForm.controls['id_estado_vac' ].setValue(this.DATA_VACACIONES.id_estado_vac);
      this.vacacionesForm.controls['estado_vac'    ].setValue(this.DATA_VACACIONES.estado_vac);

      this.vacacionesForm.controls['idSistema'     ].setValue(this.DATA_VACACIONES.id_sist_vac);
      this.vacacionesForm.controls['total_dias_vac'].setValue(this.DATA_VACACIONES.cant_dias_vac);
      this.vacacionesForm.controls['fecha_ingreso' ].setValue(this.DATA_VACACIONES.fecha_ingreso);

      if (this.DATA_VACACIONES.fecha_ini_vac) {
        let fecha_x = this.DATA_VACACIONES.fecha_ini_vac
        const str   = fecha_x.split('/');
        const year  = Number(str[2]);
        const month = Number(str[1]);
        const date  = Number(str[0]);
        this.vacacionesForm.controls['fechaInicVac'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      }

      if (this.DATA_VACACIONES.fecha_fin_vac) {
        let fecha_x = this.DATA_VACACIONES.fecha_fin_vac
        const str   = fecha_x.split('/');
        const year  = Number(str[2]);
        const month = Number(str[1]);
        const date  = Number(str[0]);
        this.vacacionesForm.controls['fechaFinVac'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      }
      this.spinner.hide();
  }

  eliminarPeriodoVacaciones(id: number){
    this.spinner.show();

    let parametro:any[] = [{
      "queryId": 141,
      "mapValue": {
        "p_idPeriodoVac"      : id,
        "CONFIG_USER_ID"      : this.userID,
        "CONFIG_OUT_MSG_ERROR": '',
        "CONFIG_OUT_MSG_EXITO": ''
      }
    }];
      Swal.fire({
        title: 'Eliminar periodo?',
        text: `¿Estas seguro que desea eliminar el periodo?`,
        icon: 'question',
        confirmButtonColor: '#20c997',
        cancelButtonColor : '#b2b5b4',
        confirmButtonText : 'Si, Eliminar!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((resp) => {
        if (resp.value) {
          this.vacacionesService.eliminarPeriodoVacaciones(parametro[0]).subscribe(resp => {
            this.cargarPeriodoVacaciones();

              Swal.fire({
                title: 'Eliminar periodo',
                text : `El periodo fue eliminado con éxito`,
                icon : 'success',
              });
            });
        }
    });
    this.spinner.hide();
  }

  totalDiasVac(){
    const fechaIni = moment.utc(this.vacacionesForm.controls['fechaInicVac'].value).format('YYYY-MM-DD')
    const fechaFin = moment.utc(this.vacacionesForm.controls['fechaFinVac' ].value).format('YYYY-MM-DD')

    if (fechaIni && fechaFin) {
      const numDias = this.utilService.calcularDifDias( fechaFin, fechaIni)

      this.vacacionesForm.controls['total_dias_vac'].setValue(numDias)
      console.log('DIAS_ESTADO', numDias);
    }
  }

  listVacacionesEstado: any[] = [];
  getListEstadoVacaciones(){
  let parametro: any[] = [{ queryId: 124}];
  this.vacacionesService.getListEstadoVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listVacacionesEstado = resp.list;
    // console.log('VACAS-ESTADO', resp.list);
    })
  }

  listVacacionesPeriodo: any[]= [];
  cargarPeriodoVacaciones(validadEstadosPeriodos: boolean = true){
    this.listVacacionesPeriodo = [];

    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 128,
      "mapValue": {
      "p_id_vacaciones": this.DATA_VACACIONES.idVac,
      }
    }];

    this.vacacionesService.cargarPeriodoVacaciones(parametro[0]).subscribe( (resp: any) => {
      this.listVacacionesPeriodo = resp.list;
      console.log('PERIODOS-PLANIFICADAS', resp.list);
        if (validadEstadosPeriodos) {
          this.validarPeriodoVacaciones(this.listVacacionesPeriodo)
        }
    })
  }

  buscarEstadoPorDescripcion(descripcion: string): any{
    return this.listVacacionesEstado.find( estado => estado.valor_texto_1.toUpperCase() == descripcion)
  }

  validarPeriodoVacaciones(listVacacionesPeriodo: any[]){
      const existePeriodoPlanificado = listVacacionesPeriodo.find(periodo => periodo.vac_estado.toUpperCase() == 'PLANIFICADO')
      console.log('PERIODO_PLANI', existePeriodoPlanificado, this.listVacacionesEstado);

      if (existePeriodoPlanificado) {
        this.validarEstadoPlanificado();
      } else if (!existePeriodoPlanificado) {
        this.validarEstadoRegistrado()
      } else {
        this.validarEstadoCompletado(listVacacionesPeriodo);
      }

  }

  validarEstadoRegistrado(){
    const idEstadoRegistrado = this.buscarEstadoPorDescripcion('REGISTRADO');
    if (idEstadoRegistrado) {
      // console.log('ID_EST_PLANIF', idEstadoRegistrado);
      this.actualizarVacaciones(idEstadoRegistrado.id_correlativo);
    }
  }

  validarEstadoPlanificado(){
    const idEstadoPlanificado = this.buscarEstadoPorDescripcion('PLANIFICADO');
    if (idEstadoPlanificado) {
      // console.log('ID_EST_PLANIF', idEstadoPlanificado);
      this.actualizarVacaciones(idEstadoPlanificado.id_correlativo);
    }
  }

  validarEstadoCompletado(listVacacionesPeriodo: any[]){
    const cantidadDiasCompletados = this.acumularDiasCompletados(listVacacionesPeriodo);

    console.log('DIAS_COMPL', cantidadDiasCompletados, this.vacacionesForm.controls['total_dias_vac'].value);
    if (cantidadDiasCompletados == this.vacacionesForm.controls['total_dias_vac'].value) {
      console.log('DIAS');
    const idEstadoCompletado = this.buscarEstadoPorDescripcion('COMPLETADO');
    // const idEstadoRegistrado = this.buscarEstadoPorDescripcion('REGISTRADO');

    this.actualizarVacaciones(idEstadoCompletado.id_correlativo);
    }
  }

  acumularDiasCompletados(listVacacionesPeriodo: any[]): number{
    let cantidadDiasCompletados = 0;
    listVacacionesPeriodo.map( periodo => {
      if (periodo.vac_estado.toUpperCase() == 'COMPLETADO') {
        cantidadDiasCompletados = cantidadDiasCompletados + periodo.cant_dias_periodo;
      }
    });
    return cantidadDiasCompletados;
  }

  histCambiosEstado: any[] = [];
  getHistoricoCambiosEstado(id: number){
  this.spinner.show();
    let parametro: any[] = [{
      queryId: 139,
      mapValue: {p_id_vacaciones: this.DATA_VACACIONES.idVac}
    }];

    this.vacacionesService.getHistoricoCambiosEstado(parametro[0]).subscribe((resp: any) => {
      this.histCambiosEstado = resp.list;
      console.log('HistCambEstado', resp.list)
    });
    this.spinner.hide();
  }

  listSistemaVacaciones: any[] = [];
  getLstSistemaVacaciones(){
  let parametro: any[] = [{ queryId: 126}];
  this.vacacionesService.getListSistemaVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listSistemaVacaciones = resp.list;
    // console.log('SISTEMA-ASIG_VAC', resp.list);
    })
  }

  userID: number = 0;
  getUsuario(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     // console.log('ID-USER', this.userID);
   })
  };

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

  campoNoValido(campo: string): boolean {
    if ( this.vacacionesForm.get(campo)?.invalid && (this.vacacionesForm.get(campo)?.dirty || this.vacacionesForm.get(campo)?.touched) ) {
      return true;
    } else {
      return false;
    }
  }

  asignarPeriodoEstAvacaciones(dataPeriodo: any){
    console.log('data_periodo_asignado', dataPeriodo);

    this.vacacionesForm.controls['estado_vac'   ].setValue(dataPeriodo.vac_estado)
    this.vacacionesForm.controls['id_estado_vac'].setValue(dataPeriodo.id_per_estado)
  }

  asignarVacaciones(){
    const diasVacaciones = this.utilService.calcularDifDias(this.vacacionesForm.controls['fechaFinVac'].value, this.vacacionesForm.controls['fechaInicVac'].value);
    // console.log('FORMULARIO', this.vacacionesForm.value, this.utilService.calcularDifDias(this.vacacionesForm.controls['fechaFinVac'].value, this.vacacionesForm.controls['fechaInicVac'].value));
    const dialogRef = this.dialog.open(AsignarVacacionesComponent, { width:'35%', data: {vacForm: this.vacacionesForm.value, isCreation: true, diasVacaciones: diasVacaciones} });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {

        this.cargarPeriodoVacaciones()
        // this.asignarPeriodoEstAvacaciones(resp)
      }
    })
  };

  actualizarPeriodoVacaciones(DATA: any){
    console.log('DATA_VACACIONES', DATA);
    // const DATA = this.facturaForm.value
    const dialogRef = this.dialog.open(AsignarVacacionesComponent, { width:'35%', data: DATA});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarPeriodoVacaciones()
      }
    })
  };
}

