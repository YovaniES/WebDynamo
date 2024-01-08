import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
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
  this.newForm()
  // this.getAllOrdenCompra();
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

  eliminarOrdenCompra(id: number){

  }

  // API_ORDEN_COMPRA_FILTRO
  listOrdenFiltro: any[] = [];
  getAllOrdenCompraFiltro(){
    const request = this.ordencompraForm.value;

    this.liquidacionService.getAllOrdenCompraFiltro(request).subscribe((resp: any) => {
        this.listOrdenFiltro = resp;
        console.log('LIST-OC_FILTRO', this.listOrdenFiltro);
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
      this.liquidacionService.getAllCertificaciones().subscribe( (resp: any) => {
            this.listOrdenFiltro = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  };

  limpiarFiltro(){}

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

  // abrirModalCrearFactura(DATA?: any) {
  //   console.log('DATA_OC', DATA);
  //   this.dialog
  //     .open(CrearFacturasComponent, { width: '45%', data: DATA })
  //     .afterClosed().subscribe((resp) => {
  //       if (resp) {
  //         this.getAllOrdenCompraFiltro();
  //       }
  //     });
  // }

}

