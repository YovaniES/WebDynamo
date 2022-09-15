import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import { UtilService } from 'src/app/core/services/util.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import Swal from 'sweetalert2';
import { AsignarPersonalComponent } from './asignar-personal/asignar-personal.component';
import { AsignarVacacionesComponent } from './asignar-vacaciones/asignar-vacaciones.component';

@Component({
  selector: 'app-modal-vacaciones',
  templateUrl: './modal-vacaciones.component.html',
  styleUrls: ['./modal-vacaciones.component.scss']
})
export class ModalVacacionesComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  vacacionesForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
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
    this.getLstEstadoVacaciones();
    this.getLstSistemaVacaciones();
    this.cargarVacacionesAsignado();
    this.cargarVacacionesById();
    // this.getHistoricoCambiosProyecto(this.DATA_VACACIONES);
    console.log('DATA_VACACIONES', this.DATA_VACACIONES);
    console.log('ID_DATA_VACACIONES', this.DATA_VACACIONES.id_vacaciones);

    this.vacacionesForm.controls['idVacaciones'].setValue(this.DATA_VACACIONES)
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
       idSistema     : [''],
       periodoVac    : [''],

       fecha_ingreso : [''],
       total_dias_vac: [''],
       idVacaciones  : ['']

      })
     }


  actualizarPersonalVacaciones(){
    this.spinner.show();

    const formValues = this.vacacionesForm.getRawValue();
    let parametro: any[] = [{
        queryId: 8,
        mapValue: {
          param_id_persona        : formValues.idPersonal,
          param_codigo_corporativo: formValues.codCorp,
          param_nombres           : formValues.nombre,
          param_apellido_paterno  : formValues.apPaterno,
          param_apellido_materno  : formValues.apMaterno,
          param_dni               : formValues.dni,
          param_correo            : formValues.correo,
          param_fecha_ingreso     : formValues.fecha_ingreso,
          param_fecha_nacimiento  : formValues.fechaNacimiento,
          param_id_proyecto       : formValues.id_proyecto,
          param_id_perfil         : formValues.codPerfil,
          param_id_sistema        : formValues.idSistema,
          param_periodo           : formValues.periodoVac,
          param_estado            : 1,
          CONFIG_USER_ID          : this.userID,
          CONFIG_OUT_MSG_ERROR    : "",
          CONFIG_OUT_MSG_EXITO    : "",
        },
      }];
    this.vacacionesService.actualizarPersonalVacaciones(parametro[0]).subscribe( resp => {
      this.spinner.hide();
      console.log('DATA_ACTUALIZADO', resp);

      this.cargarVacacionesById();
      this.close(true)

      Swal.fire({
        title: 'Actualizar Vacaciones!',
        text : `La vacación:  ${ formValues.nombre +' '+formValues.apPaterno }, fue actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    });
  };

  actionBtn: string = 'Registrar';
  cargarVacacionesById(){
    this.spinner.show();

      // this.vacacionesForm.controls['idPersonal'    ].setValue(this.DATA_VACACIONES.id_persona);
      // this.vacacionesForm.controls['id_vacaciones' ].setValue(this.DATA_VACACIONES.id_vacaciones);
      this.vacacionesForm.controls['nombre'        ].setValue(this.DATA_VACACIONES.nombres);
      this.vacacionesForm.controls['apPaterno'     ].setValue(this.DATA_VACACIONES.apellido_paterno);
      this.vacacionesForm.controls['apMaterno'     ].setValue(this.DATA_VACACIONES.apellido_materno);
      this.vacacionesForm.controls['codCorp'       ].setValue(this.DATA_VACACIONES.codigo_corporativo);
      this.vacacionesForm.controls['proyecto'      ].setValue(this.DATA_VACACIONES.codigo_proyecto);
      this.vacacionesForm.controls['id_proyecto'   ].setValue(this.DATA_VACACIONES.id_proyecto);
      this.vacacionesForm.controls['estado_persona'].setValue(this.DATA_VACACIONES.estado_persona);
      this.vacacionesForm.controls['id_estado_vac' ].setValue(this.DATA_VACACIONES.id_estado_vac);

      this.vacacionesForm.controls['idSistema'     ].setValue(this.DATA_VACACIONES.id_sist_vac);
      this.vacacionesForm.controls['total_dias_vac'].setValue(this.DATA_VACACIONES.cant_dias_vac);
      this.vacacionesForm.controls['fecha_ingreso' ].setValue(this.DATA_VACACIONES.fecha_ingreso);

      // if (this.DATA_VACACIONES.fecha_ingreso) {
      //   let fecha_x = this.DATA_VACACIONES.fecha_ingreso
      //   const str   = fecha_x.split('/');
      //   const year  = Number(str[2]);
      //   const month = Number(str[1]);
      //   const date  = Number(str[0]);
      //   this.vacacionesForm.controls['fecha_ingreso'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      // }

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

  eliminarVacaciones(idRecurso: number){
    this.spinner.show();

    let parametro:any[] = [{
      "queryId": 26,
      "mapValue": {
        "param_id_persona"    : this.DATA_VACACIONES.id_vacaciones,
        "param_id_recurso"    : idRecurso,
        "CONFIG_USER_ID"      : this.userID,
        "CONFIG_OUT_MSG_ERROR": '',
        "CONFIG_OUT_MSG_EXITO": ''
      }
    }];
      Swal.fire({
        title: 'Eliminar vacaciones?',
        text: `¿Estas seguro que desea Eliminar la vacación: ${idRecurso}?`,
        icon: 'question',
        confirmButtonColor: '#ec4756',
        cancelButtonColor : '#0d6efd',
        confirmButtonText : 'Si, Desasignar!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((resp) => {
        if (resp.value) {
          this.vacacionesService.eliminarVacaciones(parametro[0]).subscribe(resp => {
            this.cargarVacacionesAsignado();

              Swal.fire({
                title: 'Eliminar vacaciones',
                text : `La vacación: ${idRecurso}, fue eliminado con éxito`,
                icon : 'success',
              });
            });
        }
    });
    this.spinner.hide();
  }

  listVacacionesPeriodo: any[]= [];
  cargarVacacionesAsignado(){
    this.listVacacionesPeriodo = [];

    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 128,
      "mapValue": {
      "p_id_vacaciones": this.DATA_VACACIONES.id_vacaciones,
      }
    }];

    this.vacacionesService.cargarVacacionesAsignado(parametro[0]).subscribe( (resp: any) => {
      this.listVacacionesPeriodo = resp.list;
      console.log('VACACIONES-PLANIFICADAS', resp.list);
    })
  }


  histCambiosProyecto: any[] = [];
  getHistoricoCambiosProyecto(id: number){
  this.spinner.show();
    let parametro: any[] = [{ queryId: 57, mapValue: {
        param_id_persona: this.DATA_VACACIONES.id_vacaciones,
      }
    }];
    this.personalService.getHistoricoCambiosProyecto(parametro[0]).subscribe((resp: any) => {
      this.histCambiosProyecto = resp.list;
      // console.log('ListHistCambID', resp)
    });
    this.spinner.hide();
  }

  listSistemaVacaciones: any[] = [];
  getLstSistemaVacaciones(){
  let parametro: any[] = [{ queryId: 126}];
  this.vacacionesService.getLstSistemaVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listSistemaVacaciones = resp.list;
    // console.log('SISTEMA-ASIG_VAC', resp.list);
    })
  }

  listEstadoVacacionesAprobadas: any[] = [];
  getLstEstadoVacaciones(){
  let parametro: any[] = [{ queryId: 132}];
  this.vacacionesService.getLstEstadoVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listEstadoVacacionesAprobadas = resp.list;
    // console.log('VACAS-ESTADO', resp.list);
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

  asignarVacaciones(){
    const diasVacaciones = this.utilService.calcularDifDias(this.vacacionesForm.controls['fechaFinVac'].value, this.vacacionesForm.controls['fechaInicVac'].value);
    // console.log('FORMULARIO', this.vacacionesForm.value, this.calcularDifDias(this.vacacionesForm.controls['fechaFinVac'].value, this.vacacionesForm.controls['fechaInicVac'].value));

    const dialogRef = this.dialog.open(AsignarVacacionesComponent, { width:'35%', data: {vacForm: this.vacacionesForm.value, isCreation: true, diasVacaciones: diasVacaciones} });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarVacacionesAsignado()
      }
    })
  };


  actualizarVacaciones(DATA: any){
    console.log('DATA_VACACIONES', DATA);
    // const DATA = this.facturaForm.value
    const dialogRef = this.dialog.open(AsignarVacacionesComponent, { width:'35%', data: DATA});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarVacacionesAsignado()
      }
    })
  };
}
