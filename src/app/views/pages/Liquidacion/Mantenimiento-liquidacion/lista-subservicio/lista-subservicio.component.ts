import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import Swal from 'sweetalert2';
import { ModalSubservicioComponent } from './modal-subservicio/modal-subservicio.component';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-lista-subservicio',
  templateUrl: './lista-subservicio.component.html',
  styleUrls: ['./lista-subservicio.component.scss'],
})
export class ListaSubservicioComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalSubservicio: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private facturacionService: FacturacionService,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaSubservicioComponent>,
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllProyecto();
  this.getAllGestor();
  this.getAllSubserviciosFiltro()
  }

  subservicioForm!: FormGroup;
  newForm(){
    this.subservicioForm = this.fb.group({
     idGestor     : [''],
     idSubservicio: [''],
     idProyecto   : ['']
    })
  }

  eliminarSubservicio(subserv: any){
    Swal.fire({
      title:'¿Eliminar subservicio?',
      text: `¿Estas seguro que deseas eliminar el subservicio: ${subserv.subservicio}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.eliminarSubservicio(subserv.idSubservicio).subscribe(resp => {

          Swal.fire({
            title: 'Eliminar subservicio',
            text: `${resp.message}`,
            icon: 'success',
          });
          this.getAllSubserviciosFiltro()
        });
      };
    });
  }

  listGestores: any[] = [];
  getAllGestor(){
    // const request = this.subservicioForm.controls['idGestor'].value;

    const request = {
      idGestor   : this.subservicioForm.controls['idGestor'].value,
      proyecto   : '',
      subservicio: '',
      estado     : ''
    }

    this.liquidacionService.getAllGestor(request).subscribe( (resp: any) => {
      this.listGestores = resp;
      console.log('DATA_GESTOR', this.listGestores);
    })
  }

  listSubservicios: any[] = [];
  getAllSubserviciosFiltro(){
    const request = this.subservicioForm.value;

    this.liquidacionService.getAllSubserviciosFiltro(request).subscribe( (resp: any) => {
      this.listSubservicios = resp.result;
      console.log('DATA_SUBSERV', this.listSubservicios);
    })
  }

  limpiarFiltro() {
    this.subservicioForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllSubserviciosFiltro();
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
    if (this.subservicioForm.get(campo)?.invalid && this.subservicioForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalSubservicio) {
      this.liquidacionService.getAllSubserviciosFiltro(offset.toString()).subscribe( (resp: any) => {
            this.listSubservicios = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  abrirModalCrearOactualizar(DATA?: any) {
    // console.log('DATA_G', DATA);
    this.dialog
      .open(ModalSubservicioComponent, { width: '45%', height:'45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllSubserviciosFiltro();
        }
      });
  }

}

