import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enviar-correo',
  templateUrl: './enviar-correo.component.html',
  styleUrls: ['./enviar-correo.component.scss']
})
export class EnviarCorreoComponent implements OnInit {
  @ViewChild('tabla') tabla!: ElementRef;

  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  mailForm!: FormGroup;

  page = 1;
  totalPeriodoLider: number = 0;
  pageSize = 4;

  constructor(
    private vacacionesService: VacacionesPersonalService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialogRef: MatDialogRef<EnviarCorreoComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_PERSONA: any
  ) { }

  ngOnInit(): void {
    this.getListEstadoVacaciones();
    this.getListAdminVacaciones();
    this.newFilfroForm();
    // console.log('ID_PERSON_REC', this.DATA_PERSONA);
  }

  newFilfroForm(){
    this.mailForm = this.fb.group({
      id_responsable: ['', Validators.required],
      id_estado_per : ['', Validators.required],
      destinatario  : ['', Validators.required],
      mensaje       : [''],
    })
  }

  listLiderMail: any[] = [];
  cargarOBuscarCorreoLider(){
    this.listLiderMail = [];

    this.blockUI.start("Cargando periodos...");
    let parametro: any[] = [{
      "queryId": 147,
      "mapValue": {
        p_id_responsable: this.mailForm.value.id_responsable,
        p_id_per_estado : this.mailForm.value.id_estado_per,
      }
    }];

    this.vacacionesService.cargarOBuscarCorreoLider(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('LISTA DE PERIOX', resp, resp.list.length);
      this.listLiderMail = resp.list;

      this.spinner.hide();
    });
  }

  limpiarFiltro() {
    this.mailForm.reset('', {emitEvent: false})
    this.newFilfroForm();

    this.cargarOBuscarCorreoLider();
  };

  listPageDisp: any[] = [];
  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalPeriodoLider) {
      this.vacacionesService.cargarOBuscarCorreoLider(offset.toString()).subscribe( (resp: any) => {
            this.listPageDisp = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  listEstadoVacaciones: any[] = [];
  getListEstadoVacaciones(){
  let parametro: any[] = [{ queryId: 148}];
  this.vacacionesService.getListEstadoVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listEstadoVacaciones = resp.list;
    // console.log('VACAC-ESTADO', resp.list);
    })
  }

  listAdminVacaciones: any[] = [];
  getListAdminVacaciones(){
  let parametro: any[] = [{ queryId: 127}];
  this.vacacionesService.getListAdminVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listAdminVacaciones = resp.list;
    console.log('RESPONSABLES-VACAS', resp.list);
    })
  }

  asignarCorreo(){
    console.log('TEXT');
    const selectLider = this.listAdminVacaciones.find( admin => admin.id == this.mailForm.controls['id_responsable'].value);

    this.mailForm.controls['destinatario'].setValue(selectLider? selectLider.username: '');
  }

  // generarHtmlCorreo(){
  //   const body2 = {
  //     from: "abc@gmail.com",
  //     to: this.mailForm.controls['destinatario'].value ,
  //     body:
  //       `<html lang="es">
  //       <head>
  //         <meta charset="utf-8" />
  //         <title>REGISTRAR VACACIONES</title>
  //       </head>
  //       <body style="background-color: #f8f9fa">
  //         <table
  //           style="max-width: 2000px;padding: 10px;margin: 0 auto;border-collapse: collapse;">
  //           <tr>
  //             <td style="color: #fff; background: darkgray">
  //               <div class="row g-3" style="text-align: center; height: 10%">
  //                 <div class="col-sm-3" style="background: #267d7d; padding: 4px">
  //                   Registro de vacaciones
  //                 </div>
  //                 <div class="col-sm-9"><mat-icon></mat-icon></div>
  //               </div>
  //             </td>
  //           </tr>
  //           <tr>
  //             <td style="background-color: #fff">
  //               <div style="color: #34495e;margin: 4% 10% 2%;text-align: justify;font-family: sans-serif;">
  //                 <h2 style="color: #ffc107; margin: 0 0 7px">RECORDATORIO</h2>
  //                 <p style="margin: 2px; font-size: 14px; color: #a6a6a6">
  //                   Los siguientes colaboradores aún no registran sus vacaciones en
  //                   Jira y/o Dedicaciones:
  //                   <br />
  //                 </p>
  //                 ${this.mailForm.controls['mensaje'].value}
  //                 <p style="margin: 2px; font-size: 14px; color: #297272"></p>
  //                 <table style="width: 100%; background-color: #fff">
  //                   <thead>
  //                     <tr style="background: #0daef4; color: #fff">
  //                       <th style="width: 40px;padding: 3px;font-weight: 300;text-align: center;font-size: 11px;">N°</th>
  //                       <th style="width: 50px;padding: 3px;font-weight: 300;text-align: center;font-size: 11px;">Colaborador</th>
  //                       <th style="min-width: 185px;text-align: center;font-size: 11px;padding: 3px;font-weight: 300;text-align: center;font-size: 11px;">Correo responsable</th>
  //                       <th style="padding: 3px;font-weight: 300;text-align: center;font-size: 11px;">Fecha Inicio</th>
  //                       <th style="padding: 3px;font-weight: 300;text-align: center;font-size: 11px;">Fecha Fin</th>
  //                       <th style="padding: 3px;font-weight: 300;text-align: center;font-size: 11px;">Días</th>
  //                       <th style="padding: 3px;font-weight: 300;text-align: center;font-size: 11px;">Estado</th>
  //                     </tr>
  //                   </thead>

  //                   <tbody>
  //                     <tr *ngFor="let lider of listLiderMail; let i = index">
  //                       <td style="font-size: 11px">{{ i + 1 }}</td>
  //                       <td style="font-size: 11px; min-width: 174px; text-align: left">{{ lider.colaborador }}</td>
  //                       <td style="font-size: 11px">{{ lider.correo }}</td>
  //                       <td style="font-size: 11px">{{ lider.fecha_ini }}</td>
  //                       <td style="font-size: 11px">{{ lider.fecha_fin }}</td>
  //                       <td style="font-size: 11px; text-align: center">{{ lider.dias }}</td>
  //                       <td style="font-size: 11px">{{ lider.estado }}</td>
  //                     </tr>
  //                   </tbody>
  //                 </table>
  //                 <br/>
  //                 <p style="margin: 2px; font-size: 14px; color: #a6a6a6">gracias.</p>
  //                 <p style="color: #fff;
  //                     font-size: 14px;
  //                     text-align: center;
  //                     background: #267d7d;
  //                     margin: 30px 0 0;">
  //                   Copyright © INDRA 2022
  //                 </p>
  //               </div>
  //             </td>
  //           </tr>
  //         </table>
  //       </body>
  //     </html>`

  //     }
  // }

  enviarCorreo(){
    // console.log('ABC', this.tabla.nativeElement.innerHTML);

    const body = {
      from: "abc@gmail.com",
      to: this.mailForm.controls['destinatario'].value ,
      body : this.tabla.nativeElement.innerHTML
    }
    this.vacacionesService.enviarCorreo(body).subscribe();
    this.spinner.hide();

    Swal.fire({
      title: 'Enviar mensaje!',
      text : `El mensaje fue enviado con éxito`,
      icon : 'success',
      confirmButtonText: 'Ok',
    });
    this.close(true);
    this.spinner.show();
  }

  close(succes?: any) {
    this.dialogRef.close(succes);
  }
}
