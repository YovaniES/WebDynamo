import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { CrearLiquidacionComponent } from '../liquidacion/crear-liquidacion/crear-liquidacion.component';
import { ActualizarLiquidacionComponent } from '../liquidacion/actualizar-liquidacion/actualizar-liquidacion.component';
import { ActualizacionMasivaComponent } from './actualizacion-masiva/actualizacion-masiva.component';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { ModalComentarioComponent } from './modal-comentario/modal-comentario.component';
import * as XLSX from 'xlsx';
import { LiquidacionModel } from 'src/app/core/models/liquidacion.models';
import { mapearImportLiquidacion } from 'src/app/core/mapper/liquidacion-list.mapper';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { concatMap, of } from 'rxjs';

@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.scss']
})

export class LiquidacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  liquidacionForm!: FormGroup;

  page = 1;
  totalFacturas: number = 0;
  pageSize = 15;

  constructor(
    private facturacionService: FacturacionService,
    private exportExcellService: ExportExcellService,
    private liquidacionService: LiquidacionService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarLiquidacion();
    this.getListEstados();
    this.getListProyectos();
    this.getListGestores();
    this.getListLiquidaciones();
    this.exportListVD_Fact();
  }

  newFilfroForm(){
    this.liquidacionForm = this.fb.group({
      codFact            : [''],
      id_proy            : [''],
      id_liquidacion     : [''],
      id_estado          : [''],
      fechaRegistroInicio: [''],
      fechaRegistroFin   : [''],
      id_gestor          : [''],
      importe            : [''],
      subservicio        : [''],
      f_periodo          : [''],

      importar           : ['']
    })
  };

  importacion = 0;
  dataLiqImport: any[] = [];
  readExcell(e: any){
    console.log('|==>',e, this.liquidacionForm);
    this.importacion ++
    this.blockUI.start("Espere por favor, estamos Importando la Data, importación N°: " + this.importacion) ;

    let file = e.target.files[0];
    let fileReader = new FileReader();

    fileReader.readAsBinaryString(file)

    fileReader.onload = e => {
      var wb = XLSX.read(fileReader.result, { type: 'binary', cellDates: true})
      // console.log('****', wb);
      var sheetNames = wb.SheetNames;

      this.dataLiqImport = XLSX.utils.sheet_to_json(wb.Sheets[sheetNames[0]])

      console.log('DATA_EXCELL', this.dataLiqImport);

      this.liquidacionForm.controls['importar'].reset()
      this.liquidacionForm.controls['importar'].setValue(null)

      // this.validarImportacionExcell();
      this.insertarListaLiquidacion();

      this.blockUI.stop();
    }
  }

  insertarListaLiquidacion(){
    this.spinner.show();
    const listaImportado: LiquidacionModel[] = mapearImportLiquidacion(this.dataLiqImport, )

    this.liquidacionService.insertarListadoLiquidacion(listaImportado)
        .pipe(concatMap((resp: any) => {
          console.log('DATA-IMP-LIQ', resp);// {message: "ok"}
             return resp && resp.message == 'ok';
            //  return resp && resp.message == 'ok'? this.scoreService.actualizarScore(parametro[0]): of({})
      })).subscribe((resp: any) => {
        console.log('DATA_LIQ-SAVE', resp);
      if (resp) {
        Swal.fire({
          title: 'Importar Liquidación!',
          text : `Se importó con éxito la data`,
          icon : 'success',
          confirmButtonText: 'Ok'
        });
        this.spinner.hide();
        this.cargarOBuscarLiquidacion();
      }
     }
   )}


  listaLiquidacion: any[] = [];
  cargarOBuscarLiquidacion(){
    this.blockUI.start("Cargando liquidaciones...");
    let parametro: any[] = [{
      "queryId": 118,
      "mapValue": {
          cod_fact       : this.liquidacionForm.value.codFact,
          id_proy        : this.liquidacionForm.value.id_proy,
          id_liquidacion : this.liquidacionForm.value.id_liquidacion,
          id_estado      : this.liquidacionForm.value.id_estado,
          id_gestor      : this.liquidacionForm.value.id_gestor,
          importe        : this.liquidacionForm.value.importe,
          subservicio    : this.liquidacionForm.value.subservicio,
          f_periodo      : this.liquidacionForm.value.f_periodo,
          // f_periodo         : this.datepipe.transform(this.liquidacionForm.value.f_periodo,"yyyy/MM/dd"),
          inicio         : this.datepipe.transform(this.liquidacionForm.value.fechaRegistroInicio,"yyyy/MM/dd"),
          fin            : this.datepipe.transform(this.liquidacionForm.value.fechaRegistroFin,"yyyy/MM/dd"),
      }
    }];
    this.facturacionService.cargarOBuscarLiquidacion(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Liquidaciones', resp.list, resp.list.length);
      this.listaLiquidacion = [];
      this.listaLiquidacion = resp.list;

      this.spinner.hide();
    });
  }


  eliminarLiquidacion(id: number){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 122,
      mapValue: {
        p_idFactura: id,
      }
    }];
    Swal.fire({
      title: '¿Eliminar Liquidación?',
      text: `¿Estas seguro que deseas eliminar la Liquidación: ${id}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if (resp.value) {
        this.facturacionService.eliminarLiquidacion(parametro[0]).subscribe(resp => {

          this.cargarOBuscarLiquidacion();

            Swal.fire({
              title: 'Eliminar Liquidación',
              text: `La Liquidación: ${id}, fue eliminado con éxito`,
              icon: 'success',
            });
          });
      }
    });
    this.spinner.hide();
  }

  listEstados: any[] = [];
  getListEstados(){
    let parametro: any[] = [{queryId: 101}];

    this.facturacionService.getListEstados(parametro[0]).subscribe((resp: any) => {
            this.listEstados = resp.list;
            // console.log('EST-FACT', resp);
    });
  }

  listVD_Fact: any[] = [];
  exportListVD_Fact(){
    let parametro: any[] = [{queryId: 136}];

    this.facturacionService.exportListVD_Fact(parametro[0]).subscribe((resp: any) => {
            this.listVD_Fact = resp.list;
            // console.log('EXPORT-VD_FACT', resp);
    });
  }

  listGestores: any[] = [];
  getListGestores(){
    let parametro: any[] = [{queryId: 102}];

    this.facturacionService.getListGestores(parametro[0]).subscribe((resp: any) => {
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

  listLiquidaciones: any[] = [];
  getListLiquidaciones(){
    let parametro: any[] = [{queryId: 82}];
    this.facturacionService.getListLiquidaciones(parametro[0]).subscribe((resp: any) => {
            this.listLiquidaciones = resp.list;
            // console.log('LIQUIDAC', resp);
    });
  }

  limpiarFiltro() {
    this.liquidacionForm.reset('', {emitEvent: false})
    this.newFilfroForm()

    this.cargarOBuscarLiquidacion();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalFacturas) {
      this.facturacionService.cargarOBuscarLiquidacion(offset.toString()).subscribe( (resp: any) => {
            this.listaLiquidacion = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  crearLiquidacion(){
    const dialogRef = this.dialog.open(CrearLiquidacionComponent, {width:'55%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarLiquidacion()
      }
    })
  }

  duplicarLiquidacion(DATA: any){
    console.log('ENV_DATA', DATA);

    const dialogRef = this.dialog.open(CrearLiquidacionComponent, {width:'55%', data: DATA});
    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarLiquidacion()
      }
    })
  }


  abrirComentarioRegularizacion(dataComentario: string) {
    console.log('DATA_DETALLE', dataComentario);

    const dialogRef = this.dialog.open(ModalComentarioComponent, { width: '60%',data: dataComentario});
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.cargarOBuscarLiquidacion();
      }
    });
  }

  actualizacionMasiva(){
    const dialogRef = this.dialog.open(ActualizacionMasivaComponent, {width:'20%', });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarLiquidacion()
      }
    })
  }

  actualizarFactura(DATA: any) {
    // console.log('DATA_LIQUID', DATA);

    this.dialog
      .open(ActualizarLiquidacionComponent, { width: '70%', height: '80%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarLiquidacion();
        }
      });
  }

  exportarRegistro(){
    this.exportExcellService.exportarExcel(this.listaLiquidacion, 'Factura_Filtro')
  }

  exportarVD_FACT(){
    this.exportExcellService.exportarExcel(this.listVD_Fact, 'FACTURACION-VENT_DECLARADA')
  }
}


