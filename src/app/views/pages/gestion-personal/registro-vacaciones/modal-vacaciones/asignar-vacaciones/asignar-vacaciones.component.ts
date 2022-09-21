import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilService } from 'src/app/core/services/util.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-vacaciones',
  templateUrl: './asignar-vacaciones.component.html',
  styleUrls: ['./asignar-vacaciones.component.scss']
})
export class AsignarVacacionesComponent implements OnInit {

  asigVacacionesForm!: FormGroup;

  constructor(
    private vacacionesService: VacacionesPersonalService,
    private authService: AuthService,
    private utilService: UtilService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<AsignarVacacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_VACAC: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.cargarVacacionesByID();
    this.getListEstadoVacaciones();
    this.getListMotivosVacaciones();
    this.getListSistemaVacaciones();
    console.log('DATA_VACAC_PERIODO', this.DATA_VACAC, this.DATA_VACAC.vdForm);
    // console.log('ID_PERS_VACAC', this.DATA_VACAC.vacForm.idPersonal); //idPersonal= 496
  }

  newForm(){
    this.asigVacacionesForm = this.fb.group({
      fechaInicio   : ['', [Validators.required]],
      fechaFin      : ['', [Validators.required]],
      id_estado     : ['', [Validators.required]],
      id_motivo     : ['', [Validators.required]],
      dias_periodo  : [''],
      observaciones : [''],
    })
   }

   agregarOactualizarPlanificacionVacaciones(){
    if (!this.DATA_VACAC) {return}

    if (this.DATA_VACAC.isCreation) {
      if (this.asigVacacionesForm.valid) { this.agregarPeriodoVacaciones()}
    } else {
      this.actualizarPlanificacionVacaciones();
    }
   }

