import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ModalGestorComponent } from './modal-gestor/modal-gestor.component';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { FiltroGestorModel } from 'src/app/core/models/liquidacion.models';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-lista-gestor',
  templateUrl: './lista-gestor.component.html',
  styleUrls: ['./lista-gestor.component.scss'],
})
export class ListaGestorComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  page = 1;
  totalGestor: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaGestorComponent>,
  ) {}

  ngOnInit(): void {
    this.newForm();
    this.getAllGestorFiltro();
    this.getAllProyecto();
    this.getAllSubserviciosCombo();
    this.getAllGestorCombo()
  }

  gestorForm!: FormGroup;
  newForm(){
    this.gestorForm = this.fb.group({
    idGestor   : [''],
    subservicio: [''],
    proyecto   : [''],
    estado     : [''],
    })
  }

  eliminarGestor(gestor: any,){
    console.log('DEL_GESTOR', gestor);

    Swal.fire({
      title:'¿Eliminar gestor?',
      text: `¿Estas seguro que deseas eliminar el gestor: ${gestor.nombres}  ${gestor.apellidos}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.eliminarGestor(gestor.idGestor).subscribe(resp => {

          Swal.fire({
            title: 'Eliminar gestor',
            text: `${gestor.nombres}  ${gestor.apellidos}: ${resp.message} exitosamente`,
            icon: 'success',
          });
          this.getAllGestorFiltro()
        });
      };
    });
  };

  listGestores: any[] = [];
  getAllGestorFiltro(){
    this.blockUI.start('Cargando lista Gestores...');
    const request: FiltroGestorModel = this.gestorForm.value;

    this.liquidacionService.getAllGestorFiltro(request).subscribe((resp: any) => {
      this.blockUI.stop();

      this.listGestores = resp
      console.log('LIST-GESTOR', this.listGestores);
    })
  };

  listGestorCombo: any[] = [];
  getAllGestorCombo(){
    this.blockUI.start('Cargando lista Gestores...');
    this.liquidacionService.getAllGestorCombo().subscribe((resp: any) => {
      this.blockUI.stop();

      this.listGestorCombo = resp
      // console.log('LIST-GESTOR-COMBO', this.listGestorCombo);
    })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectos = resp;
      // console.log('PROY', this.listProyectos);
    })
  }

  listSubservicios:any[] = [];
  getAllSubserviciosCombo(){
    this.liquidacionService.getAllSubserviciosCombo().subscribe( (resp: any) => {
      this.listSubservicios = resp;
      // console.log('SUBS_COMBO', this.listSubservicios);
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
    if (this.gestorForm.get(campo)?.invalid && this.gestorForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalGestor) {
      this.liquidacionService.getAllGestorFiltro(offset.toString()).subscribe( (resp: any) => {
            this.listGestores = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  limpiarFiltro() {
    this.gestorForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllGestorFiltro();
  }

  abrirModalCrearOactualizar(DATA?: any) {
    // console.log('DATA_G', DATA);
    this.dialog
      .open(ModalGestorComponent, { width: '45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllGestorFiltro();
        }
      });
  }

}

