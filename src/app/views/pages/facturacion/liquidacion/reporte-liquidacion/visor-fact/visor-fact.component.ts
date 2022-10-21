import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import chartDataLabels from 'chartjs-plugin-datalabels';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-visor-fact',
  templateUrl: './visor-fact.component.html',
  styleUrls: ['./visor-fact.component.scss']
})
export class VisorFactComponent implements OnInit {
  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  resultado: any[] = [];
  resultadoV: any[] = [];
  resultadoNV: any;
  sum!: number;

  pieChartOptions: ChartOptions = {
      responsive: true,
  };

  pieChartLabels: Label[] = ['Loading.', 'Loading..', 'Loading...', 'Loading...', 'Loading...', 'Loading...'];
  pieChartData: SingleDataSet = [1, 2, 3, 4, 5, 6];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [chartDataLabels];


  barChartOptions: ChartOptions = {
      responsive: true,
  };

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [chartDataLabels];
  barChartData: ChartDataSets[] = [
      { data: [], label: '' }
  ];

  name = 'dwdFacturas.xlsx';
  exportToExcel(): void {
      let element = document.getElementById('tbRes');
      const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

      XLSX.writeFile(book, this.name);
    }

  constructor(private http: HttpClient){}

  ngOnInit() {
    this.getInitializerFact();
  }

  dibujarPie(e: any){
    console.log('DUBUJAR_PIE', e);

    // this.chart.getElementAtEvent(e)
    const chart = e.active[0]._chart;

    console.log('CHART_PIE', chart);
    var element: any = chart.getElementAtEvent(e.event);

          if (element.length) {
              (<HTMLInputElement>document.getElementById('ckh2h')).value = element[0]._view.label + '|e';
              (<HTMLInputElement>document.getElementById('ckh2h')).click();
              console.log(element[0]._view.label)
          }
    }

  dibujarBar(e: any){
    console.log('DUBUJAR_BAR', e);

    const chart = e.active[0]._chart;

    console.log('CHART_BAR', chart);
    var element: any = chart.getElementAtEvent(e.event);

          if (element.length) {
              (<HTMLInputElement>document.getElementById('ckh2h')).value = element[0]._view.label + '|f';
              (<HTMLInputElement>document.getElementById('ckh2h')).click();
              console.log(element[0]._view.label)
          }
    }
  getInitializerFact(){
    this.http.get<any[]>('http://backdynamo.indratools.com/wsconsultaSupport/api/util/GetQuery?id=2').subscribe((result: any[]) => {

      this.resultado = result;
      this.resultadoV = result;
      console.log(this.resultadoV);

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

      const groupedData = groupBy(this.resultadoV, 'proyecto');
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
      console.log(res);

      var res0 = [];

      res0 = this.resultadoV.reduce((p: { [x: string]: number; }, n: { periodo: string | number; }) => {
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

      this.resultadoV = this.resultado;
      if (arrayDeCadenas[1] == "e") {
          this.resultadoV = this.resultadoV.filter((task: { periodo: string; }) => task.periodo == arrayDeCadenas[0]);

      }
      else {
          this.resultadoV = this.resultadoV.filter((task: { proyecto: string; }) => task.proyecto == arrayDeCadenas[0]);
      }
      this.suma();

      (<HTMLInputElement>document.getElementById('titulo')).innerText = "Facturas:: " + arrayDeCadenas[0] + "(" + this.sum.toLocaleString('es-PE') + ")";
  }

  suma()
  {
      this.sum = this.resultadoV.map((a: { monto_facturado: any; }) => a.monto_facturado).reduce(function(a: any, b: any)
      {
        return a + b;
      })
      console.log(this.sum);
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    // this.spinner.show();

    if (this.totalfiltro != this.totalFacturas) {
    this.http.get<any[]>('http://backdynamo.indratools.com/wsconsultaSupport/api/util/GetQuery?id=2').subscribe((result: any[]) => {
      this.resultadoV = result;
    })
  } else {
      // this.spinner.hide();
    }
      this.page = event;
  }
}
