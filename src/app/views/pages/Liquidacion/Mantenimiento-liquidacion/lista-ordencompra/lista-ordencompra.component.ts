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
  this.getAllOrdenCompra();
  }

  ordencompraForm!: FormGroup;
  newForm(){
    this.ordencompraForm = this.fb.group({
     orden_compra : [''],
     certificacion: [''],
     monto        : [''],
    })
  }

  eliminarOrdenCompra(id: number){

  }

  listOrdenCompra: any[] = [];
  getAllOrdenCompra(){
    this.liquidacionService.getAllOrdenCompra().subscribe((resp: any) => {
        this.listOrdenCompra = resp;
        console.log('LIST-OC', this.listOrdenCompra);
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
            this.listOrdenCompra = resp.list;
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
      .open(ModalOrdencompraComponent, { width: '45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllOrdenCompra();
        }
      });
  }

}

