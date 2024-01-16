import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-subservicio',
  templateUrl: './modal-subservicio.component.html',
  styleUrls: ['./modal-subservicio.component.scss'],
})
export class ModalSubservicioComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private liquidacionService: LiquidacionService,
               private authService: AuthService,
               public dialogRef: MatDialogRef<ModalSubservicioComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_SUBSERV: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllProyecto();
  this.getUserID();
  this.getAllGestoresCombo();

  if (this.DATA_SUBSERV) {
    this.cargarSubservicioById();
    // console.log('MODAL-SUBSERV', this.DATA_SUBSERV);
    }
  }

  subservicioForm!: FormGroup;
  newForm(){
    this.subservicioForm = this.fb.group({
     subservicio   : ['', Validators.required],
     representante : [''],
     proyecto      : ['', Validators.required],
     fecha_creacion: [''],
     fecha_ini     : [''],
     fecha_fin     : [''],
     id_estado     : ['']
    })
  }

  crearOactualizarSubservicio(){
    if (this.subservicioForm.invalid) {
      return Object.values(this.subservicioForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_SUBSERV ) {
        console.log('UPD_SUBS');
        this.actualizarSubservicio();
    } else {
      console.log('CREAR_SUBS');
      this.crearSubservicio()
    }
  }

  crearSubservicio(): void{
    const formValues = this.subservicioForm.getRawValue();

    const request = {
      idProyecto      : formValues.proyecto,
      nombre          : formValues.subservicio,
      idRepresentante : formValues.representante,
      idUsuarioCrea   : this.userID,
      fechaInicio     : formValues.fecha_ini,
      fechaFin        : formValues.fecha_fin,
    }

    this.liquidacionService.crearSubservicio(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear subservicio!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        this.close(true);
      }
    })
  }

  actualizarSubservicio(){
    const formValues = this.subservicioForm.getRawValue();

    const requestSubservicio = {
      idProyecto        : formValues.proyecto,
      nombre            : formValues.subservicio,
      representante     : formValues.representante,
      idUsuarioActualiza: this.userID,
      fechaInicio       : formValues.fecha_ini,
      fechaFin          : formValues.fecha_fin,
      isActive          : formValues.id_estado
    }
    this.liquidacionService.actualizarSubservicio(this.DATA_SUBSERV.idSubservicio, requestSubservicio).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar subservicio!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
          this.close(true);
      }else{
        Swal.fire({
          title: 'Error!',
          text : `${resp.message}`,
          icon : 'warning',
          confirmButtonText: 'Ok',
        });
      }
    })
  }

  actionBtn: string = 'Crear';
  cargarSubservicioById(): void{
    this.blockUI.start("Cargando Subservicio...");
    if (this.DATA_SUBSERV) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getSubserviciosById(this.DATA_SUBSERV.idSubservicio).subscribe((subserv: any) => {
        console.log('DATA_BY_ID_SUBSERV', subserv);
        this.blockUI.stop();

        this.subservicioForm.reset({
          subservicio   : subserv.subservicio,
          representante : subserv.representante,
          fecha_ini     : subserv.fechaInicio,
          fecha_creacion: moment.utc(subserv.fechaCreacion).format('YYYY-MM-DD'),
          fecha_fin     : subserv.fechaFin,
          proyecto      : subserv.idProyecto,
          id_estado     : subserv.estado.estadoId,
        })
        this.subservicioForm.controls['fecha_creacion'].disable();
      })
    }
  }

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
    //  console.log('ID-USER', this.userID);
   })
  }

  listGestorCombo: any[] = [];
  getAllGestoresCombo(){
    this.liquidacionService.getAllGestorCombo().subscribe(resp => {
      this.listGestorCombo = resp;
      console.log('GESTOR_COMBO', this.listGestorCombo);
    })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY-S', this.listProyectos);
    })
  }

  showAlertError(message: string) {
    Swal.fire({
      title: 'Error',
      icon : 'error',
      text : message,
    });
  }

  campoNoValido(campo: string): boolean {
    if (this.subservicioForm.get(campo)?.invalid && this.subservicioForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

}

