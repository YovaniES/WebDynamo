import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { ModalEstadosComponent } from './modal-estados/modal-estados.component';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-lista-estados',
  templateUrl: './lista-estados.component.html',
  styleUrls: ['./lista-estados.component.scss'],
})
export class ListaEstadosComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalEstados: number = 0;
  pageSize = 5;

  constructor( private fb: FormBuilder,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaEstadosComponent>,
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllEstados();
  }

  estadosForm!: FormGroup;
  newForm(){
    this.estadosForm = this.fb.group({
     jefatura: [''],
     estado  : [''],
    })
  }

  listEstados: any[] = [];
  getAllEstados(){
    this.liquidacionService.getAllEstados().subscribe((resp: any) => {
      this.listEstados = resp
      console.log('LIST-JEFAT', this.listEstados);
    })
  }

  eliminarEstado(estado: any,){
    console.log('DEL_JEFAT', estado);

    Swal.fire({
      title:'¿Eliminar estado?',
      text: `¿Estas seguro que deseas eliminar la estado: ${estado.estado}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.eliminarEstado(estado.idJefatura).subscribe(resp => {

          Swal.fire({
            title: 'Eliminar estado',
            text: `${estado.estado}: ${resp.message} exitosamente`,
            icon: 'success',
          });
          this.getAllEstados()
        });
      };
    });
  };

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
    if (this.estadosForm.get(campo)?.invalid && this.estadosForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalEstados) {
      this.liquidacionService.getAllEstados().subscribe( (resp: any) => {
            this.listEstados = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  limpiarFiltro() {
    this.estadosForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllEstados();
  }

  abrirModalCrearOactualizar(DATA?: any) {
    // console.log('DATA_G', DATA);
    this.dialog
      .open(ModalEstadosComponent, { width: '45%', height:'40%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllEstados();
        }
      });
  }

}

