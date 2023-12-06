import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActasService } from 'src/app/core/services/actas.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { UtilService } from 'src/app/core/services/util.service';
import Swal from 'sweetalert2';
import { DetalleActasComponent } from '../sub-actas/detalle-actas/detalle-actas.component';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-modal-acta',
  templateUrl: './modal-acta.component.html',
  styleUrls: ['./modal-acta.component.scss'],
})
export class ModalActaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loading = false;

  loadingItem: boolean = false;
  showingidx = 0;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private actasService: ActasService,
               private utilService: UtilService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<ModalActaComponent>,
               private dialog: MatDialog,
               @Inject(MAT_DIALOG_DATA) public DATA_ACTA: any
  ) {}

  ngOnInit(): void {
  this.newFilfroForm()
  this.getUserID();
  this.getListGestor();
  this.getAllProyecto();
  this.getAllEstadosDetActa();
  this.getAllDetalleActas();
  this.getAllSubservicios();
  console.log('DATA_ACTA', this.DATA_ACTA);

  console.log('**', this.listDetActas, this.listDetActas.length);

  if (this.DATA_ACTA) {
    this.cargarActaById(this.DATA_ACTA);
  }
  }

  // listActas: any[] = [];
  // {
  //   "idGestor": 673,
  //   "idProyecto": 95,
  //   "idSubservicio": 6,
  //   "periodo": "2023-12-01",
  //   "idEstado": 4,
  //   "comentario": "",
  //   "enlaceAta": "wwww.enlance.com",
  //   "idUsuarioCreacion": 474,
  //   "detalleActaParams": [
  //     {
  //       "nombre": "Carlos Perez",
  //       "unidades": 15,
  //       "precio_unidad": 2,
  //       "precio_total": 30,
  //       "perfil": "Analista",
  //       "observacion": "",
  //       "unidad": "PEN",
  //       "comentario": ""
  //     }
  //   ]
  // }

  actasForm!: FormGroup;
  newFilfroForm(){
    this.actasForm = this.fb.group({
      idGestor         : ['', Validators.required],
      idProyecto       : ['', Validators.required],
      idSubservicio    : ['', Validators.required],
      periodo          : ['', Validators.required],
      idEstado         : [''],
      comentario       : [''],
      enlaceAta        : [''],
      idUsuarioCreacion: [''],
      detalleActaParams: this.fb.group({
        analista     :['', Validators.required],
        cantidad     :['', Validators.required],
        precio       :['', Validators.required],
        venta_total  :['', Validators.required],
        perfil       :['', Validators.required],
        idEstado     :[''],
        observacion  :[''],
        unidad       :[''],
        comentario   :[''],
      })
    })
  };

  // phoneRegex: RegExp = /^((3[0-9])|(6[0-9])|(8[1-9])|(9[0-8]))[0-9]{6}$/;
  // companyForm!: FormGroup;
  // createForm() {
  // this.companyForm = this.fb.group({
  //   companyName: ['', Validators.required],
  //   address: this.fb.group({
  //     unit  : ['', Validators.required],
  //     street: ['', Validators.required],
  //   }),
  //   emails: this.fb.array([
  //     this.fb.control('', Validators.required),
  //     this.fb.control('')
  //   ]),
  //   contacts: this.fb.array([
  //     this.fb.group({
  //       name : ['', Validators.required],
  //       phone: ['', [ Validators.required, Validators.pattern(this.phoneRegex)]],
  //     })
  //   ])
  // });
  // }

  crearOactualizarActa(){
    if (this.actasForm.invalid) {
      return Object.values(this.actasForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_ACTA ) {
        console.log('UPD_ACTA');
        this.actualizarActa();
    } else {
      console.log('CREAR_ACTA');
      this.crearActa() //OJO: Verificar si se usa
    }
  }

  actualizarActa(){
    const formValues = this.actasForm.getRawValue();

    const requestSubActa = {
      idActa       : this.DATA_ACTA.idActa,
      idGestor     : formValues.idGestor,
      idProyecto   : formValues.idProyecto,
      idSubservicio: formValues.subservicio,
      periodo      : this.utilService.generarPeriodo(formValues.periodo),
      venta_total  : formValues.importe,
      comentario   : formValues.comentario,
      idEstado     : formValues.idEstado,
      enlace_acta  : '',
      idUsuario    : this.userID,
    }

    this.actasService.actualizarActa(this.DATA_ACTA.idActa, requestSubActa).subscribe((resp: any) => {

      if (resp.success) {
        Swal.fire({
          title: 'Actualizar acta!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      }
    })
  }


  crearActa(){ //OJO: Verificar si se usa
    const formValues = this.actasForm.getRawValue();
    // const detalleformValues = this.actasForm.detalleActaParams.getRawValue();

    const request = {
      idGestor         : formValues.idGestor,
      idProyecto       : formValues.idProyecto,
      idSubservicio    : formValues.idSubservicio,
      periodo          : "2023-12-01",
      comentario       : formValues.comentario,
      idEstado         : 1,
      enlaceAta        : formValues.enlaceAta,
      idUsuarioCreacion: this.userID,
      detalleActaParams: [
        {
          nombre       : formValues.analista,
          unidades     : formValues.cantidad,
          precio_unidad: formValues.precio,
          precio_total : formValues.venta_total,
          perfil       : formValues.perfil,
          observacion  : 'abx',
          unidad       : "PEN",
          comentario   : "x-y-z"
        }
      ]
    }

    this.actasService.crearActa(request).subscribe(resp => {
      if (resp.success) {
        Swal.fire({
          title: 'Crear acta!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok'
        })
        this.close(true);
      }
    })
  }

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     console.log('ID-USER', this.userID);
   })
  }

  eliminarDetalleActa(){}

  listGestores: any[] = [];
  getListGestor(){
    this.liquidacionService.getAllGestores().subscribe((resp: any) => {
      this.listGestores = resp;
      console.log('LIST_GESTORES', this.listGestores);
    })
  }

  actionBtn: string = 'Crear';
  cargarActaById(idActa: number): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_ACTA) {
      this.actionBtn = 'Actualizar'
      this.actasService.getActaById(this.DATA_ACTA.idActa).subscribe((acta: any) => {
        this.blockUI.stop();
        console.log('DATA_BY_ID_ACTA', acta);

        this.actasForm.reset({
          comentario        : acta.comentario,
          declarado: acta.declaradoTotalActa,
          enlaceActa        : acta.enlaceActa,
          facturadoTotalActa: acta.facturadoTotalActa,
          gestor            : acta.gestor,
          idActa            : acta.idActa,
          idEstado          : acta.idEstado,
          idGestor          : acta.idGestor,
          idProyecto        : acta.idProyecto, //proyecto: PETO21
          subservicio       : acta.idSubservicio,
          pendiente         : acta.pendiente,
          periodo           : acta.periodo,
          // proyecto          : acta.proyecto,
          // subservicio       : acta.subservicio,
          importe    : acta.ventaTotalActa,
        })
      })
    }
  }

  listDetActas: any[] = [];
  getAllDetalleActas(){
    if (this.DATA_ACTA) {
      this.actasService.getAllActas(this.DATA_ACTA.idActa).subscribe(resp => {
        this.listDetActas = resp.detalleActas;
        console.log('DET_ACTAS-LIST', this.listDetActas);
      })
    }
  }

  listEstadoDetActa: any[] = [];
  getAllEstadosDetActa(){
    this.actasService.getAllEstadosDetActa().subscribe(resp => {
      this.listEstadoDetActa = resp.filter((x:any) => x.eliminacion_logica == 1 );
      console.log('EST_DET_ACTA', this.listEstadoDetActa);
    })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
    })
  }

  listSubservicios:any[] = [];
  getAllSubservicios(){
    this.liquidacionService.getAllSubservicios().subscribe( (resp: any) => {
      this.listSubservicios = resp.result;
    })
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
    if (this.actasForm.get(campo)?.invalid && this.actasForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  limpiarFiltro() {
    this.actasForm.reset('', {emitEvent: false})
    this.newFilfroForm()

    this.getAllDetalleActas();
  }

  crearDetalleActas(DATA?: any) {
    console.log('DATA_SUB_ACTAS', DATA);
    this.dialog
      .open(DetalleActasComponent, { width: '55%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllDetalleActas();
        }
      });
  }
}
