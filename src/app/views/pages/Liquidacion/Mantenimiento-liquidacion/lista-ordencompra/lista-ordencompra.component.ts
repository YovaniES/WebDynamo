import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ModalOrdencompraComponent } from './modal-ordencompra/modal-ordencompra.component';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';

@Component({
  selector: 'app-lista-ordencompra',
  templateUrl: './lista-ordencompra.component.html',
  styleUrls: ['./lista-ordencompra.component.scss'],
})
export class ListaOrdencompraComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  page = 1;
  totalOrdencompra: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaOrdencompraComponent>,
  ) {}

  ngOnInit(): void {
    this.newForm();
    this.getAllOrdenCombo();
    this.getAllOrdenCompraFiltro()
  }

  ordencompraForm!: FormGroup;
  newForm(){
    this.ordencompraForm = this.fb.group({
     ordenCompra  : [''],
     certificacion: [''],
     estado       : [''],
     monto        : [''],
     proyecto     : [''],
    })
  }

  eliminarOrdenCompra(oc: any){
    console.log('DELETE_OC', oc);

    Swal.fire({
      title:'¿Eliminar Orden de compra?',
      text: `¿Estas seguro que deseas eliminar la Orden de compra: ${oc.nro_orden}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.eliminarOrdenCompra(oc.idOrden).subscribe(resp => {
          Swal.fire({
            title: 'Eliminar orden de compra',
            text: `${resp.message}`,
            icon: 'success',
          });
          this.getAllOrdenCompraFiltro()
        });
      };
    });
  }

  listOrdenFiltro: any[] = [];
  getAllOrdenCompraFiltro(){
    const formValues = this.ordencompraForm.getRawValue();

    const params = {
      ordenCompra  : formValues.ordenCompra,
      certificacion: formValues.certificacion,
      estado       : formValues.estado,
      monto        : formValues.monto,
      proyecto     : formValues.proyecto
    }

    this.liquidacionService.getAllOrdenCompraFiltro(params).subscribe((resp: any) => {
        this.listOrdenFiltro = resp;
        console.log('LIST-OC_FILTRO', this.listOrdenFiltro);
    });
  };

  listOrdenCompraCombo: any[] = [];
  getAllOrdenCombo(){
    this.liquidacionService.getAllOrdenCombo().subscribe(resp => {
      this.listOrdenCompraCombo = resp;
      console.log('OC-COMBO', this.listOrdenCompraCombo);
    })
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
    if (this.ordencompraForm.get(campo)?.invalid && this.ordencompraForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalOrdencompra) {
      this.liquidacionService.getAllOrdenCompraFiltro(offset).subscribe( (resp: any) => {
            this.listOrdenFiltro = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  };

  limpiarFiltro() {
    this.ordencompraForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllOrdenCompraFiltro();
  }

  abrirModalCrearOactualizar(DATA?: any) {
    // console.log('DATA_G', DATA);
    this.dialog
      .open(ModalOrdencompraComponent, { width: '50%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllOrdenCompraFiltro();
        }
      });
  };

}

