import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { ModalJefaturaComponent } from './modal-jefatura/modal-jefatura.component';

@Component({
  selector: 'app-lista-jefatura',
  templateUrl: './lista-jefatura.component.html',
  styleUrls: ['./lista-jefatura.component.scss'],
})
export class ListaJefaturaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalJefaturas: number = 0;
  pageSize = 5;

  constructor( private fb: FormBuilder,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaJefaturaComponent>,
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllJefaturaCombo();
  this.getAllJefaturaFiltro();
  }

  jefaturaForm!: FormGroup;
  newForm(){
    this.jefaturaForm = this.fb.group({
     jefatura: [''],
     estado  : [''],
    })
  }

  listJefaturasCombo: any[] = [];
  getAllJefaturaCombo(){
    this.liquidacionService.getAllJefaturaCombo().subscribe((resp: any) => {
      this.listJefaturasCombo = resp
      console.log('LIST-JEFAT-COMBO', this.listJefaturasCombo);
    })
  };

  listJefaturasFiltro: any[] = [];
  getAllJefaturaFiltro(){
    const formaValues = this.jefaturaForm.getRawValue();
    const params = {
      nombre  : formaValues.jefatura,
      IsActive: formaValues.estado
    }

    this.liquidacionService.getAllJefaturaFiltro(params).subscribe((resp: any) => {
      this.listJefaturasFiltro = resp
      console.log('LIST-JEFAT-FILTRO', this.listJefaturasFiltro);
    })
  }

  eliminarJefatura(jefatura: any,){
    console.log('DEL_JEFAT', jefatura);

    Swal.fire({
      title:'¿Eliminar jefatura?',
      text: `¿Estas seguro que deseas eliminar la jefatura: ${jefatura.nombre}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.eliminarJefatura(jefatura.idJefatura).subscribe(resp => {

          Swal.fire({
            title: 'Eliminar jefatura',
            text: `${jefatura.nombre}: ${resp.message} exitosamente`,
            icon: 'success',
          });
          this.getAllJefaturaFiltro()
        });
      };
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
    if (this.jefaturaForm.get(campo)?.invalid && this.jefaturaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalJefaturas) {
      this.liquidacionService.getAllJefaturaFiltro(offset).subscribe( (resp: any) => {
            this.listJefaturasFiltro = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  limpiarFiltro() {
    this.jefaturaForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllJefaturaFiltro();
  }

  abrirModalCrearOactualizar(DATA?: any) {
    console.log('DATA_G', DATA);
    this.dialog
      .open(ModalJefaturaComponent, { width: '45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllJefaturaFiltro();
        }
      });
  }

}

