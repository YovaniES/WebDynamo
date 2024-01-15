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
  this.cargarActaByVentaDeclarado();
  this.getAllProyecto();
  this.getAllEstadosActa();
  this.getUserID();
  console.log('DATA_ACTA***', this.DATA_VD);

  if (this.DATA_VD.ACTA.idDeclarado) {
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
     idProyecto     : [''],
     isVisado       : ['']
    })
  };

  cargarActaByVentaDeclarado(){
    if (this.DATA_VD.ACTA) {
      this.ventadeclaradaForm.reset({
        idProyecto    : this.DATA_VD.sub.idProyecto,
        periodo       : this.DATA_VD.sub.periodo,
        isVisado      : 0,
        montoDeclarado: this.DATA_VD.sub.venta_total - this.DATA_VD.sub.declarado
      })
    }
  }
  //

  // dpf91_180(proy:string){
  //   let sumaDpf = 0;
  //     for (let i = 5; i < 8; i++) {
  //       if (this.dataDPF(proy, -i)>0) {
  //         sumaDpf = sumaDpf +  this.dataDPF(proy, -i)
  //       }
  //     }
  //   return sumaDpf? sumaDpf: 0 ;
  // }

  // sumaDeclarados(){
  //   let declarado = 0;

  //   for (let i = 0; i < 4; i++) {

  //     declarado = declarado + 4
  //   }

  //   return declarado;
  // }

  crearOactualizarVD(){
    if (this.ventadeclaradaForm.invalid) {
      return Object.values(this.ventadeclaradaForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    if (this.DATA_VD.ACTA.idDeclarado > 0) {
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
      idDeclarado       : this.DATA_VD.ACTA.idDeclarado,
      idActa            : this.DATA_VD.ACTA.idActa,
      periodo           : this.utilService.generarPeriodo(formValues.periodo),
      montoDeclarado    : formValues.montoDeclarado,
      isVisado          : formValues.isVisado,
      idProyecto        : formValues.idProyecto,
      comentario        : formValues.comentario,
      idUsuarioActualiza: this.userID
    }
    this.actasService.actualizarVentaDeclarada(this.DATA_VD.ACTA.idDeclarado, requestVD ).subscribe((resp: any) => {
      if (resp.success) {
        Swal.fire({
          title: 'Actualizar venta declarada!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
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

  crearVD(){
    const formValues = this.ventadeclaradaForm.getRawValue();
    const request = {
      idActa           : this.DATA_VD.ACTA,
      periodo          : this.utilService.generarPeriodo(formValues.periodo),
      montoDeclarado   : formValues.montoDeclarado,
      isVisado         : formValues.isVisado,
      idProyecto       : formValues.idProyecto,
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

  actionBtn: string = 'Crear'
  cargarVentaDeclaradaById(): void {
    console.log('ID_VD', this.DATA_VD.ACTA.idDeclarado);

    this.blockUI.start('Cargando venta declarada ...');

    if (this.DATA_VD.ACTA.idDeclarado) {
      this.actionBtn = 'Actualizar'
      this.actasService.cargarVentaDeclaradaById(this.DATA_VD.ACTA.idDeclarado).subscribe((vd:any) => {
        this.blockUI.stop();
        console.log('VD_BY_ID', vd);

        this.ventadeclaradaForm.reset({
          idDeclarado   : vd.idDeclarado,
          idActa        : vd.idActa,
          periodo       : vd.periodo,
          idProyecto    : vd.idProyecto,
          isVisado      : vd.estado.estadoId,
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
  getAllEstadosActa(){
    this.liquidacionService.getAllEstadosActa().subscribe(resp => {
      this.listEstadoDetActa = resp;;
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

