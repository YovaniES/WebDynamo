import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import Swal from 'sweetalert2';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { ModalLiderComponent } from './modal-lider/modal-lider.component';

@Component({
  selector: 'app-lista-lider',
  templateUrl: './lista-lider.component.html',
  styleUrls: ['./lista-lider.component.scss'],
})
export class ListaLiderComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  page = 1;
  totalLideres: number = 0;
  pageSize = 5;

  constructor( private fb: FormBuilder,
               private facturacionService: FacturacionService,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaLiderComponent>,
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllLiderCombo();
  this.getAllLiderFilter();
  this.getAllProyecto();
  }

  liderForm!: FormGroup;
  newForm(){
    this.liderForm = this.fb.group({
     lider   : [''],
     estado  : [''],
     proyecto: ['']
    })
  }

  listLiderCombo: any[] = [];
  getAllLiderCombo(){
    this.liquidacionService.getAllLiderCombo().subscribe((resp: any) => {
      this.listLiderCombo = resp
      console.log('LIDER-COMBO', this.listLiderCombo);
    })
  }

  listLideres: any[] = [];
  getAllLiderFilter(){
    const formValues = this.liderForm.getRawValue();

    const params = {
      nombre  : formValues.lider,
      proyecto: formValues.proyecto,
      isActive: formValues.estado
    }

    this.liquidacionService.getAllLiderFilter(params).subscribe((resp: any) => {
      this.listLideres = resp
      // this.proyectos_x = resp.map((x: any) => x.proyectos)

      console.log('LIST-LIDER', this.listLideres);
    })
  }

  eliminarLider(lider: any,){
    console.log('DEL_LIDER', lider);

    Swal.fire({
      title:'¿Eliminar líder?',
      text: `¿Estas seguro que deseas eliminar el líder: ${lider.lider}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.eliminarLider(lider.idLider).subscribe(resp => {

          Swal.fire({
            title: 'Eliminar líder',
            text: `${lider.lider}: ${resp.message} exitosamente`,
            icon: 'success',
          });
          this.getAllLiderFilter()
        });
      };
    });
  };

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
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
    if (this.liderForm.get(campo)?.invalid && this.liderForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalLideres) {
      this.facturacionService.cargarOBuscarLiquidacion(offset.toString()).subscribe( (resp: any) => {
            this.listLideres = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  limpiarFiltro() {
    this.liderForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllLiderFilter();
  }

  abrirModalCrearOactualizar(DATA?: any) {
    // console.log('DATA_G', DATA);
    this.dialog
      .open(ModalLiderComponent, { width: '45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllLiderFilter();
        }
      });
  }

}

