import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { ModalProyectoComponent } from './modal-proyecto/modal-proyecto.component';
import { Observable, map, startWith } from 'rxjs';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';

@Component({
  selector: 'app-lista-proyecto',
  templateUrl: './lista-proyecto.component.html',
  styleUrls: ['./lista-proyecto.component.scss'],
})
export class ListaProyectoComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  page = 1;
  totalProyecto: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private liquidacionService: LiquidacionService,
              //  private _customerContext: CustomerService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaProyectoComponent>,
  ) {}

  // customers$: Observable<ICustomer[]> = new Observable();
  customers$: Observable<any[]> = new Observable();
  // selectedCustomers: ICustomer[] = [];
  selectedCustomers: any[] = [];
  searchCtrl: FormControl = new FormControl();
  ngOnInit(): void {
  this.newForm();
  this.getAllProyectosCombo();
  this.getAllJefaturas();
  this.getAllClientes();
  this.getAllProyectosFiltro();

  this.searchCtrl.valueChanges
    // .pipe(map(value => typeof value === 'object' ? '' : ''), startWith(''))
    // .subscribe(value => {
    //   this.customers$ = this._customerContext
    //   .loadCustomers(new CustomerFilter({ searchString: value, perPage: 20}))
    //   .pipe(map(c=> c.rows))
    // })
  }

  onOptionSelect(e: MatAutocompleteSelectedEvent){
    // const customer = e.option.value as ICustomer;

    // this.selectedCustomers.push(customer);
  }

  removeCustomer(id: any){ }

  proyectoForm!: FormGroup;
  newForm(){
    this.proyectoForm = this.fb.group({
     id_estado      : [''],
     jefatura       : [''],
     codigo_proyecto: [''],
     cliente        : [''],
     codigoContrato : ['']
    })
  }

  eliminarProyecto(proy: any,){
    console.log('DATA_', proy);

    Swal.fire({
      title:'¿Eliminar proyecto?',
      text: `¿Estas seguro que deseas eliminar el proyecto: ${proy.codigoProyecto}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.eliminarProyecto(proy.idProyecto).subscribe(resp => {

          Swal.fire({
            title: 'Eliminar proyecto',
            text: `${proy.codigoProyecto}: ${resp.message} exitosamente`,
            icon: 'success',
          });
          this.getAllProyectosFiltro()
        });
      };
    });
  };


  listProyectosCombo: any[] = [];
  getAllProyectosCombo(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectosCombo = resp;
      console.log('PROY', this.listProyectosCombo, );

    })
  };

  listProyectosFiltro: any[] = [];
  getAllProyectosFiltro(){
    const formaValues = this.proyectoForm.getRawValue();
    const params = {
      codigoProyecto : formaValues.codigo_proyecto,
      isActive       : formaValues.id_estado,
      cliente        : formaValues.cliente,
      jefatura       : formaValues.jefatura,
      codigoContrato : formaValues.codigoContrato,
    }

    this.liquidacionService.getAllProyectosFiltro(params).subscribe(resp => {
      this.listProyectosFiltro = resp;
      console.log('PROY', this.listProyectosFiltro, );
    })
  }

  listJefaturas: any[] = [];
  getAllJefaturas(){
    this.liquidacionService.getAllJefaturas().subscribe(resp => {
      this.listJefaturas = resp;
      console.log('LIST-JEFATURAS', this.listJefaturas);
    })
  };

  limpiarFiltro() {
    this.proyectoForm.reset('', {emitEvent: false})
    this.newForm()

    this.getAllProyectosFiltro();
  }

  listClientesCombo: any[] = [];
  getAllClientes() {
    this.liquidacionService.getAllClientesCombo().subscribe((resp: any) => {
      this.listClientesCombo = resp;

      console.log('LIST-CLIENTE-COMBO', this.listClientesCombo);
    });
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
    if (this.proyectoForm.get(campo)?.invalid && this.proyectoForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalProyecto) {
      this.liquidacionService.getAllProyectosFiltro(offset).subscribe( (resp: any) => {
            this.listProyectosCombo = resp.list;
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
      .open(ModalProyectoComponent, { width: '45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllProyectosFiltro();
        }
      });
  }

}

