import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { EntidadService } from 'src/app/core/services/entidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-entidadtabla',
  templateUrl: './modal-entidadtabla.component.html',
  styleUrls: ['./modal-entidadtabla.component.scss']
})
export class ModalEntidadtablaComponent implements OnInit {

  userID: number = 0;
  entidadTablaForm!: FormGroup;

  constructor(
    private entidadService: EntidadService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalEntidadtablaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_ENTIDAD: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListEntidades();
    this.cargarTablaEntidadByID();
    // this.cargarOBuscarEntidades(1);
    // console.log('DATA_TABLA_E', this.DATA_ENTIDAD, this.DATA_ENTIDAD.eForm);
  }

  newForm(){
    this.entidadTablaForm = this.fb.group({
      id           : [''],
      nombre       : ['', Validators.required],
      descripcion  : [''],
      entidad      : [''],
      idPadre      : [''],
      idCorrelativo: [''],
      id_tabla     : ['']
    })
  }

  agregarOactualizarTablaEntidad(){
    if (!this.DATA_ENTIDAD) {
      return
    }

    if (this.DATA_ENTIDAD.isCreation) {
      if (this.entidadTablaForm.valid) {this.agregarEntidadTabla()}
    } else {
      this.actualizarTablaEntidad();
    }
  }


  agregarEntidadTabla() {
    this.spinner.show();
    const formValues = this.entidadTablaForm.getRawValue();

    let parametro: any =  {
        queryId: 50,
        mapValue: {
          "param_nombre"        : formValues.nombre,
          "param_descripcion"   : formValues.descripcion,
          "param_id_padre"      : formValues.idPadre,
          "param_id_tabla"      : this.DATA_ENTIDAD.eForm.entidad,
          "CONFIG_USER_ID"      : this.userID,
          "CONFIG_OUT_MSG_ERROR": '',
          "CONFIG_OUT_MSG_EXITO": ''
        },
      };

     console.log('TABLA-ENT-AGREGADO', this.entidadTablaForm.value , parametro);
    this.entidadService.agregarEntidadTabla(parametro).subscribe((resp: any) => {

      Swal.fire({
        title: 'Agregar Entidad!',
        text: `Entidad: ${formValues.nombre}, creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  actualizarTablaEntidad(){
    this.spinner.show();

    const formValues = this.entidadTablaForm.getRawValue();
    let parametro: any[] = [{
        queryId: 56,
        mapValue: {
          "param_id"         : formValues.id ,
          "param_tabla"      : formValues.id_tabla,
          "param_correlativo": formValues.idCorrelativo,
          "param_nombre"     : formValues.nombre,
          "param_descripcion": formValues.descripcion,
          "param_padre"      : formValues.idPadre,
          "CONFIG_USER_ID"   : this.userID,
          "CONFIG_OUT_MSG_ERROR":'',
          "CONFIG_OUT_MSG_EXITO":''
        },
      }];

    this.entidadService.actualizarTablaEntidad(parametro[0]).subscribe( {next: (resp) => {
      this.spinner.hide();

      this.cargarTablaEntidadByID();
      this.dialogRef.close('Actualizar')

      Swal.fire({
        title: 'Actualizar Entidad!',
        text : `Entidad:  ${formValues.nombre }, actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    }, error: () => {
      Swal.fire(
        'ERROR',
        'No se pudo actualizar la entidad',
        'warning'
      );
    }});
  };

  btnAction: string = 'Agregar'
  cargarTablaEntidadByID(){
    if (!this.DATA_ENTIDAD.isCreation) {
      this.btnAction = 'Actualizar'
        this.entidadTablaForm.controls['id'           ].setValue(this.DATA_ENTIDAD.id);
        this.entidadTablaForm.controls['idCorrelativo'].setValue(this.DATA_ENTIDAD.id_correlativo);
        this.entidadTablaForm.controls['nombre'       ].setValue(this.DATA_ENTIDAD.nombre);
        this.entidadTablaForm.controls['descripcion'  ].setValue(this.DATA_ENTIDAD.descripcion);
        this.entidadTablaForm.controls['entidad'      ].setValue(this.DATA_ENTIDAD.entidad);
        this.entidadTablaForm.controls['id_tabla'     ].setValue(this.DATA_ENTIDAD.id_tabla)
        this.entidadTablaForm.controls['idPadre'      ].setValue(this.DATA_ENTIDAD.idPadre);
    }
  }

  listEntidad: any[] = [];
  getListEntidades(){
    let parametro: any[] = [{queryId: 47}];

    this.entidadService.getListEntidades(parametro[0]).subscribe((resp: any) => {
      this.listEntidad = resp.list;
      // console.log('List-Ent', this.listEntidad, this.listEntidad.length);
    });
  }

  campoNoValido(campo: string): boolean {
    if ( this.entidadTablaForm.get(campo)?.invalid && this.entidadTablaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  userId() {
    this.authService.getCurrentUser().subscribe((resp) => {
      this.userID = resp.userId;
      // console.log('ID-USER', this.userID);
    });
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

}
