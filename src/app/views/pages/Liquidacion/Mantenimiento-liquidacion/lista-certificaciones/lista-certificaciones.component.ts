import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { ModalCertificacionesComponent } from './modal-certificaciones/modal-certificaciones.component';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-lista-certificaciones',
  templateUrl: './lista-certificaciones.component.html',
  styleUrls: ['./lista-certificaciones.component.scss'],
})
export class ListaCertificacionesComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalCerticaciones: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaCertificacionesComponent>,
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllProyecto();
  this.getAllGestor();
  this.getAllCertificaciones()
  }

  certificacionesForm!: FormGroup;
  newForm(){
    this.certificacionesForm = this.fb.group({
     certicacion: [''],
     proyecto   : [''],
     ordenCompra: [''],
     monto      : [''],
     estado     : ['']
    })
  }

  eliminarCertificacion(cert: any){
    Swal.fire({
      title:'¿Eliminar subservicio?',
      text: `¿Estas seguro que deseas eliminar el certificación: ${cert.certificacion}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.eliminarCertificacion(cert.idSubservicio).subscribe(resp => {

          Swal.fire({
            title: 'Eliminar certificación',
            text: `${resp.message}`,
            icon: 'success',
          });
          this.getAllCertificaciones()
        });
      };
    });
  }

  listGestores: any[] = [];
  getAllGestor(){
    // const request = this.certificacionesForm.controls['idGestor'].value;

    const request = {
      // idGestor   : this.certificacionesForm.controls['idGestor'].value,
      // proyecto   : '',
      // subservicio: '',
      // estado     : ''
    }

    this.liquidacionService.getAllGestor(request).subscribe( (resp: any) => {
      this.listGestores = resp;
      console.log('DATA_GESTOR', this.listGestores);
    })
  }

  listCertificaciones: any[] = [];
  getAllCertificaciones(){
    // const request = this.certificacionesForm.value;

    this.liquidacionService.getAllCertificaciones().subscribe( (resp: any) => {
      this.listCertificaciones = resp.result;
      console.log('DATA_CERTIF', this.listCertificaciones);
    })
  }

  limpiarFiltro() {
    this.certificacionesForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllCertificaciones();
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
    if (this.certificacionesForm.get(campo)?.invalid && this.certificacionesForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalCerticaciones) {
      this.liquidacionService.getAllCertificaciones().subscribe( (resp: any) => {
            this.listCertificaciones = resp.list;
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
      .open(ModalCertificacionesComponent, { width: '45%', height:'45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllCertificaciones();
        }
      });
  }

}

