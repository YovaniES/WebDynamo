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
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.scss'],
})
export class ModalClienteComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<ModalClienteComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_CLIENTE: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getUserID();
  // this.getAllProyectoCombo();

  if (this.DATA_CLIENTE) {
    this.cargarClienteById();
    console.log('CLIENTE_MODAL', this.DATA_CLIENTE);
  }
  }

  clienteForm!: FormGroup;
  newForm(){
    this.clienteForm = this.fb.group({
     razon_social  : ['', Validators.required],
     ruc           : ['', Validators.required],
     estado        : [''],
     fecha_creacion: ['']
    })
  }

  actionBtn: string = 'Crear';
  cargarClienteById(): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_CLIENTE) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getClienteById(this.DATA_CLIENTE.idCliente).subscribe((cliente: any) => {

        this.blockUI.stop();
        this.clienteForm.reset({
          razon_social  : cliente.razon_social,
          ruc           : cliente.ruc,
          estado        : cliente.estado.estadoId,
          fecha_creacion: cliente.fecha_creacion,
          // fecha_creacion: moment.utc(cliente.fecha_creacion).format('DD-MM-YYYY'),
        })
        this.clienteForm.controls['fecha_creacion'].disable();
      })
    }
  }

  crearOactualizarCliente(){
    if (this.clienteForm.invalid) {
      return Object.values(this.clienteForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_CLIENTE ) {
        this.actualizarCliente();
    } else {
      this.crearCliente()
    }
  }

  actualizarCliente(){
    const formValues = this.clienteForm.getRawValue();

    const requestLider = {
      // idCliente         : this.DATA_CLIENTE.idCliente,
      razon_social      : formValues.razon_social,
      ruc               : formValues.ruc,
      idUsuarioActualiza: this.userID,
      isActive          : formValues.estado,
    }

    this.liquidacionService.actualizarCliente(this.DATA_CLIENTE.idCliente, requestLider).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar cliente!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
          this.close(true);
      }
    })
  }

  crearCliente(): void{
    const formValues = this.clienteForm.getRawValue();

    const request = {
      razon_social     : formValues.razon_social,
      ruc              : formValues.ruc,
      idUsuarioCreacion: this.userID
    }

    this.liquidacionService.crearCliente(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear cliente!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })

        this.close(true);
      }
    })
  }

  // listProyectosCombo: any[] = [];
  // getAllProyectoCombo(){
  //   this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
  //     this.listProyectosCombo = resp;
  //     console.log('PROY-S', this.listProyectosCombo);
  //   })
  // }

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     console.log('ID-USER', this.userID);
   })
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }


  showAlertError(message: string) {
    Swal.fire({
      title: 'Error',
      icon : 'error',
      text : message,
    });
  }

  campoNoValido(campo: string): boolean {
    if (this.clienteForm.get(campo)?.invalid && this.clienteForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

}

