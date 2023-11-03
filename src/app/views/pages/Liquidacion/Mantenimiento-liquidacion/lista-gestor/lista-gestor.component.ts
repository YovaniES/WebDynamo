import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import Swal from 'sweetalert2';
import { ModalGestorComponent } from './modal-gestor/modal-gestor.component';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';

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
               private facturacionService: FacturacionService,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaGestorComponent>,
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllGestor();
  this.getAllProyecto();
  this.getAllSubservicios();
  }

  gestorForm!: FormGroup;
  newForm(){
    this.gestorForm = this.fb.group({
     nombre_apell: [''],
     subservicios: [''],
     proyectos   : ['']
    })
  }

  listGestores: any[] = [];
  getAllGestor(){
    this.liquidacionService.getAllGestor().subscribe((resp: any) => {
      this.listGestores = resp
      console.log('LIST-GESTOR', this.listGestores);
    })
  }

  eliminarGestor(gestor: any,){
    console.log('DEL_GESTOR', gestor);

    Swal.fire({
      title:'¿Eliminar gestor?',
      text: `¿Estas seguro que deseas eliminar el gestor: ${gestor.nombresApellidos}?`,
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
            title: 'Eliminar líder',
            text: `${gestor.gestor}: ${resp.message} exitosamente`,
            icon: 'success',
          });
          this.getAllGestor()
        });
      };
    });
  };

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY', this.listProyectos);
    })
  }

  listSubservicios:any[] = [];
  getAllSubservicios(){
    this.liquidacionService.getAllSubservicio().subscribe( resp => {
      this.listSubservicios = resp;
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
      this.facturacionService.cargarOBuscarLiquidacion(offset.toString()).subscribe( (resp: any) => {
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

    this.getAllGestor();
  }

  abrirModalCrearOactualizar(DATA?: any) {
    // console.log('DATA_G', DATA);
    this.dialog
      .open(ModalGestorComponent, { width: '45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllGestor();
        }
      });
  }

}

