import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActasService } from 'src/app/core/services/actas.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';
import { Detalle } from 'src/app/core/models/actas.models';
import { UtilService } from 'src/app/core/services/util.service';
import { VentaDeclaradaComponent } from './venta-declarada/venta-declarada.component';
import { DetalleActasComponent } from './detalle-actas/detalle-actas.component';

@Component({
  selector: 'app-modal-acta',
  templateUrl: './modal-acta.component.html',
  styleUrls: ['./modal-acta.component.scss'],
})
export class ModalActaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loading = false;
  loadingItem: boolean = false;

  activeTab: string = 'manual';
  onTabClick(tab: string) {
    this.activeTab = tab;
  }

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
    this.getListGestorCombo();
    this.getAllProyecto();
    this.getAllSubserviciosCombo();

    if (this.DATA_ACTA) {
      console.log('DATA_ACTA_', this.DATA_ACTA);

      this.cargarActaById();
      this.getAllEstadosDetActa();
      }
  }

  actasForm!: FormGroup;
  newFilfroForm(){
    this.actasForm = this.fb.group({
      idGestor         : ['', Validators.required],
      idProyecto       : ['', Validators.required],
      idSubservicio    : ['', Validators.required],
      periodo          : ['', Validators.required],
      venta_total      : ['', Validators.required],
      comentario       : [''],
      // idEstado         : [''],
      enlaceActa       : [''],
      declarado        : [''],
      idUsuarioCreacion: [''],
      import           : [''],
      detalleActaParams: this.fb.group({
        analista       : ['',     ],
        cantidad       : [''],
        precio_unidad  : [''],
        precio_total   : ['',     ],
        perfil         : ['',     ],
        observacion    : [''],
        moneda         : [''],
        comentarioDet  : [''],
      })
    })
  };

  readExcell(e: any){
    // console.log('|==>',e, this.liquidacionForm);
    this.blockUI.start("Espere por favor, estamos Importando la Data... ") ;
    let file = e.target.files[0];
    let formData: FormData = new FormData();

    formData.append('file', file, file.name);
    this.importarActas(formData);
  }

  listDetActasImportado: Detalle[] = [];
  importarActas(formData: FormData){
    this.actasService.importarActas(formData).subscribe((resp: any) => {
      this.blockUI.stop();
      if (resp.success) {
        console.log('IMPORT_DATA', resp);

        let acta = resp.result;

        this.listDetActasImportado = acta.detalleActas;
        console.log('IMP_DET', this.listDetActasImportado);
        console.log('IMP_ACTAS', acta);

          this.actasForm.reset({
            idGestor     : acta.idGestor,
            idProyecto   : acta.idProyecto,
            idSubservicio: acta.idSubservicio,
            periodo      : acta.periodo,
            venta_total  : acta.ventaTotalActa,
            comentario   : acta.comentario,
            enlaceActa   : acta.enlaceAta,
          });
      }else{
        Swal.fire({
          title: 'ERROR!',
          text : `${resp.message}`,
          icon : 'warning',
          confirmButtonText: 'Ok'
        })
      }
    })
  };


  crearOactualizarActa(){
    if (this.actasForm.invalid) {
      return Object.values(this.actasForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_ACTA.idActa ) {
        console.log('UPD_ACTA');
        this.actualizarActa();
    } else {
      console.log('CREAR_ACTA');
      this.crearAgrupacionConActa();
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
      venta_total  : formValues.venta_total,
      comentario   : formValues.comentario,
      idEstado     : formValues.idEstado,
      enlace_acta  : formValues.enlace,
      idUsuario    : this.userID,
    }

    this.actasService.actualizarActa(this.DATA_ACTA.idActa, requestSubActa).subscribe((resp: any) => {

      if (resp.success) {
        Swal.fire({
          title: 'Actualizar Acta.!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      }
    })
  };

  generarDetalle_x(){
    let listadoDetalle: any[] = [];
    this.listDetActas.forEach(x => {
      const detalle: any = {
        nombre       : x.nombre,
        unidades     : x.unidades,
        precio_unidad: x.precio_unidad,
        precioTotal  : x.precioTotal,
        perfil       : x.perfil,
        observacion  : x.observacion,
        unidad       : x.unidad,
        comentario   : x.comentario
        };
      listadoDetalle.push(detalle)
      })
      return listadoDetalle;
  }

  generarDetalle(){
    return this.listDetActas.map(x => {
      return {
        nombre       : x.nombre,
        unidades     : x.unidades,
        precio_unidad: x.precio_unidad,
        precioTotal  : x.precioTotal,
        perfil       : x.perfil,
        observacion  : x.observacion,
        unidad       : x.unidad,
        comentario   : x.comentario
        };
      })
  }

  guardarActaImportado(){
    const formValues = this.actasForm.getRawValue();
    console.log('IMP-DET-ACTAS', this.listDetActas);

    const request = {
        idGestor         : formValues.idGestor,
        idProyecto       : formValues.idProyecto,
        idSubservicio    : formValues.idSubservicio,
        periodo          : formValues.periodo + '-01',
        comentario       : formValues.comentario,
        ventaTotal       : formValues.venta_total,
        // idEstado         : formValues.idEstado,
        enlaceAta        : formValues.enlaceAta,
        idUsuarioCreacion: this.userID,
        detalleActaParams: this.generarDetalle()
      }
      console.log('GUARDAR', request);

      this.actasService.crearActa(request).subscribe(resp => {
        if (resp.success) {
          Swal.fire({
            title: 'Guardar acta Importado!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok'
          })
          this.close(true);
        }else{
          Swal.fire({
            title: 'ERROR!',
            text : `${resp.message}`,
            icon : 'warning',
            confirmButtonText: 'Ok'
          })
        }
      })
  }

  listDetActas: any[] = [];
  listDeclarados: any[] = [];
  actionBtn: string = 'Crear';
  cargarActaById(): void{
    this.blockUI.start("Cargando acta y su detalle...");
    if (this.DATA_ACTA) {
      this.actionBtn = 'Actualizar'
      this.actasService.getActaById(this.DATA_ACTA.idActa).subscribe((acta: any) => {
        this.blockUI.stop();
        console.log('DATA_BY_ID_ACTA', acta);

        this.listDetActas   = acta.detalleActas;
        this.listDeclarados = acta.actaDeclarados;

        this.actasForm.reset({
          comentario        : acta.comentario,
          declarado         : acta.declaradoTotalActa,
          enlace            : acta.enlaceActa,
          facturadoTotalActa: acta.facturadoTotalActa,
          gestor            : acta.gestor,
          idActa            : acta.idActa,
          idEstado          : acta.idEstado,
          idGestor          : acta.idGestor,
          idProyecto        : acta.idProyecto,
          subservicio       : acta.idSubservicio,
          pendiente         : acta.pendiente,
          periodo           : acta.periodo,
          venta_total       : acta.ventaTotalActa,
        })

        // this.subActasForm.controls['idGestor'  ].disable();
        this.actasForm.controls['idProyecto' ].disable();
        this.actasForm.controls['declarado'  ].disable();
        // this.actasForm.controls['venta_total'].disable();
        // this.actasForm.controls['periodo'   ].disable();
      })
    }
  };

  crearAgrupacionConActa(){
    const formValues = this.actasForm.getRawValue();
    const request = {
      idGestor         : formValues.idGestor,
      idProyecto       : formValues.idProyecto,
      idSubservicio    : formValues.idSubservicio,
      periodo          : formValues.periodo + '-01',
      comentario       : formValues.comentario,
      ventaTotalActa   : formValues.venta_total,
      idEstado         : formValues.idEstado,
      enlaceAta        : formValues.enlaceAta,
      idUsuarioCreacion: this.userID,
      detalleActaParams: [
        {
          nombre       : formValues.detalleActaParams.analista,
          unidades     : formValues.detalleActaParams.cantidad,
          precio_unidad: formValues.detalleActaParams.precio_unidad,
          precioTotal  : formValues.detalleActaParams.precio_total,
          perfil       : formValues.detalleActaParams.perfil,
          observacion  : formValues.detalleActaParams.observacion,
          unidad       : formValues.detalleActaParams.moneda,
          comentario   : formValues.detalleActaParams.comentarioDet
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
      }else{
        Swal.fire({
          title: 'ERROR!',
          text : `${resp.message}`,
          icon : 'warning',
          confirmButtonText: 'Ok'
        })
      }
    })
  };

  eliminarDetalleActa(detalle: any){
    console.log('DEL_DET_ACTA', detalle);

    Swal.fire({
      title: '¿Eliminar detalle acta?',
      text: `¿Estas seguro que deseas eliminar el detalle acta: ${detalle.idDetalleActaConcat}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actasService.eliminarDetActa(detalle.idDetalleActa).subscribe((resp) => {
            Swal.fire({
              title: 'Eliminar detalle acta',
              text: `${detalle.idDetalleActaConcat}: ${resp.message} exitosamente`,
              icon: 'success',
            });
            this.cargarActaById();
          });
      }
    });
  }

  eliminarVentaDeclarada(declarado: any) {
    console.log('DEL_VD', declarado);

    Swal.fire({
      title: '¿Eliminar venta declarada?',
      text: `¿Estas seguro que deseas eliminar la venta declarada: ${declarado.montoDeclarado}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actasService.eliminarVentaDeclarado(declarado.idDeclarado).subscribe((resp) => {
            Swal.fire({
              title: 'Eliminar venta declarada',
              text: `${declarado.montoDeclarado}: ${resp.message} exitosamente`,
              icon: 'success',
            });
            this.cargarActaById();
          });
      }
    });
  };

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
    //  console.log('ID-USER', this.userID);
   })
  }

  listGestoresCombo: any[] = [];
  getListGestorCombo(){
    this.liquidacionService.getAllGestorCombo().subscribe((resp: any) => {
      this.listGestoresCombo = resp;
    })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectos = resp;
    })
  }

  listSubserviciosCombo:any[] = [];
  getAllSubserviciosCombo(){
    this.liquidacionService.getAllSubserviciosCombo().subscribe( (resp: any) => {
      this.listSubserviciosCombo = resp;
      // console.log('SUBSERV', this.listSubservicios);
    })
  };

  listEstadoDetActa: any[] = [];
  getAllEstadosDetActa(){
    this.liquidacionService.getAllEstadosActa().subscribe(resp => {
      this.listEstadoDetActa = resp;
      console.log('EST_ACTA', this.listEstadoDetActa);
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
    if (this.actasForm.get(campo)?.invalid && this.actasForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  campoDetalleNoValido(campo: string): boolean {
    // console.log('ACTASFORM', this.actasForm);
    if (this.actasForm.get("detalleActaParams")?.get(campo)?.invalid && this.actasForm.get("detalleActaParams")?.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  };

  crearOactualizarDetActa(DATA?: any) {
    console.log('DATA_DET_ACTA', DATA);
    this.dialog
      .open(DetalleActasComponent, { width: '55%', data: DATA })
      .afterClosed().subscribe((resp) => {
        console.log('RESP_DET_ACT', resp);
        if (resp) {
          this.cargarActaById();
        }
      });
  }

  abrirVentaDeclarada(ACTA?: any) {
    console.log('DATA_ACTA', ACTA);
    this.dialog
      .open(VentaDeclaradaComponent, { width: '55%', data: {ACTA, sub: this.actasForm.getRawValue() } })
      .afterClosed().subscribe((resp) => {
        console.log('RESP_ACT_DECL', resp);
        if (resp) {
          this.cargarActaById();
        }
      });
  }
}


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
