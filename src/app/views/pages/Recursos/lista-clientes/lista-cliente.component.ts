import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import Swal from 'sweetalert2';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { ModalClienteComponent } from './modal-clientes/modal-cliente.component';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-lista-cliente',
  templateUrl: './lista-cliente.component.html',
  styleUrls: ['./lista-cliente.component.scss'],
})
export class ListaClienteComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  page = 1;
  totalLideres: number = 0;
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
    this.getAllClientes();
    this.getAllProyecto();
    this.getAllSubservicios();
  }

  clienteForm!: FormGroup;
  newForm(){
    this.clienteForm = this.fb.group({
     lider   : [''],
     estado  : [''],
     proyecto: ['']
    })
  }

  listLideres: any[] = [];
  proyectos_x: any[] = [];
  getAllClientes() {
    this.liquidacionService.getAllCliente().subscribe((resp: any) => {
      this.listLideres = resp;

      console.log('LIST-CLIENTE', this.listLideres);
    });
  }

  eliminarCliente(lider: any) {
    console.log('DEL_CLIENTE', lider);

    Swal.fire({
      title: '¿Eliminar líder?',
      text: `¿Estas seguro que deseas eliminar el cliente: ${lider.lider}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.liquidacionService
          .eliminarCliente(lider.idLider)
          .subscribe((resp) => {
            Swal.fire({
              title: 'Eliminar cliente',
              text: `${lider.lider}: ${resp.message} exitosamente`,
              icon: 'success',
            });
            this.getAllClientes();
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

  listSubservicios: any[] = [];
  getAllSubservicios() {
    this.liquidacionService.getAllSubservicio().subscribe((resp) => {
      this.listSubservicios = resp;
      console.log('SUBS', this.listSubservicios);
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
      this.clienteForm.get(campo)?.invalid &&
      this.clienteForm.get(campo)?.touched
    ) {
      return true;
    } else {
      return false;
    }
  }

  limpiarFiltro() {
    this.clienteForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllClientes();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalLideres) {
      this.facturacionService
        .cargarOBuscarLiquidacion(offset.toString())
        .subscribe((resp: any) => {
          this.listLideres = resp.list;
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
      .open(ModalClienteComponent, { width: '45%', height: '40%', data: DATA })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.getAllClientes();
        }
      });
  }
}
