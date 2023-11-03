import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-modal-proyecto',
  templateUrl: './modal-proyecto.component.html',
  styleUrls: ['./modal-proyecto.component.scss'],
})
export class ModalProyectoComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  modecode = '';
  constructor( private fb: FormBuilder,
               private liquidacionService: LiquidacionService,
               private authService: AuthService,
               public dialogRef: MatDialogRef<ModalProyectoComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_PROY: any
  ) {}

  ngOnInit(): void {
  this.newForm();
  this.getUserID();
  this.getAllProyecto();
  this.getAllLideres();
  this.getAllGestor();
  this.getAllJefaturas()

  if (this.DATA_PROY) {
    this.cargarProyectoById();
    console.log('MODAL-PROY', this.DATA_PROY);
    }
  }

  proyectoForm!: FormGroup;
  newForm(){
    this.proyectoForm = this.fb.group({
     jefatura      : ['', Validators.required],
     lider         : ['', Validators.required],
     proyecto      : ['', Validators.required],
     fecha_creacion: [''],
     fecha_ini     : [''],
     fecha_fin     : [''],
     cod_jira      : [''],
     id_estado     : [''],
     descripcion   : ['']
    })
  }

  crearOactualizarProyecto(){
    if (this.proyectoForm.invalid) {
      return Object.values(this.proyectoForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_PROY ) {
        console.log('UPD_PROY');
        this.actualizarProyecto();
    } else {
      console.log('CREAR_PROY');
      this.crearProyecto()
    }
  }

  crearProyecto(): void{
    const formValues = this.proyectoForm.getRawValue();

    const request = {
      idLider           : formValues.lider,
      codigo_proyecto   : formValues.proyecto,
      codigo_jira       : formValues.cod_jira,
      descripcion       : formValues.descripcion,
      reemplaza_a       : '',
      detalle_adicional : '',
      nombre_descriptivo: '',
      tipo              : '',
      fecha_inicio      : formValues.fecha_ini,
      fecha_fin         : formValues.fecha_fin,
      idCliente         : 10, // falta validar cliente
      idJefatura        : formValues.jefatura,
      idUsuarioCreacion : this.userID,
    }

    this.liquidacionService.crearProyecto(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear proyecto!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        this.close(true);
        this.getAllProyecto();
      }
    })
  }

  actualizarProyecto(){
    const formValues = this.proyectoForm.getRawValue();

    const requestProyecto = {
      idLider           : formValues.lider,
      codigo_proyecto   : formValues.proyecto,
      codigo_jira       : formValues.cod_jira,
      descripcion       : formValues.descripcion,
      reemplaza_a       : formValues.reemplaza_a,
      detalle_adicional : formValues.detalle_adicional,
      nombre_descriptivo: formValues.nombre_descriptivo,
      tipo              : formValues.tipo,
      fecha_inicio      : formValues.fecha_ini,
      fecha_fin         : formValues.fecha_fin,
      idCliente         : formValues.cliente,
      idJefatura        : formValues.jefatura,
      idUsuarioActualiza: this.userID,
      eliminacion_logica: formValues.id_estado,
    }
    this.liquidacionService.actualizarProyecto(this.DATA_PROY.idProyecto, requestProyecto).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar proyecto!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
          this.close(true);
      }
    })
  }

  actionBtn: string = 'Crear';
  cargarProyectoById(): void{
    this.blockUI.start("Cargando proyecto...");
    if (this.DATA_PROY) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getProyectoById(this.DATA_PROY.idProyecto).subscribe((proy: any) => {
        console.log('DATA_BY_ID_PROY', proy);
        this.blockUI.stop();

        this.proyectoForm.reset({
          jefatura      : proy.jefaturas.idJefatura,
          lider         : proy.lideres.idLider,
          proyecto      : proy.codigo_proyecto,
          fecha_creacion: moment.utc(proy.fechaCreacion).format('YYYY-MM-DD'),
          fecha_ini     : moment.utc(proy.fecha_inicio).format('YYYY-MM-DD'),
          fecha_fin     : moment.utc(proy.fecha_fin).format('YYYY-MM-DD'),
          cod_jira      : proy.codigo_jira,
          id_estado     : proy.eliminacion_logica,
          descripcion   : proy.descripcion,
        })
      })
    }
  }


  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     console.log('ID-USER', this.userID);
   })
  }

  listGestores: any[] = [];
  getAllGestor(){
    this.liquidacionService.getAllGestor().subscribe( (resp: any) => {
      this.listGestores = resp
      // console.log('LIST-GESTOR', this.listGestores);
    })
  }

  listLideres: any[] = [];
  getAllLideres(){
    this.liquidacionService.getAllLideres().subscribe( (resp: any) => {
      this.listLideres = resp
      console.log('LIST-LIDER', this.listLideres);
    })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY-S', this.listProyectos);
    })
  }

  listJefaturas: any[] = [];
  getAllJefaturas(){
    this.liquidacionService.getAllJefaturas().subscribe(resp => {
      this.listJefaturas = resp;
      console.log('LIST-JEFATURAS', this.listJefaturas);
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
    if (this.proyectoForm.get(campo)?.invalid && this.proyectoForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

}

