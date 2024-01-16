import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActasService } from 'src/app/core/services/actas.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-gestor-subservicio',
  templateUrl: './modal-gestor-subservicio.component.html',
  styleUrls: ['./modal-gestor-subservicio.component.scss'],
})

export class ModalGestorSubservicioComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private actasService: ActasService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<ModalGestorSubservicioComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_GESTOR_SUB: any)
            {};

  ngOnInit(): void {
    this.newForm()
    this.getUserID();
    this.getAllProyecto();
    this.getListGestorCombo();
    this.cargarDataGestor();
    console.log('DATA_GESTOR_SUB', this.DATA_GESTOR_SUB);

    if (this.DATA_GESTOR_SUB.idProyectoSubservicioGestor > 0) {
      this.cargarGestorSubservicioById();
      }
    };

  gestorSubservicioForm!: FormGroup;
  newForm(){
    this.gestorSubservicioForm = this.fb.group({
     idSubservicio : ['', Validators.required],
     idGestor      : ['', Validators.required],
     idProyecto    : ['', Validators.required],
     fecha_creacion: [''],
    })
  };

  crearOactualizarDetalleCertificacion(){
    if (this.gestorSubservicioForm.invalid) {
      return Object.values(this.gestorSubservicioForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    if (this.DATA_GESTOR_SUB.idProyectoSubservicioGestor > 0) {
      console.log('UPDATE');
      this.actualizarGestorSubservicio();
    } else {
      console.log('CREATE');
      this.crearGestorSubservicio();
    }
  };

  actualizarGestorSubservicio(){
    const formValues = this.gestorSubservicioForm.getRawValue();

    const requestCert = {

      idGestorSubservicio: this.DATA_GESTOR_SUB.idProyectoSubservicioGestor,
      idGestor           : formValues.idGestor,
      idProyecto         : formValues.idProyecto,
      idSubservicio      : formValues.idSubservicio,
      idUsuarioActualiza : this.userID
    }
    this.actasService.actualizarGestorSubservicio(this.DATA_GESTOR_SUB.idProyectoSubservicioGestor, requestCert ).subscribe((resp: any) => {
      if (resp.success) {
        Swal.fire({
          title: 'Actualizar gestor subservicio!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      }
    })
  };

  crearGestorSubservicio(){
    const formValues = this.gestorSubservicioForm.getRawValue();
    const request = {
      idGestor      : formValues.idGestor,
      idProyecto    : formValues.idProyecto,
      idSubservicio : formValues.idSubservicio,
      idUsuarioCrea : this.userID
    };
    this.actasService.crearGestorSubservicio(request).subscribe((resp:any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear gestor subservicio!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.close(true);
      }
    })
  };

  actionBtn: string = 'Asociar'
  cargarGestorSubservicioById(): void {
    this.blockUI.start('Cargando data ...');

    if (this.DATA_GESTOR_SUB.idProyectoSubservicioGestor > 0) {
      this.actionBtn = 'Actualizar'
      this.actasService.cargarGestorSubservicioById(this.DATA_GESTOR_SUB.idProyectoSubservicioGestor).subscribe((gestor:any) => {
        this.blockUI.stop();

        console.log('RESP_GESTOR_SUBSERV', gestor, );

        this.gestorSubservicioForm.reset({
          idGestor      : gestor.idGestor,
          idSubservicio : gestor.idSubservicio,
          idProyecto    : gestor.idProyecto,
          // fecha_creacion: moment.utc(gestor.fecha_creacion).format('YYYY-MM-DD'),
        })
        this.gestorSubservicioForm.controls['fecha_creacion'].disable();
        this.gestorSubservicioForm.controls['idGestor'      ].disable();
      })
    }
  };


  cargarDataGestor(){
    this.gestorSubservicioForm.reset({
      idGestor      : this.DATA_GESTOR_SUB.idGestor,
      // idSubservicio : gestor.idSubservicio,
      // idProyecto    : gestor.idProyecto,
    })
  }

  // listSubserviciosCombo:any[] = [];
  // getAllSubserviciosCombo(){
  //   this.liquidacionService.getAllSubserviciosCombo().subscribe( (resp: any) => {
  //     this.listSubserviciosCombo = resp;
  //     console.log('SUBSERV', this.listSubserviciosCombo);
  //   })
  // };

  listSubserviciosFiltroByProy:any[] = [];
  getAllSubserviciosFiltroByProy(){
    this.listSubserviciosFiltroByProy = [];

    const idProy = this.gestorSubservicioForm.controls['idProyecto'].value;
    // console.log('ID_PROY', idProy, this.gestorSubservicioForm.controls['idProyecto'].value);
    const request = {
      idProyecto: this.gestorSubservicioForm.controls['idProyecto'].value
    }
    this.liquidacionService.getAllSubserviciosFiltroByProy(request).subscribe((resp: any) => {
      this.listSubserviciosFiltroByProy = resp;
      console.log('SUBSERV_BY_PROY==>', this.listSubserviciosFiltroByProy);
    })
  };


  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY', this.listProyectos);
    console.log('ID_PROY',  this.gestorSubservicioForm.controls['idProyecto'].value);

      // this.getAllSubserviciosFiltroByProy();
    })
  }

  listGestoresCombo: any[] = [];
  getListGestorCombo(){
    this.liquidacionService.getAllGestorCombo().subscribe((resp: any) => {
      this.listGestoresCombo = resp;
    })
  };

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
    //  console.log('ID-USER', this.userID);
   })
  };

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  };

  showAlertError(message: string) {
    Swal.fire({
      title: 'Error',
      icon : 'error',
      text : message,
    });
  };

  campoNoValido(campo: string): boolean {
    if (this.gestorSubservicioForm.get(campo)?.invalid && this.gestorSubservicioForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  };

}

