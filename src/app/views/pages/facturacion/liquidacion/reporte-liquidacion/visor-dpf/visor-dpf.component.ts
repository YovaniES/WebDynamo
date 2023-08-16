import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import chartDataLabels from 'chartjs-plugin-datalabels';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { VisorService } from 'src/app/core/services/visor.service';
import { removeDuplicateObjects } from 'src/app/core/util/util';

@Component({
  selector: 'app-visor-fact',
  templateUrl: './visor-dpf.component.html',
  styleUrls: ['./visor-dpf.component.scss']
})
export class VisorDpfComponent implements OnInit {
  page = 1;
  totalFacturas: number = 0;
  pageSize = 20;

  resultado: any[] = [];
  listDPF: any[] = [];
  resultadoNV: any;
  sum!: number;

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

  constructor(private visorService: VisorService){}

  ngOnInit() {
    this.getInitializerFact();
  }

  filtrarPorPeriodo(periodo: string, nombreCampo: string, proy: string): any{
    const dpfItem = this.resultado.find( item => item.per_vd == periodo && item.proyecto == proy)

    return dpfItem? dpfItem[nombreCampo]: 0;
  }

  obtenerPeriodoPorMes(mesAnterior: number = 0){
    const fechaActual = new Date();
    return fechaActual.getFullYear() + '-' + ('0' + (fechaActual.getMonth()- mesAnterior)).slice(-2);
  };

  totalDPF(nameProy: string){
     const totalDPF =  (this.filtrarPorPeriodo(this.obtenerPeriodoPorMes(), 'sum_vd', nameProy)+
     this.filtrarPorPeriodo(this.obtenerPeriodoPorMes(1), 'sum_vd', nameProy)+
     this.filtrarPorPeriodo(this.obtenerPeriodoPorMes(2), 'sum_vd', nameProy)+
     this.filtrarPorPeriodo(this.obtenerPeriodoPorMes(3), 'sum_vd', nameProy)+
     this.filtrarPorPeriodo(this.obtenerPeriodoPorMes(4), 'sum_vd', nameProy));

     return totalDPF? totalDPF : 0
  }

  listadoDPF: any[] = [];
  getInitializerFact(){
    this.visorService.getListDpf().subscribe((resp: any[]) => {
      this.resultado = resp; //Almacenamos el total de dpf que viene de la BD

      this.listDPF = removeDuplicateObjects(resp, 'proyecto');
      console.log('DPF',this.listDPF, );
      console.log('ABC',this.obtenerPeriodoPorMes(), this.filtrarPorPeriodo(this.obtenerPeriodoPorMes(), 'dpf', 'TDPFAC'));


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

  totalfiltro = 0;
  cambiarPagina(event: number) {

    if (this.totalfiltro != this.totalFacturas) {
    this.visorService.getLiqByProyecto().subscribe((resp: any[]) => {
      this.listDPF = resp;
    })
  }
    this.page = event;
  }
}
