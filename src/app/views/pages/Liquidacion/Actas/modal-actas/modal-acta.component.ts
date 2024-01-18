import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActasService } from 'src/app/core/services/actas.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';
import { Detalle } from 'src/app/core/models/actas.models';

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
      venta_total      : ['', Validators.required],
      comentario       : [''],
      enlaceActa       : [''],
      idUsuarioCreacion: [''],
      import           : [''],
      detalleActaParams: this.fb.group({
        analista       : ['', Validators.required],
        cantidad       : [''],
        precio_unidad  : [''],
        precio_total   : ['', Validators.required],
        perfil         : ['', Validators.required],
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

  listDetActas: Detalle[] = [];
  importarActas(formData: FormData){
    this.actasService.importarActas(formData).subscribe((resp: any) => {
      this.blockUI.stop();
      if (resp.success) {
        console.log('IMPORT_DATA', resp);

        let acta = resp.result;

        this.listDetActas = acta.detalleActas;
        console.log('IMP_DET', this.listDetActas);
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

  crearAgrupacionConActa(){
    const formValues = this.actasForm.getRawValue();
    const request = {
      idGestor         : formValues.idGestor,
      idProyecto       : formValues.idProyecto,
      idSubservicio    : formValues.idSubservicio,
      periodo          : formValues.periodo + '-01',
      comentario       : formValues.comentario,
      ventaTotal       : formValues.venta_total,
      idEstado         : formValues.idEstado,
      enlaceAta        : formValues.enlaceActa,
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
  }

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
    //  console.log('ID-USER', this.userID);
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
