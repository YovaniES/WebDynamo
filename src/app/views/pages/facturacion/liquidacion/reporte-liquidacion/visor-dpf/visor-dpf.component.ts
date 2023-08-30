import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import chartDataLabels from 'chartjs-plugin-datalabels';
import * as XLSX from 'xlsx';
import { VisorService } from 'src/app/core/services/visor.service';
import { removeDuplicateObjects } from 'src/app/core/util/util';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-visor-fact',
  templateUrl: './visor-dpf.component.html',
  styleUrls: ['./visor-dpf.component.scss']
})
export class VisorDpfComponent implements OnInit {
  resultado: any[] = [];
  listDPF  : any[] = [];
  resultadoNV: any;
  sum!: number;

  activeTab: string = 'Dpf';
  onTabClick(tab: string) {
    this.activeTab = tab;
  }

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

  constructor(private visorService: VisorService,
              public datepipe: DatePipe,){}

  ngOnInit(){
    this.getListDPF();
  }

  modificarMes(meses: number){
    const fecha = new Date();
    const mes = fecha.getMonth(); // Rpta:7

    fecha.setMonth(fecha.getMonth() + meses);
    while (fecha.getMonth() == mes) {
      fecha.setDate(fecha.getDate() - 1);
    }

    return  fecha; //28/02/2022
  }

  filtrarPorPeriodo(periodo: string, nombreCampo: string, proy: string): any{
    const dpfItem = this.resultado.find( item => item.per_vd == periodo && item.proyecto == proy)
    // console.log('FILTRO', dpfItem); //Rpta: {dpf:49091.67, per_vd:"07/2021" ,proyecto:"TRAPRO", sum_facturados:423685.22, sum_vd:472776.89}

    return dpfItem? dpfItem[nombreCampo]: 0;
  }

  dataDPF(nameProy: string, per:number){
    const dpf = this.filtrarPorPeriodo( moment(this.modificarMes(per)).format("Y-MM"), 'dpf', nameProy)
    // OJO TENER EN CUENTA: PRUEBA CON FECHA (29/08/2023)
    // console.log('DPF2',dpf, moment(this.modificarMes(-1)).format("Y-MM")); // 0 | 2023-07
    // console.log('PER-ACTUAL1', moment(this.modificarMes(0)).format("Y-MM"),);  //2023-07
    // console.log('PER-ACTUAL2', moment(this.modificarMes(-1)).format("Y-MM"),); //2023-07
    // console.log('PER-ACTUAL3', moment(this.modificarMes(-2)).format("Y-MM"),); //2023-06
    // console.log('PER-ACTUAL4', moment(this.modificarMes(-3)).format("Y-MM"),); //2023-05
    // console.log('PER-ACTUAL3', moment(this.modificarMes(-4)).format("Y-MM"),); //2023-04
    // console.log('PER-ACTUAL4', moment(this.modificarMes(-5)).format("Y-MM"),); //2023-03
    // console.log('PER-ACTUAL5', moment(this.modificarMes(-6)).format("Y-MM"),); //2023-03

    return (dpf > 5 || dpf <= -5)? dpf: 0
  }

  dpf91_180(proy:string){
    let sumaDpf = 0;
      for (let i = 4; i < 7; i++) { //i=4 : (E,F,M:4,5,6) | 2023(E,F,M): -6,-5,-4   | (J,Jn,M, A):7,6,5,4
      sumaDpf = sumaDpf +  this.dataDPF(proy, -i)
      // console.log('E-F-M', sumaDpf);
      }
    return sumaDpf? sumaDpf: 0 ;
  }

  dpf181_365(proy:string){
    var suma181_365:any = 0;
      for (let i = 7; i < 13; i++) { //i=7,8,9,10,11,12: D,N,O,S,A,J (2022) : -7,-8,-9,-10,-11,-12
      suma181_365 = suma181_365 +  this.dataDPF(proy, -i) // 12,11,10,9,8,7 dataDpf022JAS
      }
      return (suma181_365 == 0)? 0 : suma181_365;
  }

  dpfMayor365(proy:string){
    var sumaDpfx = 0;
      for (let i = 13; i < 54; i++) { //i=13,14,15,16,17,18: (2022)Jn,M,A,M,F,E | (2021)D,N,O,S,A,J,Jn,M,A,M,F,E | 12(2020) | 12(2019)
                                                                               // (2021)19,20,21,22,23,24,25,26,27,28,29,30 |(2020)[31->42] | (2019)[43->54] 31+12=43
      sumaDpfx = sumaDpfx +  this.dataDPF(proy, -i)
      // console.log('>365', sumaDpfx);
      }
    return sumaDpfx? sumaDpfx : 0;
  }


  totalDpfVencidos(proy:string){
    var dpfVencidos = (
      this.dataDPF(proy, -1)+ //[1-30]   Jn 2023
      this.dataDPF(proy, -2)+ //[31-60]   M 2023
      this.dataDPF(proy, -3)+ //[61-90]   A 2023
      this.dpf91_180(proy) +   //[91-180]  EFM 2023
      this.dpf181_365(proy)+   //[181-365] JASOND(2012)
      this.dpfMayor365(proy)   //[>365]
      )

    return (dpfVencidos == 0)? '' : dpfVencidos;
  }


  dataTOTAL(proy: string){
    const total =  (
    // this.filtrarPorPeriodo(moment(this.modificarMes(0) ).format("Y-MM"), 'dpf', proy)+ //Total corriente (PERIODO ACTUAL: JULIO)
    this.dataDPF(proy,  0)+ //Total corriente   J 2023
    this.dataDPF(proy, -1)+ //[1-30]   Jn 2023
    this.dataDPF(proy, -2)+ //[31-60]   M 2023
    this.dataDPF(proy, -3)+ //[61-90]   A 2023
    this.dpf91_180(proy) +  //[91-180]
    this.dpf181_365(proy)+  //[181-365]  //NOTA: Corregir la data
    this.dpfMayor365(proy)  //[>365]
    );

   return (total == 0)? '': total;
  }

  listadoDPF: any[] = [];
  getListDPF(){
    this.visorService.getListDpf().subscribe((resp: any[]) => {
      this.resultado = resp; //Almacenamos toda la lista de dpf que viene desde la BD

      this.listDPF = removeDuplicateObjects(resp, 'proyecto');
      // console.log('DPF',this.listDPF, );
      console.log('ABC',moment(this.modificarMes(-4)).format("Y-MM"), this.filtrarPorPeriodo(moment(this.modificarMes(-4)).format("Y-MM"), 'dpf', 'TDPFAC'));
      // console.log('DPF_VENCIDO', this.DPFVencidoFacturado('TPSNEG'));


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
      console.log('Fecha', res);

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
}
