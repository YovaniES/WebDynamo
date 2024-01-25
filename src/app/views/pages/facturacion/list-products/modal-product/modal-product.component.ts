import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { ProductsService } from 'src/app/core/services/product.service';

@Component({
    selector: 'app-modal-product',
    templateUrl: './modal-product.component.html',
    styleUrls: ['./modal-product.component.scss'],
})
export class ModalProductComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  product_Id: number = 0;

  loadingItem: boolean = false;
  listProyectos: any[]=[];

  constructor(
    private productsService : ProductsService,
    private fb              : FormBuilder,
    public datePipe         : DatePipe,
    private dialogRef: MatDialogRef<ModalProductComponent>,

    @Inject(MAT_DIALOG_DATA) public DATA_PRODUCT: any
  ){}

  ngOnInit(): void {
    this.newForm();
    this.getAllStates();

    if (this.DATA_PRODUCT) {
      this.product_Id = this.DATA_PRODUCT.idProduct;
      this.getProductByID(this.DATA_PRODUCT.idProduct);
    }
  }

  productForm!: FormGroup;
  newForm(){
    this.productForm = this.fb.group({
      product    : ['', Validators.required],
      price      : ['', Validators.required],
      stock      : ['', Validators.required],
      category   : ['', Validators.required],
      state      : [''],
      create_date: [''],
    })
  }

  createOrUpdateProduct(){
    if (this.productForm.invalid) {
      return Object.values(this.productForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    if (this.DATA_PRODUCT.idProduct > 0) {
      console.log('A C T',);
      this.updateProduct();
    }else {
      console.log('C R E A R');
      this.createProduct();
    }
  }

  createProduct(): void{
    const request =  {...this.productForm.value}

    this.productsService.createProduct(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear producto!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      }
    })
  }

  updateProduct(){
    const requestProduct = {...this.productForm.value}

    this.productsService.updateProduct(this.DATA_PRODUCT.idProduct, requestProduct).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar producto!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
          this.close(true);
      }
    })
  }

  actionBtn: string = 'Crear';
  getProductByID(id: number): void{
    // this.blockUI.start("Cargando data...");
    if (this.DATA_PRODUCT) {
      this.actionBtn = 'Actualizar'
      this.productsService.getProductById(id).subscribe((resp: any) => {
        console.log('DATA_BY_ID_PRODUCT', resp);
        this.blockUI.stop();
        this.productForm.reset({
          product : resp.product,
          price   : resp.price,
          stock   : resp.stock,
          category: resp.category,
          state   : resp.state,
        })
      })
    }
  }

  listState: any[] = [];
  getAllStates(){
     this.productsService.getAllStates().subscribe((resp: any) => {
       this.listState = resp.result;
       console.log('ESTADOS_LIQ', this.listState);

     })
   }

  campoNoValido(campo: string): boolean {
    if (this.productForm.get(campo)?.invalid && this.productForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}

