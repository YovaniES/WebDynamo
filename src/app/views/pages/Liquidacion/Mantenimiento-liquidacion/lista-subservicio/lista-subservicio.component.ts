import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ModalSubservicioComponent } from './modal-subservicio/modal-subservicio.component';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';

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
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaSubservicioComponent>,
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllProyecto();
  this.getAllSubservicioCombo();
  this.getAllSubserviciosFiltro()
  }

  subservicioForm!: FormGroup;
  newForm(){
    this.subservicioForm = this.fb.group({
     idGestor     : [''],
     idProyecto   : [''],
     subservicio  : [''],
     estado       : ['']
    })
  };

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
  };

  listSubservicioCombo: any[] = [];
  getAllSubservicioCombo(){
    this.liquidacionService.getAllSubserviciosCombo().subscribe((resp: any) => {
      this.listSubservicioCombo = resp
      console.log('LIST-SUBSER-COMBO', this.listSubservicioCombo);
    })
  }

  listSubserviciosFiltro: any[] = [];
  getAllSubserviciosFiltro(){
    const formValues = this.subservicioForm.getRawValue();
    console.log('PARAMS', formValues);

    const request = {
      idProyecto : formValues.idProyecto,
      subservicio: formValues.subservicio,
      estado     : formValues.estado,
    };

    this.liquidacionService.getAllSubserviciosFiltro(request).subscribe(resp => {
      this.listSubserviciosFiltro = resp;
      console.log('DATA_SUBSERV-FILTRO', this.listSubserviciosFiltro);
    })
  }

  limpiarFiltro() {
    this.subservicioForm.reset('', {emitEvent: false})
    this.newForm();
    this.getAllSubserviciosFiltro();
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectos = resp;
      // console.log('PROY', this.listProyectos);
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
            this.listSubserviciosFiltro = resp.list;
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
      .open(ModalSubservicioComponent, { width: '45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllSubserviciosFiltro();
        }
      });
  }

}

