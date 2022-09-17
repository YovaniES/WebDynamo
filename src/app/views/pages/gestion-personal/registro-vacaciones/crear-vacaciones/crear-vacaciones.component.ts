import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import Swal from 'sweetalert2';
import { AsignarPersonalComponent } from '../modal-vacaciones/asignar-personal/asignar-personal.component';

@Component({
  selector: 'app-crear-vacaciones',
  templateUrl: './crear-vacaciones.component.html',
  styleUrls: ['./crear-vacaciones.component.scss']
})
export class CrearVacacionesComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  vacacionesForm!: FormGroup;

  constructor(
    private vacacionesService: VacacionesPersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CrearVacacionesComponent>,
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUsuario();
    this.getLstEstadoVacaciones();
    this.getLstSistemaVacaciones();
  }

    newForm(){
      this.vacacionesForm = this.fb.group({
       idPersonal    : [''],

       codCorp       : [''],
       nombre        : ['', [Validators.required]],
       apPaterno     : [''],
       apMaterno     : [''],
       proyecto      : [''],
       fecha_ingreso : [''],
       fechaInicVac  : [''],
       fechaFinVac   : [''],
       id_estado_vac : [''],
       idSistema     : ['', [Validators.required]],
      })
     }

  crearVacaciones() {
  this.spinner.show();
    const formValues = this.vacacionesForm.getRawValue();
    let parametro: any =  {
    queryId: 137,
    mapValue: {
       p_id_persona        : this.id_persona,
       p_id_sist_vac       : formValues.idSistema,
       p_fecha_ini_vac     : formValues.fechaInicVac,
       p_fecha_fin_vac     : formValues.fechaFinVac,
       p_id_estado_vac     : formValues.id_estado_vac,
       p_id_responsable    : this.userID,
      //  p_id_responsable    : this.userLogeado,
       p_fecha_crea_vac    : '',
       CONFIG_USER_ID      : this.userID,
       CONFIG_OUT_MSG_ERROR: "",
       CONFIG_OUT_MSG_EXITO: "",
  },
  };
  console.log('VAOR_VACACIONES', this.vacacionesForm.value , parametro);
  this.vacacionesService.crearVacaciones(parametro).subscribe((resp: any) => {
    Swal.fire({
      title: 'Crear vacaciones!',
      text: `Vacaciones: ??? , creado con éxito`,
      icon: 'success',
      confirmButtonText: 'Ok',
      });
      this.close(true);
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
    console.log('VACAS-ESTADO', resp.list);
    })
  }

  userID: number = 0;
  userLogeado: string = '';
  getUsuario(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   =  resp.user.userId;
    //  this.userID   = resp,  resp.user.userId;
     this.userLogeado = `${resp.user.nombres} ${resp.user.apellidoPaterno}`
     console.log('USER_lOGEADO', this.userID, this.userLogeado);
     console.log('USER_ID_LOG', this.userID);
   })
  };

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

  asignarDatosPerona(persona: any){
    console.log('DATA_ASIG_PERS',persona);

    this.vacacionesForm.controls['idPersonal'   ].setValue(persona.id)
    this.vacacionesForm.controls['codCorp'      ].setValue(persona.codigo_corporativo)
    this.vacacionesForm.controls['apPaterno'    ].setValue(persona.apellido_paterno)
    this.vacacionesForm.controls['apMaterno'    ].setValue(persona.apellido_materno)
    this.vacacionesForm.controls['nombre'       ].setValue(persona.nombres)
    this.vacacionesForm.controls['proyecto'     ].setValue(persona.codigo_proyecto)
    this.vacacionesForm.controls['idPersonal'   ].setValue(persona.id)
    this.vacacionesForm.controls['fecha_ingreso'].setValue(persona.fecha_ingreso)
  }

  campoNoValido(campo: string): boolean {
    if ( this.vacacionesForm.get(campo)?.invalid && (this.vacacionesForm.get(campo)?.dirty || this.vacacionesForm.get(campo)?.touched) ) {
      return true;
    } else {
      return false;
    }
  }

  id_persona: number = 0;
  asignarPersonal(){

    const dialogRef = this.dialog.open(AsignarPersonalComponent, { width:'35%', data: {vacForm: this.vacacionesForm.value, isCreation: true} });

    dialogRef.afterClosed().subscribe(resp => {
      console.log('PERS', resp);

      if (resp) {
        this.id_persona = resp.id;
        console.log('ID_P', this.id_persona);

        this.asignarDatosPerona(resp);
      }
    })
  };

}
