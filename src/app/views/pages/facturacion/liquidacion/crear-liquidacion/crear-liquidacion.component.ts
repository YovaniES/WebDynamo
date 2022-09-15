import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { UtilService } from 'src/app/core/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-liquidacion',
  templateUrl: './crear-liquidacion.component.html',
  styleUrls: ['./crear-liquidacion.component.scss']
})
export class CrearLiquidacionComponent implements OnInit {
  userID: number = 0;
  facturaForm!: FormGroup;

  constructor(
    private facturacionService: FacturacionService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<CrearLiquidacionComponent>,
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListProyectos();
    this.getUserID();
    this.getListLiquidaciones();
    this.getListGestores();
  }


  newForm(){
    this.facturaForm = this.fb.group({
     id_liquidacion      : [ 676,[Validators.required]],
     id_proyecto         : ['',[Validators.required]],
     subservicio         : ['',[Validators.required]],
     id_gestor           : ['',[Validators.required]],
     venta_declarada     : ['',[Validators.required]],
     fechaPeriodo        : ['',[Validators.required]],
     id_estado           : [ 177,[Validators.required]],
    //  id_estado           : ['',[Validators.required]],
     orden_compra        : [''],
     certificacion       : [''],
     factura             : [''],
     monto_facturado     : [''],
     comentarios         : [''],
     gestor              : [''],
    })
   }

  crearLiquidacion() {
    this.spinner.show();
    const formValues = this.facturaForm.getRawValue();

    let parametro: any =  {
        queryId: 117,
        mapValue:{
          p_periodo           : this.utilService.generarPeriodo(formValues.fechaPeriodo),
          p_idProyecto        : formValues.id_proyecto,
          p_idLiquidacion     : formValues.id_liquidacion,
          p_subServicio       : formValues.subservicio,
          p_gestor            : formValues.gestor,
          p_idGestor          : formValues.id_gestor,
          p_venta_declarada   : formValues.venta_declarada,
          p_idEstado          : formValues.id_estado,
          p_orden_compra      : formValues.orden_compra,
          p_cod_certificacion : formValues.certificacion,
          p_factura           : formValues.factura,
          p_monto_facturado   : formValues.monto_facturado,
          p_Comentarios       : formValues.comentarios,
          p_idMotivo          : '',
          p_idUsuarioCrea     : this.userID,
          p_fechaCrea         : formValues.fecha_crea,
          p_idUsuarioActualiza: '',
          p_fechaActualiza    : '',
          p_ver_estado        : '',
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: '',
        }};
    //  console.log('VAOR', this.facturaForm.value , parametro);
    this.facturacionService.crearLiquidacion(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Crear liquidación!',
        text : `La Liquidación, fue creado con éxito`,
        // text : `La Liquidación: ${formValues.id_liquidacion},fue creado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      // console.log('ID-USER', this.userID);
    })
   }

  listLiquidaciones: any[] = [];
  getListLiquidaciones(){
    let parametro: any[] = [{queryId: 82}];
    this.facturacionService.getListLiquidaciones(parametro[0]).subscribe((resp: any) => {
            this.listLiquidaciones = resp.list;
            // console.log('LIQUIDAC', resp);
    });
  }

  listGestores: any[] = [];
  getListGestores(){
    let arrayParametro: any[] = [{queryId: 102}];

    this.facturacionService.getListEstados(arrayParametro[0]).subscribe((resp: any) => {
            this.listGestores = resp.list;
            // console.log('GESTORES', resp);
    });
  };

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.facturacionService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp.list;
            // console.log('COD_PROY', resp.list);
    });
  };

  campoNoValido(campo: string): boolean {
    if (this.facturaForm.get(campo)?.invalid && this.facturaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