   agregarPeriodoVacaciones() {
    this.spinner.show();
    const formValues = this.asigVacacionesForm.getRawValue();

    let parametro: any =  {queryId: 129, mapValue: {
          p_id_vacaciones        : this.DATA_VACAC.vacForm.idVacaciones.id_vacaciones,
          p_id_persona           : this.DATA_VACAC.vacForm.idVacaciones.id_persona ,
          p_fecha_vac_ini        : moment.utc(formValues.fechaInicio).format('YYYY-MM-DD'),
          p_fecha_vac_fin        : moment.utc(formValues.fechaFin).format('YYYY-MM-DD'),
          p_id_vac_estado        : formValues.id_estado ,
          p_id_vac_motivo        : formValues.id_motivo ,
          p_observacion          : formValues.observaciones ,
          p_id_usuario_asignacion: this.userID ,
          p_fecha_vac_creacion   : '' ,
          p_id_sist_vac          : this.DATA_VACAC.vacForm.idVacaciones.id_sist_vac,
          CONFIG_USER_ID         : this.userID ,
          CONFIG_OUT_MSG_ERROR   : '' ,
          CONFIG_OUT_MSG_EXITO   : ''
        },
      };
     console.log('VAOR_VACA', this.asigVacacionesForm.value , parametro);
    this.vacacionesService.agregarPeriodoVacaciones(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Agregar vacaciones!',
        text : `La vacación fue planificado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  actualizarPlanificacionVacaciones() {
    this.spinner.show();

    const formValues = this.asigVacacionesForm.getRawValue();
    let parametro: any[] = [{ queryId: 131,
        mapValue: {
          p_idPeriodoVac         : this.DATA_VACAC.id_periodo,
          p_id_vacaciones        : this.DATA_VACAC.id_vacaciones ,
          p_id_persona           : this.DATA_VACAC.id_persona ,
          p_fecha_vac_ini        : moment.utc(formValues.fechaInicio).format('YYYY-MM-DD'),
          p_fecha_vac_fin        : moment.utc(formValues.fechaFin).format('YYYY-MM-DD'),
          p_id_vac_estado        : formValues.id_estado ,
          p_id_vac_motivo        : formValues.id_motivo ,
          p_observacion          : formValues.observaciones ,
          p_id_usuario_asignacion: this.userID ,
          p_fecha_vac_creacion   : '' ,
          p_id_sist_vac          : this.DATA_VACAC.id_sist,
          CONFIG_USER_ID         : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: ''
        },
      }];
     this.vacacionesService.actualizarPlanificacionVacaciones(parametro[0]).subscribe({next: (res) => {
        this.spinner.hide();

        this.close(true)
          Swal.fire({
            title: 'Actualizar periodo!',
            text : `El Periodo: ${this.DATA_VACAC.id_periodo}, se actualizó con éxito`,
            icon : 'success',
            confirmButtonText: 'Ok'
            });

          this.asigVacacionesForm.reset();
          this.dialogRef.close('Actualizar');
        }, error:()=>{
          Swal.fire(
            'ERROR',
            'No se pudo actualizar el periodo',
            'warning'
          );
        }
     });
  }

  totalDiasPlanificado(){
    const fechaIni = moment.utc(this.asigVacacionesForm.controls['fechaInicio'].value).format('YYYY-MM-DD')
    const fechaFin = moment.utc(this.asigVacacionesForm.controls['fechaFin'   ].value).format('YYYY-MM-DD')

    if (fechaIni && fechaFin) {
      const numDias = this.utilService.calcularDifDias( fechaFin, fechaIni)

      this.asigVacacionesForm.controls['dias_periodo'].setValue(numDias)
      console.log('DIAS_PARAM', numDias);
    }
  }

  titleBtn: string = 'Agregar';
  cargarVacacionesByID(){
    if (!this.DATA_VACAC.isCreation) {
      this.titleBtn = 'Actualizar'
      this.asigVacacionesForm.controls['id_motivo'    ].setValue(this.DATA_VACAC.id_vac_motivo);
      this.asigVacacionesForm.controls['id_estado'    ].setValue(this.DATA_VACAC.id_vac_estado);
      this.asigVacacionesForm.controls['observaciones'].setValue(this.DATA_VACAC.observacion);
      this.asigVacacionesForm.controls['dias_periodo' ].setValue(this.DATA_VACAC.cant_dias_periodo);


      if (this.DATA_VACAC.fecha_inicio !='null' && this.DATA_VACAC.fecha_inicio != '') {
          let fecha_x = this.DATA_VACAC.fecha_inicio
          const str   = fecha_x.split('/');
          const year  = Number(str[2]);
          const month = Number(str[1]);
          const date  = Number(str[0]);
          this.asigVacacionesForm.controls['fechaInicio'].setValue(this.datePipe.transform(new Date(year, month-1, date+1), 'yyyy-MM-dd'))
      }

      if (this.DATA_VACAC.fecha_fin !='null' && this.DATA_VACAC.fecha_fin != '') {
        let fecha_x = this.DATA_VACAC.fecha_fin
        const str   = fecha_x.split('/');
        const year  = Number(str[2]);
        const month = Number(str[1]);
        const date  = Number(str[0]);
        this.asigVacacionesForm.controls['fechaFin'].setValue(this.datePipe.transform(new Date(year, month-1, date+1), 'yyyy-MM-dd'))
      }
    }
  }

  listSistemaVacaciones: any[] = [];
  getListSistemaVacaciones(){
  let parametro: any[] = [{ queryId: 126}];
  this.vacacionesService.getListSistemaVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listSistemaVacaciones = resp.list;
    // console.log('SISTEMA-ASIG_VAC', resp.list);
    })
  }

  listVacacionesEstado: any[] = [];
  getListEstadoVacaciones(){
  let parametro: any[] = [{ queryId: 124}];
  this.vacacionesService.getListEstadoVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listVacacionesEstado = resp.list;
    // console.log('VACAS-ESTADO', resp.list);
    })
  }

  listVacacionesMotivo: any[] = [];
  getListMotivosVacaciones(){
  let parametro: any[] = [{ queryId: 125}];
  this.vacacionesService.getListMotivosVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listVacacionesMotivo = resp.list;
    // console.log('VACAS-MOTIVO', resp.list);
    })
  }

   userID: number = 0;
   getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      console.log('ID-USER', this.userID);
    })
   }

  campoNoValido(campo: string): boolean {
    if (this.asigVacacionesForm.get(campo)?.invalid && this.asigVacacionesForm.get(campo)?.touched) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
