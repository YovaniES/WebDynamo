import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FiltroGestorModel } from 'src/app/core/models/liquidacion.models';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-modal-acta',
  templateUrl: './modal-acta.component.html',
  styleUrls: ['./modal-acta.component.scss'],
})
export class ModalActaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalActas: number = 0;
  pageSize = 10;

  modecode = '';
  constructor( private fb: FormBuilder,
               private facturacionService: FacturacionService,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               public dialogRef: MatDialogRef<ModalActaComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_ACTAS: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllProyecto();
  this.getAllGestor();
  this.getAllSubservicios();

  if (this.DATA_ACTAS) {
    this.cargarGestorById(this.DATA_ACTAS);
  }
  }

  actasForm!: FormGroup;
  newForm(){
    this.actasForm = this.fb.group({
     proyecto     : ['',],
     subservicio  : ['',],
     idGestor     : ['',],
     importe      : ['',],
     fecha_periodo: ['',],
     comentario   : ['',],
     estado       : ['',],
    })
  }

  actionBtn: string = 'Crear';
  cargarGestorById(idGestor: number): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_ACTAS) {
      this.actionBtn = 'Actualizar'
      this.facturacionService.getLiquidacionById(idGestor).subscribe((resp: any) => {
        this.blockUI.stop();
        console.log('DATA_BY_ID_GESTOR', resp);

        this.actasForm.reset({
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
  getAllGestor(){
    this.blockUI.start('Cargando lista Gestores...');
    const request: FiltroGestorModel = this.actasForm.value;
    this.liquidacionService.getAllGestor(request).subscribe((resp: any) => {
      this.blockUI.stop();

      this.listGestores = resp
      console.log('LIST-GESTOR', this.listGestores);
    })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY', this.listProyectos);
    })
  }

  listSubservicios:any[] = [];
  getAllSubservicios(){
    const request = {
      idGestor     : '',
      idProyecto   : '',
      idSubservicio: this.actasForm.controls['subservicio'].value,
    }

    this.liquidacionService.getAllSubservicios(request).subscribe( (resp: any) => {
      this.listSubservicios = resp.result;
      console.log('SUBS', this.listSubservicios);
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
    if (this.actasForm.get(campo)?.invalid && this.actasForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalActas) {
      this.facturacionService.cargarOBuscarLiquidacion(offset.toString()).subscribe( (resp: any) => {
            this.listGestores = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }
}

