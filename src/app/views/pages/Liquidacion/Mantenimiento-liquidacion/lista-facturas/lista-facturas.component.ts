import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { ModalFacturasComponent } from './modal-facturas/modal-facturas.component';

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
    this.getAllFacturasFiltro();
    this.getAllProyecto();
    this.getAllOrdenCombo()
    this.getListaEstadosFactura();
    this.getAllCertificaciones();
  }

  facturaForm!: FormGroup;
  newForm(){
    this.facturaForm = this.fb.group({
     nro_factura   : [''],
     idEstado      : [''],
     idProyecto    : [''],
     certificacion : [''],
     ordenCompra   : [''],
    })
  }

  listFacturas: any[] = [];
  getAllFacturasFiltro() {
    this.blockUI.start("Cargando lista de Facturas...");
    const formValues = this.facturaForm.getRawValue();

    const params = {
      nro_factura  : formValues.nro_factura,
      idEstado     : formValues.idEstado,
      idProyecto   : formValues.idProyecto,
      certificacion: formValues.certificacion,
      ordenCompra  : formValues.ordenCompra,
    }
    this.liquidacionService.getAllFacturasFiltro(params).subscribe(resp => {
      this.blockUI.stop();
      this.listFacturas = resp;

      console.log('LIST-FACTURAS', this.listFacturas);
    });
  }

  eliminarFactura(factura: any) {
    console.log('DEL_FACTURA', factura);

    Swal.fire({
      title: '¿Eliminar factura?',
      text: `¿Estas seguro que deseas eliminar la factura: ${factura.nro_factura}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.liquidacionService.eliminarFacturas(factura.idFactura).subscribe((resp) => {
            Swal.fire({
              title: 'Eliminar factura',
              text: `${factura.nro_factura}: ${resp.message} exitosamente`,
              icon: 'success',
            });
            this.getAllFacturasFiltro();
          });
      }
    });
  }

  listProyectos: any[] = [];
  getAllProyecto() {
    this.liquidacionService.getAllProyectosCombo().subscribe((resp) => {
      this.listProyectos = resp;
      console.log('PROY', this.listProyectos);
    });
  };

  listOrdenCompraCombo: any[] = [];
  getAllOrdenCombo(){
    this.liquidacionService.getAllOrdenCombo().subscribe(resp => {
      this.listOrdenCompraCombo = resp;
      console.log('OC-COMBO', this.listOrdenCompraCombo);
    })
  };

  listCertificaciones: any[] = [];
  getAllCertificaciones(){
    this.liquidacionService.getAllCertificaciones().subscribe(resp => {
      this.listCertificaciones = resp;
      // console.log('CERTIFICACIONES', this.listCertificaciones);
    })
  };

  listEstadoFacturas: any[] = [];
  getListaEstadosFactura() {
    this.liquidacionService.getListaEstadosFactura().subscribe((resp) => {
      this.listEstadoFacturas = resp;
      console.log('EST_FACTURA', this.listEstadoFacturas);
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

    this.getAllFacturasFiltro();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalFacturas) {
      this.liquidacionService
        .getAllFacturasFiltro(offset)
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
      .open(ModalFacturasComponent, { width: '45%', data: DATA })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.getAllFacturasFiltro();
        }
      });
  }
}
