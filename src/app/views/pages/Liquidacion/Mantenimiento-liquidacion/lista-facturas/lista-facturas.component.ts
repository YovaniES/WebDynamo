import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { ModalFacturasComponent } from './modal-facturas/modal-facturas.component';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.component.html',
  styleUrls: ['./lista-facturas.component.scss'],
})
export class ListaFacturasComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private liquidacionService: LiquidacionService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ListaFacturasComponent>
  ) {}

  ngOnInit(): void {
    this.newForm();
    this.getAllFacturas();
    this.getAllProyecto();
  }

  facturaForm!: FormGroup;
  newForm(){
    this.facturaForm = this.fb.group({
     num_factura   : [''],
     estado        : [''],
     proyecto      : [''],
     certificacion : [''],
    })
  }

  listFacturas: any[] = [];
  getAllFacturas() {
    this.liquidacionService.getAllFacturas().subscribe((resp: any) => {
      this.listFacturas = resp;

      console.log('LIST-FACTURAS', this.listFacturas);
    });
  }

  eliminarFactura(factura: any) {
    console.log('DEL_FACTURA', factura);

    Swal.fire({
      title: '¿Eliminar factura?',
      text: `¿Estas seguro que deseas eliminar la factura: ${factura.factura}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.liquidacionService
          .eliminarCliente(factura.idfactura)
          .subscribe((resp) => {
            Swal.fire({
              title: 'Eliminar factura',
              text: `${factura.factura}: ${resp.message} exitosamente`,
              icon: 'success',
            });
            this.getAllFacturas();
          });
      }
    });
  }

  listProyectos: any[] = [];
  getAllProyecto() {
    this.liquidacionService.getAllProyectos().subscribe((resp) => {
      this.listProyectos = resp;
      console.log('PROY', this.listProyectos);
    });
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

  showAlertError(message: string) {
    Swal.fire({
      title: 'Error',
      icon: 'error',
      text: message,
    });
  }

  campoNoValido(campo: string): boolean {
    if (
      this.facturaForm.get(campo)?.invalid &&
      this.facturaForm.get(campo)?.touched
    ) {
      return true;
    } else {
      return false;
    }
  }

  limpiarFiltro() {
    this.facturaForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllFacturas();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalFacturas) {
      this.liquidacionService
        .getAllFacturas()
        .subscribe((resp: any) => {
          this.listFacturas = resp.list;
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
      .open(ModalFacturasComponent, { width: '45%', height: '40%', data: DATA })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.getAllFacturas();
        }
      });
  }
}
