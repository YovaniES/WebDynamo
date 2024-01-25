import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import * as XLSX from 'xlsx';
import { FiltroLiqModel } from 'src/app/core/models/liquidacion.models';
import { FacturaService } from 'src/app/core/services/factura.service';
import { MantenimientoService } from 'src/app/core/services/mantenimiento.service';
import { DatePipe } from '@angular/common';
import { ProductsService } from 'src/app/core/services/product.service';
import { ModalProductComponent } from './modal-product/modal-product.component';
import { FiltroProduct, ProductModel } from 'src/app/core/models/product.models';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  liquidacionForm!: FormGroup;

  page = 1;
  totalFacturas: number = 0;
  pageSize = 5;

  productos: any[] = []
  constructor(
    private productsService: ProductsService,
    private exportExcellService: ExportExcellService,
    private facturaService: FacturaService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.newFilfroForm();
    this.getAllListProducts();

    this.getAllProducts()
    this.getListCategories();
    this.getListState();
    this.getAllListaExportVD();
    // this.exportListVD_Fact();
    // console.log('PERIODO_ACTUAL-LIQ',this.modificarMes(0)); //2023-09
  }

  newFilfroForm(){
    this.liquidacionForm = this.fb.group({
      idProduct  : [''],
      name       : [''],
      price      : [''],
      category   : [''],
      state      : [''],
      create_date: [''],
      // import           : [''],
    })
  };

  getAllListProducts(){
    this.productos = [
      {
        "id": 3,
        "producto": "laptop",
        "categoria": "educacion",
        "stock": 20,
        "estado": 0,
        "precio": 1200,
        "fechaCreacion": "2024-01-23",
        "antiguedad": 3
      },
      {
        "id": 4,
        "producto": "Azucar",
        "categoria": "Alimentos",
        "stock": 25,
        "estado": 1,
        "precio": "4.5",
        "fechaCreacion": "2022-05-14",
        "antiguedad": 2
        },
      {
        "id": 5,
        "producto": "Detergente",
        "categoria": "Limpieza",
        "stock": 2,
        "estado": 0,
        "precio": "12",
        "fechaCreacion": "2020-05-14",
        "antiguedad": 4
      },
    ]
  }

  listProducts: ProductModel[] = []
  getAllProducts(){
    // this.blockUI.start('Cargando lista de productos...');

    const request: FiltroProduct = {...this.liquidacionForm.value}

    this.productsService.getAllProducts(request).subscribe((resp: any) => {
      // console.log('LIST_PRODUCT =>', resp);
      this.blockUI.stop();

      this.listProducts= resp;
    })
  }

  deleteProduct(idProduct: number){
    Swal.fire({
      title:'¿Eliminar producto?',
      text: `¿Estas seguro que deseas eliminar el producto: ${idProduct}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.productsService.deleteProduct(idProduct).subscribe(resp => {

          Swal.fire({
            title: 'Eliminar producto',
            text: `${resp.message}, con el ${idProduct}`,
            icon: 'success',
          });
          this.getAllProducts()
        });
      };
    });
  }

  listExportVentaDeclarada: any[] = []
  getAllListaExportVD(){
    this.facturaService.getAllListaExportVD().subscribe((resp: any) => {
      console.log('LIST_EXPORT_VD =>', resp);

      this.listExportVentaDeclarada = [];
      this.listExportVentaDeclarada = resp.result;
    })
  }

  listGestores: any[] = [];
  getListCategories(){
    this.productsService.getAllCategories().subscribe((resp: any) => {
      this.listGestores = resp.result;
      console.log('LIQ_GESTORES', this.listGestores);
    })
  }

  listEstados: any[] = [];
  getListState(){
    this.productsService.getAllStates().subscribe((resp: any) => {
      this.listEstados = resp.result;
      console.log('LIQ_ESTADOS', this.listEstados);
    })
  }

  limpiarFiltro() {
    this.liquidacionForm.reset('', {emitEvent: false})
    this.newFilfroForm()

    this.getAllProducts();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalFacturas) {
      this.productsService.getAllProducts(offset.toString()).subscribe( (resp: any) => {
            this.listProducts = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  };

  openModalProduct(DATA?: any){
    this.dialog.open(ModalProductComponent, {width:'55%', data: DATA})
      .afterClosed().subscribe(resp => {
      if (resp) {
        this.getAllProducts()
      }
    })
  };

  // exportarVD_FACT(){
  //   this.exportExcellService.exportarExcel(this.listExportVentaDeclarada, 'FACTURACION-VENTA_DECLARADA')
  // }
}


