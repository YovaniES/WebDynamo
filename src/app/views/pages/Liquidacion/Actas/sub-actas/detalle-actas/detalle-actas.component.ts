import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-detalle-actas',
  templateUrl: './detalle-actas.component.html',
  styleUrls: ['./detalle-actas.component.scss'],
})
export class DetalleActasComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  modecode = '';
  constructor( private fb: FormBuilder,
               private facturacionService: FacturacionService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<DetalleActasComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_DET_ACTAS: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllProyecto();
  this.getAllDetalle();

  if (this.DATA_DET_ACTAS) {
    this.cargarGestorById(this.DATA_DET_ACTAS);
  }
  }

  detalleactasForm!: FormGroup;
  newForm(){
    this.detalleactasForm = this.fb.group({
     analista   : ['',],
     observacion: ['',],
     idGestor   : ['',],
     importe    : ['',],
     categoria_1: ['',],
     cantidad   : ['',],
     precio     : ['',],
     perfil     : ['',],
     comentario : ['',],
     estado     : ['',],
    })
  }

  actionBtn: string = 'Crear';
  cargarGestorById(idGestor: number): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_DET_ACTAS) {
      this.actionBtn = 'Actualizar'
      this.facturacionService.getLiquidacionById(idGestor).subscribe((resp: any) => {
        this.blockUI.stop();
        console.log('DATA_BY_ID_GESTOR', resp);

        this.detalleactasForm.reset({
          proyecto     : resp.proyecto,
          subservicio  : resp.subservicio,
          gestor       : resp.gestor,
          importe      : resp.importe,
          fecha_periodo: resp.fecha_periodo,
          comentario   : resp.comentario,
        })
      })
    }
  }

  listGestores: any[] = [];
  getAllDetalle(){
    // this.blockUI.start('Cargando lista Gestores...');
    // const request: FiltroGestorModel = this.detalleactasForm.value;
    // this.liquidacionService.getAllGestor(request).subscribe((resp: any) => {
    //   this.blockUI.stop();

    //   this.listGestores = resp
    //   console.log('LIST-GESTOR', this.listGestores);
    // })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY', this.listProyectos);
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
    if (this.detalleactasForm.get(campo)?.invalid && this.detalleactasForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

}

