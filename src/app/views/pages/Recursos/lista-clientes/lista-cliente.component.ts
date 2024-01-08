import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import Swal from 'sweetalert2';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { ModalClienteComponent } from './modal-clientes/modal-cliente.component';

@Component({
  selector: 'app-lista-cliente',
  templateUrl: './lista-cliente.component.html',
  styleUrls: ['./lista-cliente.component.scss'],
})
export class ListaClienteComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  page = 1;
  totalClientes: number = 0;
  pageSize = 5;

  constructor(
    private fb: FormBuilder,
    private facturacionService: FacturacionService,
    private liquidacionService: LiquidacionService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ListaClienteComponent>
  ) {}

  ngOnInit(): void {
    this.newForm();
    this.getAllClientesCombo();
    this.getAllClientesFiltro();
  }

  clienteForm!: FormGroup;
  newForm(){
    this.clienteForm = this.fb.group({
     razon_social: [''],
     ruc         : [''],
     estado      : [''],
    })
  }

  listClientesCombo: any[] = [];
  getAllClientesCombo() {
    this.liquidacionService.getAllClientesCombo().subscribe((resp: any) => {
      this.listClientesCombo = resp;

      console.log('LIST-CLIENTE-COMBO', this.listClientesCombo);
    });
  }

  listClientesFiltro: any[] = [];
  getAllClientesFiltro() {
    const formValues = this.clienteForm.getRawValue();
    const params = {
      razon_social : formValues.razon_social,
      ruc          : formValues.ruc,
      isActive     : formValues.estado
    }

    this.liquidacionService.getAllClientesFiltro(params).subscribe((resp: any) => {
      this.listClientesFiltro = resp;
      console.log('LIST-CLIENTE-COMBO', this.listClientesFiltro);
    });
  }

  eliminarCliente(cliente: any) {
    console.log('DEL_CLIENTE', cliente);

    Swal.fire({
      title: '¿Eliminar cliente?',
      text: `¿Estas seguro que deseas eliminar la Razón social: ${cliente.razon_social}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.liquidacionService.eliminarCliente(cliente.idCliente)
          .subscribe((resp) => {
            Swal.fire({
              title: 'Eliminar cliente',
              text: `${cliente.razon_social}: eliminado exitosamente`,
              icon: 'success',
            });
            this.getAllClientesFiltro();
          });
      }
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

  limpiarFiltro() {
    this.clienteForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllClientesFiltro();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalClientes) {
      this.facturacionService
        .cargarOBuscarLiquidacion(offset.toString())
        .subscribe((resp: any) => {
          this.listClientesFiltro = resp.list;
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
      .open(ModalClienteComponent, { width: '45%', data: DATA })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.getAllClientesFiltro();
        }
      });
  }
}
