import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import chartDataLabels from 'chartjs-plugin-datalabels';
import * as XLSX from 'xlsx';
import { VisorService } from 'src/app/core/services/visor.service';
import { removeDuplicateObjects } from 'src/app/core/util/util';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalDpfPendienteComponent } from './modal-dpf-pendiente/modal-dpf-pendiente.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-visor-fact',
  templateUrl: './visor-dpf.component.html',
  styleUrls: ['./visor-dpf.component.scss']
})
export class VisorDpfComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;

  resultado: any[] = [];
  listDPF  : any[] = [];
  resultadoNV: any;
  sum!: number;

  activeTab: string = 'Dpf_Alo';
  onTabClick(tab: string) {
    this.activeTab = tab;
  }

  constructor(private visorService: VisorService,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ){}

  pieChartOptions: any = {
    responsive: true,
    onClick: function (e: any) {
      var element = this.getElementAtEvent(e);
      if (element.length) {
          (<HTMLInputElement>document.getElementById('ckh2h')).value = element[0]._view.label + '|e';
          (<HTMLInputElement>document.getElementById('ckh2h')).click();
          console.log('PIE-DPF',element[0]._view.label)
        }
      },
  };

  pieChartLabels: Label[] = ['Cargando.', 'Cargando..', 'Cargando...', 'Cargando...', 'Cargando...', 'Cargando...'];
  pieChartData  : SingleDataSet = [1, 2, 3, 4, 5, 6];
  pieChartType  : ChartType = 'pie';
  pieChartLegend  = true;
  pieChartPlugins = [chartDataLabels];
  barChartOptions: any = {
  responsive: true,
  onClick: function (e: any) {
    var element = this.getElementAtEvent(e);
    if (element.length) {

        (<HTMLInputElement>document.getElementById('ckh2h')).value = element[0]._view.label + '|f';
        (<HTMLInputElement>document.getElementById('ckh2h')).click();
        console.log(element[0]._view.label)
      }
    }
  };

  barChartLabels: Label[] = [];
  barChartType  : ChartType = 'bar';
  barChartLegend  = true;
  barChartPlugins = [chartDataLabels];
  barChartData: ChartDataSets[] = [{ data: [], label: '' }];

  name = 'dwdFacturas.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('tbRes');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

  ngOnInit(){
    this.getListDPF();
    // this.newFilfroForm()
    // this.cargarOBuscarListVD()

    // // PERIODOS VALIDOS - OJO *******************************
    // console.log('TOTAL-CORR',this.modificarMes(-1)); //2023-08
    // console.log('[1-30]'  , this.modificarMes(-2));  //2023-07
    // console.log('[31-60]' , this.modificarMes(-3));  //2023-06
    // console.log('[61-90]' , this.modificarMes(-4));  //2023-05
    // console.log('[91-120]', this.modificarMes(-5));  //2023-04
    // console.log('[121-150]',this.modificarMes(-6));  //2023-03
    // console.log('[151-180]',this.modificarMes(-7));  //2023-02
    // console.log('[181-210]',this.modificarMes(-8));  //2023-01
    // console.log('[211-240]',this.modificarMes(-9));  //2022-12
    // console.log('[241-270]',this.modificarMes(-10)); //2022-11
    // console.log('[271-300]',this.modificarMes(-11)); //2022-10
    // console.log('[301-340]',this.modificarMes(-12)); //2022-09
    // console.log('[301-340]',this.modificarMes(-13)); //2022-08
    // console.log('[301-340]',this.modificarMes(-14)); //2022-07
    // console.log('[301-340]',this.modificarMes(-15)); //2022-06
    // console.log('[301-340]',this.modificarMes(-16)); //2022-05
    // console.log('[301-340]',this.modificarMes(-17)); //2022-04
    // console.log('[301-340]',this.modificarMes(-18)); //2022-03
    // console.log('[301-340]',this.modificarMes(-19)); //2022-02
    // console.log('[301-340]',this.modificarMes(-20)); //2022-01
  }

  filtroForm!: FormGroup;
  newFilfroForm(){
    this.filtroForm = this.fb.group({
      f_periodo          : ['']
    })
  };

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})
    this.newFilfroForm()
  }

  modificarMes(mes: any) {
    var date1 = new Date()
    var date = new Date( date1.getFullYear().toString() + '/'+ (date1.getMonth()+1).toString() + '/' + '01');
    // console.log('DATE-2023', date1.getFullYear().toString(), (date1.getMonth()+1).toString()); //2023-9

    // var date = new Date('2023/04/03');
    /* Javascript recalculará la fecha si el mes es menor de 0 (enero) o mayor de 11 (diciembre) */
    date.setMonth(date.getMonth() + mes);

    return date.toISOString().substring(0, 7); /* Obtenemos la fecha en formato YYYY-mm */
  }

  // modificarMesII(meses: number){
  //   const fecha = new Date('2023/08/30'); //OJO: Fecha actual 2023/08/31
  //   const mes = fecha.getMonth(); // Rpta:7 Mes actual

  //   fecha.setMonth(fecha.getMonth() + meses);
  //   while (fecha.getMonth() == mes) {
  //     fecha.setDate(fecha.getDate() - 1);
  //   }

  //   return  fecha.toISOString().substring(0, 7); //28/02/2022
  // }

  filtrarPorPeriodo(periodo: string, nombreCampo: string, proy: string): any{
    const dpfItem = this.resultado.find( item => item.per_vd == periodo && item.proyecto == proy)
    // console.log('FILTRO', dpfItem); //Rpta: {dpf:49091.67, per_vd:"07/2021" ,proyecto:"TRAPRO", sum_facturados:423685.22, sum_vd:472776.89}

    return dpfItem? dpfItem[nombreCampo]: 0;
  }


  dataDPF(nameProy: string, per:number){
    // const dpf = this.filtrarPorPeriodo( moment(this.modificarMes(per)).format("Y-MM"), 'dpf', nameProy)
    const dpf = this.filtrarPorPeriodo( this.modificarMes(per), 'dpf', nameProy)

    return (dpf > 5 || dpf <= -5)? dpf: 0;
  }

  dpfVencidos(proy:string){
    var suma:any = 0;
      for (let i = 2; i < 54; i++) { //Suma de DPF vencidos desde [1-30] a [>365]
        if (this.dataDPF(proy, -i) > 0) {
          suma = suma +  this.dataDPF(proy, -i)
        }
    }
      return (suma > 5 )? suma: '';
  }

  aloVencidos(proy:string){
    var suma:any = 0;
      for (let i = 2; i < 54; i++) {
        if (this.dataDPF(proy, -i)<0) {
          suma = suma +  (this.dataDPF(proy, -i) ) // 12,11,10,9,8,7 dataDpf022JAS
        }
      }
      return (suma < -5)? suma: '';
  }

  dpfAloVencidos(proy:string){
    var suma:any = 0;
      for (let i = 2; i < 54; i++) { //Suma de DPF vencidos desde [1-30] a [>365]
          suma = suma +  this.dataDPF(proy, -i)
    }
      return (suma > 5 || suma < 5)? suma: '';
  }

  dpf91_180(proy:string){
    let sumaDpf = 0;
      for (let i = 5; i < 8; i++) {
        if (this.dataDPF(proy, -i)>0) {
          sumaDpf = sumaDpf +  this.dataDPF(proy, -i)
        }
      }
    return sumaDpf? sumaDpf: 0 ;
  }

  alo91_180(proy:string){
    let suma = 0;
      for (let i = 5; i < 8; i++) {
        if (this.dataDPF(proy, -i)<0) {
          suma = suma +  this.dataDPF(proy, -i)
        }
      }
    return suma? suma: 0 ;
  }

  dpfAlo91_180(proy:string){
    let suma = 0;   //NOTA: -5,-6,-7(E,M,A)
      for (let i = 5; i < 8; i++) { //i=4 : (E,F,M:4,5,6) | 2023(E,F,M): -6,-5,-4   | (J,Jn,M, A):7,6,5,4
        if (this.dataDPF(proy, -i)<0 || this.dataDPF(proy, -i)>0) {
          suma = suma +  this.dataDPF(proy, -i)
        }
      }
    return suma? suma: 0 ;
  }

  dpf181_365(proy:string){
    var suma181_365:any = 0;
      for (let i = 8; i < 14; i++) {

        if (this.dataDPF(proy, -i) > 0) {
          suma181_365 = suma181_365 +  this.dataDPF(proy, -i) // 12,11,10,9,8,7 dataDpf022JAS
        }
      }
      return (suma181_365 == 0)? 0 : suma181_365;
  }

  alo181_365(proy:string){
    var suma181_365:any = 0;
      for (let i = 8; i < 14; i++) { //i=7,8,9,10,11,12: D,N,O,S,A,J (2022) : -7,-8,-9,-10,-11,-12

        if (this.dataDPF(proy, -i) < 0) {
          suma181_365 = suma181_365 +  this.dataDPF(proy, -i) // 12,11,10,9,8,7 dataDpf022JAS
        }
      }
      return (suma181_365 == 0)? 0 : suma181_365;
  }

  dpfAlo181_365(proy:string){
    var suma:any = 0;
      for (let i = 8; i < 14; i++) {
        if (this.dataDPF(proy, -i) < 0 || this.dataDPF(proy, -i) > 0) {
          suma = suma +  this.dataDPF(proy, -i)
        }
      }
      return (suma == 0)? 0 : suma;
  }

  dpfMayor365(proy:string){
    var sumaDpfx = 0;
      for (let i = 14; i < 54; i++) { //i=13,14,15,16,17,18: (2022)Jn,M,A,M,F,E | (2021)D,N,O,S,A,J,Jn,M,A,M,F,E | 12(2020) | 12(2019)
                                                                               // (2021)19,20,21,22,23,24,25,26,27,28,29,30 |(2020)[31->42] | (2019)[43->54] 31+12=43
        if (this.dataDPF(proy, -i) > 0) {
          sumaDpfx = sumaDpfx +  this.dataDPF(proy, -i)
        }
      }
      return (sumaDpfx > 5 || sumaDpfx <= -5)? sumaDpfx: 0
  }

  aloMayor365(proy:string){
    var sumaDpfx = 0;
      for (let i = 14; i < 54; i++) {
        if (this.dataDPF(proy, -i) < 0) {
          sumaDpfx = sumaDpfx +  this.dataDPF(proy, -i)
        }
      // console.log('>365', sumaDpfx);
      }
      return (sumaDpfx > 5 || sumaDpfx <= -5)? sumaDpfx: 0
  }

  dpfAloMayor365(proy:string){
    var sumaDpfx = 0;
      for (let i = 14; i < 54; i++) {
        // if (this.dataDPF(proy, -i) < 0) {
          sumaDpfx = sumaDpfx +  this.dataDPF(proy, -i)
        // }
      // console.log('>365', sumaDpfx);
      }
      return (sumaDpfx > 5 || sumaDpfx <= -5)? sumaDpfx: 0
  }


  dataDpfTOTAL(proy:string){
    var totalDpfVencidos:any = 0;
      for (let i = 1; i < 54; i++) {
        if (this.dataDPF(proy, -i)>0) {
          totalDpfVencidos = totalDpfVencidos +  this.dataDPF(proy, -i)
        }
      }

      return (totalDpfVencidos > 5 || totalDpfVencidos < -5)? totalDpfVencidos: '';
  }

  dataAloTOTAL(proy:string){
    var totalDpfVencidos:any = 0;
      for (let i = 1; i < 54; i++) {
        if (this.dataDPF(proy, -i)<0) {
          totalDpfVencidos = totalDpfVencidos +  this.dataDPF(proy, -i)
        }
      }

      return (totalDpfVencidos > 5 || totalDpfVencidos < -5)? totalDpfVencidos: '';
  }

  dataDpfAloTOTAL(proy:string){
    var totalDpfVencidos:any = 0;
      for (let i = 1; i < 54; i++) {
        if (this.dataDPF(proy, -i) > 0 || this.dataDPF(proy, -i) < 0) {
          totalDpfVencidos = totalDpfVencidos +  this.dataDPF(proy, -i) // 12,11,10,9,8,7 dataDpf022JAS
        }
      }

      return (totalDpfVencidos > 5 || totalDpfVencidos < -5)? totalDpfVencidos: '';
  }

  listadoDPF: any[] = [];
  getListDPF(){
    this.blockUI.start("Cargando listado DPF/ALO...");

    this.visorService.getListDpf().subscribe((resp: any[]) => {
      this.blockUI.stop();

      this.resultado = resp; //Almacenamos toda la lista de dpf que viene desde la BD

      this.listDPF = removeDuplicateObjects(resp, 'proyecto');
      console.log('DPF',this.listDPF, );
      // console.log('ABC',moment(this.modificarMes(-4)).format("Y-MM"), this.filtrarPorPeriodo(moment(this.modificarMes(-4)).format("Y-MM"), 'dpf', 'TDPFAC'));
      console.log('TQACOR',this.modificarMes(-1), this.filtrarPorPeriodo(this.modificarMes(-1), 'dpf', 'TQACOR'));
      // console.log('DPF_VENCIDO', this.DPFVencidoFacturado('TPSNEG'));











      // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
      this.suma();
      function groupBy(objectArray: any[], property: string) {
          return objectArray.reduce(function (acc: { [x: string]: any[]; }, obj: { [x: string]: any; }) {
              var key = obj[property];
              if (!acc[key]) {
                  acc[key] = [];
              }
              acc[key].push(obj);
              return acc;
          }, {});
      }

      const groupedData = groupBy(this.listDPF, 'proyecto');
      const reducedData = [];

      for (let key in groupedData) {
          let initialValue = 0;
          let sum = groupedData[key].reduce((accumulator: string | number, currentValue: { estado_proyecto: string; }) => {
            return +accumulator + (currentValue.estado_proyecto!="Derivado"?1:0);
        },initialValue)

        let sumd = groupedData[key].reduce((accumulator: string | number, currentValue: { estado_proyecto: string; }) => {
          return +accumulator + (currentValue.estado_proyecto=="Derivado"?1:0);
      },initialValue)

          reducedData.push({
              Derivados: sumd,
              Planificados: sum,
              fecha: key
          });
      }

      this.barChartData = [{
        label: 'Proyecto',
        data: reducedData.sort((a,b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["Planificados"])
        },
      ]

      this.barChartLabels = reducedData.sort((a, b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["fecha"]);
      // console.log('Fecha', res);

      var res0 = [];

      res0 = this.listDPF.reduce((p: { [x: string]: number; }, n: { periodo: string | number; }) => {
          if (p[n.periodo]) { p[n.periodo] += 1; }
          else { p[n.periodo] = 1; }
          return p;
      }, []);

      var res = [];
      for (var x in res0) {
          res0.hasOwnProperty(x) && res.push(res0[x])

      }
      this.pieChartData = res;

      var res = [];
      for (var x in res0) {
          res0.hasOwnProperty(x) && res.push(x)
      }
      this.pieChartLabels = res;

    }, error => console.error(error));
  }

  // events
  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
      alert("hola");
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
      alert("hola");
  }

  filtrar(flt: any) {
      // Only Change 3 values
      var inputValue = (<HTMLInputElement>document.getElementById('ckh2h')).value;
      var arrayDeCadenas = inputValue.split("|");

      this.listDPF = this.resultado;
      if (arrayDeCadenas[1] == "e") {
          this.listDPF = this.listDPF.filter((task: { periodo: string; }) => task.periodo == arrayDeCadenas[0]);

      }
      else {
          this.listDPF = this.listDPF.filter((task: { proyecto: string; }) => task.proyecto == arrayDeCadenas[0]);
      }
      this.suma();

      (<HTMLInputElement>document.getElementById('titulo')).innerText = "Facturas:: " + arrayDeCadenas[0] + "(" + this.sum.toLocaleString('es-PE') + ")";
  }

  suma()
  {
      this.sum = this.listDPF.map((a: { monto_facturado: any; }) => a.monto_facturado).reduce(function(a: any, b: any)
      {
        return a + b;
      })
      console.log('SUMA', this.sum);
  }

  abrirDpfPendiente(byProyecto: string) {
    console.log('PROYECTO_PEND_BY_GESTOR:', byProyecto);

    const dialogRef = this.dialog.open(ModalDpfPendienteComponent, { width: '45%',data: byProyecto});
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.getListDPF();
      }
    });
  }
}
