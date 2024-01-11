import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { ModalCertificacionesComponent } from './modal-certificaciones/modal-certificaciones.component';
import { ActasService } from 'src/app/core/services/actas.service';
import { AsignarFacturaComponent } from './asignar-factura/asignar-factura.component';

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
               private actasService: ActasService,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaCertificacionesComponent>,
  ) {}

  ngOnInit(): void {
    this.newForm()
    this.getAllProyecto();
    this.getAllEstadosActa();
    this.getAllOrdenCombo();
    this.getAllCertificaciones();
    this.getAllCertificacionesFiltro();
  }

  certificacionesForm!: FormGroup;
  newForm(){
    this.certificacionesForm = this.fb.group({
     certificacion: [''],
     proyecto     : [''],
     ordenCompra  : [''],
     monto        : [''],
     estado       : ['']
    })
  }

  eliminarCertificacion(cert: any){
    Swal.fire({
      title:'¿Eliminar certificación?',
      text: `¿Estas seguro que deseas eliminar el certificación: ${cert.nro_certificacion}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.eliminarCertificacion(cert.idCertificacion).subscribe(resp => {
          Swal.fire({
            title: 'Eliminar certificación',
            text: `${resp.message}`,
            icon: 'success',
          });
          this.getAllCertificacionesFiltro()
        });
      };
    });
  }

  listCertificaciones: any[] = [];
  getAllCertificaciones(){
    this.liquidacionService.getAllCertificaciones().subscribe( (resp: any) => {
      this.listCertificaciones = resp;
      console.log('DATA_CERTIF', this.listCertificaciones);
    })
  }

  listCertificacionesFiltro: any[] = [];
  getAllCertificacionesFiltro(){
    const formaValues = this.certificacionesForm.getRawValue();
    const params = {
      nro_certificacion: formaValues.certificacion,
      ordenCompra      : formaValues.ordenCompra,
      proyecto         : formaValues.proyecto,
      estado           : formaValues.estado,
    }

    this.liquidacionService.getAllCertificacionesFiltro(params).subscribe( (resp: any) => {
      this.listCertificacionesFiltro = resp;
      console.log('DATA_CERTIF_FILTRO', this.listCertificacionesFiltro);
    })
  }

  limpiarFiltro() {
    this.certificacionesForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllCertificacionesFiltro();
  };


  listOrdenCompraCombo: any[] = [];
  getAllOrdenCombo(){
    this.liquidacionService.getAllOrdenCombo().subscribe(resp => {
      this.listOrdenCompraCombo = resp;
      console.log('OC-COMBO', this.listOrdenCompraCombo);
    })
  };

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY', this.listProyectos);
    })
  };

  listEstadoDetActa: any[] = [];
  getAllEstadosActa(){
    this.liquidacionService.getAllEstadosActa().subscribe(resp => {
      this.listEstadoDetActa = resp;
      console.log('EST_DET_ACTA', this.listEstadoDetActa);
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
            this.listCertificacionesFiltro = resp.list;
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
      .open(ModalCertificacionesComponent, { width: '45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllCertificacionesFiltro();
        }
      });
  };

  abrirModalCrearFactura(DATA?: any) {
    console.log('DATA_OC', DATA);
    this.dialog
      .open(AsignarFacturaComponent, { width: '45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllCertificacionesFiltro();
        }
      });
  }

}

