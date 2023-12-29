import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActasService } from 'src/app/core/services/actas.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';
import { DetalleActasComponent } from '../sub-actas/detalle-actas/detalle-actas.component';

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
               private dialog: MatDialog,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<ModalActaComponent>,
  ) {}

  ngOnInit(): void {
  this.newFilfroForm()
  this.getUserID();
  this.getListGestorCombo();
  this.getAllProyecto();
  this.getAllSubserviciosCombo();

  }

  actasForm!: FormGroup;
  newFilfroForm(){
    this.actasForm = this.fb.group({
      idGestor         : ['', Validators.required],
      idProyecto       : ['', Validators.required],
      idSubservicio    : ['', Validators.required],
      periodo          : ['', Validators.required],
      comentario       : [''],
      enlaceActa       : [''],
      idUsuarioCreacion: [''],
    import           : [''],
      detalleActaParams: this.fb.group({
        analista     :['', Validators.required],
        cantidad     :['', Validators.required],
        precio_unidad:['', Validators.required],
        venta_total  :['', Validators.required],
        perfil       :['', Validators.required],
        observacion  :[''],
        moneda       :[''],
        comentarioDet:[''],
      })
    })
  };

  readExcell_x(e: any){
    // console.log('|==>',e, this.liquidacionForm);
    this.blockUI.start("Espere por favor, estamos Importando la Data... ") ;

    let file = e.target.files[0];
    let formData: FormData = new FormData();

    formData.append('file', file, file.name);

    this.importarActas(formData);
  }

  listDetActas  : any[] = [];
  importarActas(formData: FormData){
    this.actasService.importarActas(formData).subscribe((acta: any) => {
      this.blockUI.stop();

      console.log('IMPORT_DATA', acta);

      this.listDetActas = acta.result.detalleActas;
      console.log('IMP_DET', this.listDetActas);

          this.actasForm.reset({
            comentario        : acta.result.comentario,
            declarado         : acta.result.declaradoTotalActa,
            enlaceActa        : acta.result.enlaceActa,
            facturadoTotalActa: acta.result.facturadoTotalActa,
            gestor            : acta.result.gestor,
            idActa            : acta.result.idActa,
            idEstado          : acta.result.idEstado,
            idGestor          : acta.result.idGestor,
            idProyecto        : acta.result.idProyecto,
            idSubservicio     : acta.result.idSubservicio,
            pendiente         : acta.result.pendiente,
            periodo           : acta.result.periodo,
            importe           : acta.result.ventaTotalActa,
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

  // crearOactualizarActa(){
  //   if (this.actasForm.invalid) {
  //     return Object.values(this.actasForm.controls).forEach((controls) => {
  //       controls.markAllAsTouched();
  //     })
  //   }
  //   if (this.DATA_ACTA ) {
  //       console.log('UPD_ACTA');
  //       this.actualizarActa();
  //   } else {
  //     console.log('CREAR_ACTA');
  //     this.crearActa() //OJO: Verificar si se usa
  //   }
  // }

  // actualizarActa(){
  //   const formValues = this.actasForm.getRawValue();

  //   const requestSubActa = {
  //     idActa       : this.DATA_ACTA.idActa,
  //     idGestor     : formValues.idGestor,
  //     idProyecto   : formValues.idProyecto,
  //     idSubservicio: formValues.subservicio,
  //     periodo      : this.utilService.generarPeriodo(formValues.periodo),
  //     venta_total  : formValues.importe,
  //     comentario   : formValues.comentario,
  //     idEstado     : formValues.idEstado,
  //     enlace_acta  : '',
  //     idUsuario    : this.userID,
  //   }

  //   this.actasService.actualizarActa(this.DATA_ACTA.idActa, requestSubActa).subscribe((resp: any) => {

  //     if (resp.success) {
  //       Swal.fire({
  //         title: 'Actualizar acta!',
  //         text : `${resp.message}`,
  //         icon : 'success',
  //         confirmButtonText: 'Ok',
  //       });
  //       this.close(true);
  //     }
  //   })
  // }

  crearAgrupacionConActa(){
    const formValues = this.actasForm.getRawValue();
    const request = {
      idGestor         : formValues.idGestor,
      idProyecto       : formValues.idProyecto,
      idSubservicio    : formValues.idSubservicio,
      periodo          : "2023-12-01",
      comentario       : formValues.comentario,
      idEstado         : formValues.idEstado,
      enlaceAta        : formValues.enlaceAta,
      idUsuarioCreacion: this.userID,
      detalleActaParams: [
        {
          nombre       : formValues.detalleActaParams.analista,
          unidades     : formValues.detalleActaParams.cantidad,
          precio_unidad: formValues.detalleActaParams.precio_unidad,
          precio_total : formValues.detalleActaParams.venta_total,
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

  listGestoresCombo: any[] = [];
  getListGestorCombo(){
    this.liquidacionService.getAllGestorCombo().subscribe((resp: any) => {
      this.listGestoresCombo = resp;
    })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
    })
  }

  listSubserviciosCombo:any[] = [];
  getAllSubserviciosCombo(){
    this.liquidacionService.getAllSubserviciosCombo().subscribe( (resp: any) => {
      this.listSubserviciosCombo = resp.result;
      // console.log('SUBSERV', this.listSubservicios);
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
          // this.getAllDetalleActas();
        }
      });
  }
}
