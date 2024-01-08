import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActasService } from 'src/app/core/services/actas.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { UtilService } from 'src/app/core/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta-declarada',
  templateUrl: './venta-declarada.component.html',
  styleUrls: ['./venta-declarada.component.scss'],
})
export class VentaDeclaradaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private actasService: ActasService,
               private utilService: UtilService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<VentaDeclaradaComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_VD: any)
            {};

  ngOnInit(): void {
  this.newForm()
  this.getAllProyecto();
  this.getAllEstadosDetActa();
  this.getUserID();
  console.log('DATA_ACTA***', this.DATA_VD);

  if (this.DATA_VD.idActa) {
    this.cargarVentaDeclaradaById();
    // console.log('VD_ACTA', this.DATA_VD);
    }
  }

  ventadeclaradaForm!: FormGroup;
  newForm(){
    this.ventadeclaradaForm = this.fb.group({
     periodo        : ['', Validators.required],
     montoDeclarado : ['', Validators.required],
     comentario     : [''],
    })
  }

  crearOactualizarVD(){
    if (this.ventadeclaradaForm.invalid) {
      return Object.values(this.ventadeclaradaForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    if (this.DATA_VD.idDeclarado > 0) {
      console.log('UPD_VD');
      this.actualizarVD();
    } else {
      console.log('CREATE_VD');
      this.crearVD();
    }
  }

  actualizarVD(){
    const formValues = this.ventadeclaradaForm.getRawValue();

    const requestVD = {
      idActa            : this.DATA_VD.idActa,
      periodo           : this.utilService.generarPeriodo(formValues.periodo),
      montoDeclarado    : formValues.montoDeclarado,
      comentario        : formValues.comentario,
      idUsuarioActualiza: this.userID
    }
    this.actasService.actualizarVentaDeclarada(this.DATA_VD.idDeclarado, requestVD ).subscribe((resp: any) => {
      if (resp.success) {
        Swal.fire({
          title: 'Actualizar venta declarada!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      }
    })
  };

  crearVD(){
    const formValues = this.ventadeclaradaForm.getRawValue();
    const request = {
      idActa           : this.DATA_VD,
      periodo          : this.utilService.generarPeriodo(formValues.periodo),
      montoDeclarado   : formValues.montoDeclarado,
      comentario       : formValues.comentario,
      idUsuarioCreacion: this.userID
    };
    this.actasService.crearVentaDeclarada(request).subscribe((resp:any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear venta declarada!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.close(true);
      }
    })
  }

  actionBtn: string = 'Crear'
  cargarVentaDeclaradaById(): void {
    this.blockUI.start('Cargando venta declarada ...');

    if (this.DATA_VD) {
      this.actionBtn = 'Actualizar'
      this.actasService.cargarVentaDeclaradaById(this.DATA_VD.idDeclarado).subscribe((vd:any) => {
        this.blockUI.stop();
        console.log('VD_BY_ID', vd);

        this.ventadeclaradaForm.reset({
          idDeclarado   : vd.idDeclarado,
          idActa        : vd.idActa,
          periodo       : vd.periodo,
          montoDeclarado: vd.montoDeclarado,
          comentario    : vd.comentario
        })
      })
    }
  }


  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     console.log('ID-USER', this.userID);
   })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectos = resp;
    })
  }

  listEstadoDetActa: any[] = [];
  getAllEstadosDetActa(){
    this.actasService.getAllEstadosDetActa().subscribe(resp => {
      this.listEstadoDetActa = resp.filter((x:any) => x.eliminacion_logica == 1 );
      // console.log('EST_DET_ACTA', this.listEstadoDetActa);
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
    if (this.ventadeclaradaForm.get(campo)?.invalid && this.ventadeclaradaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

}

