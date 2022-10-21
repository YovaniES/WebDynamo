import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';
import { SingleDataSet, Label } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-visor-declarada',
  templateUrl: './visor-declarada.component.html',
  styleUrls: ['./visor-declarada.component.scss'],
})
export class VisorDeclaradaComponent implements OnInit {
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

  pieChartLabels: Label[] = ['Loading.','Loading..','Loading...','Loading...','Loading...','Loading...',];
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
  barChartData: ChartDataSets[] = [{ data: [], label: '' }];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.initializerDataDeclarada()
  }

  dibujarPie(e: any){
    const chart = e.active[0]._chart;
    var element: any = chart.getElementAtEvent(e.event);
          if (element.length) {
              (<HTMLInputElement>document.getElementById('ckh2h')).value = element[0]._view.label + '|e';
              (<HTMLInputElement>document.getElementById('ckh2h')).click();
              console.log(element[0]._view.label)
          }
    }

  dibujarBar(e: any){
    const chart = e.active[0]._chart;
    var element: any = chart.getElementAtEvent(e.event);

          if (element.length) {
              (<HTMLInputElement>document.getElementById('ckh2h')).value = element[0]._view.label + '|f';
              (<HTMLInputElement>document.getElementById('ckh2h')).click();
              console.log(element[0]._view.label)
          }
    }

  initializerDataDeclarada(){
    this.http
      .get<any[]>('http://backdynamo.indratools.com/wsconsultaSupport/api/util/GetQuery?id=4').subscribe((result: any[]) => {
          this.resultado = result;
          this.resultadoV = result;
          console.log(this.resultadoV);

          this.suma();

          function groupBy(objectArray: any[], property: string) {
            return objectArray.reduce(function (
              acc: { [x: string]: any[] },
              obj: { [x: string]: any }
            ) {
              var key = obj[property];
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(obj);
              return acc;
              //return [].slice.call(acc).sort((a,b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0));
            },
            {});
          }

          const groupedData = groupBy(this.resultadoV, 'proyecto');
          const reducedData = [];

          for (let key in groupedData) {
            let initialValue = 0;
            let sum = groupedData[key].reduce(
              (
                accumulator: string | number,
                currentValue: { grupo: string }
              ) => {
                return +accumulator + (currentValue.grupo == 'EyP' ? 1 : 0)
              },
              initialValue
            );

            let sumd = groupedData[key].reduce(
              (
                accumulator: any, //string | number,
                currentValue: { grupo: string }
              ) => {
                return (
                  accumulator + (currentValue.grupo == 'Controller' ? 1 : 0)
                );
              },
              initialValue
            );

            let sumf = groupedData[key].reduce(
              (
                accumulator: any, //string | number,
                currentValue: { grupo: string }
              ) => {
                return (
                  accumulator + (currentValue.grupo == 'Facturación' ? 1 : 0)
                );
              },
              initialValue
            );

            reducedData.push({
              Derivados: sumd,
              Planificados: sum,
              Facturar: sumf,
              fecha: key,
            });
          }

          this.barChartData = [
            {
              label: 'EyP',
              data: reducedData
                .sort((a, b) => a.fecha > b.fecha ? 1 : b.fecha > a.fecha ? -1 : 0)
                .map((x) => x['Planificados']),
            },
            {
              label: 'Controller',
              data: reducedData
                .sort((a, b) => a.fecha > b.fecha ? 1 : b.fecha > a.fecha ? -1 : 0)
                .map((x) => x['Derivados']),
            },
            {
              label: 'Facturación',
              data: reducedData
                .sort((a, b) => a.fecha > b.fecha ? 1 : b.fecha > a.fecha ? -1 : 0)
                .map((x) => x['Facturar']),
            },
          ];

          this.barChartLabels = reducedData
            .sort((a, b) => a.fecha > b.fecha ? 1 : b.fecha > a.fecha ? -1 : 0)
            .map((x) => x['fecha']);
          console.log(res);

          var res0 = [];

          res0 = this.resultadoV.reduce(
            (p: { [x: string]: number }, n: { estado: string | number }) => {
              if (p[n.estado]) {
                p[n.estado] += 1;
              } else {
                p[n.estado] = 1;
              }
              return p;
            },
            []
          );

          var res = [];
          for (var x in res0) {
            res0.hasOwnProperty(x) && res.push(res0[x]);
          }
          this.pieChartData = res;

          var res = [];
          for (var x in res0) {
            res0.hasOwnProperty(x) && res.push(x);
          }
          this.pieChartLabels = res;
        },
        (error) => console.error(error)
      );
  }

  // events
  chartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
    console.log(event, active);
    alert('hola');
  }

  chartHovered({ event, active }: { event: MouseEvent; active: {}[] }): void {
    console.log(event, active);
    alert('hola');
  }

  filtrar(flt: any) {
    var inputValue = (<HTMLInputElement>document.getElementById('ckh2h')).value;
    var arrayDeCadenas = inputValue.split('|');

    this.resultadoV = this.resultado;
    if (arrayDeCadenas[1] == 'e') {
      this.resultadoV = this.resultadoV.filter(
        (task: { estado: string }) => task.estado == arrayDeCadenas[0]
      );
    } else {
      this.resultadoV = this.resultadoV.filter(
        (task: { proyecto: string }) => task.proyecto == arrayDeCadenas[0]
      );
    }

    this.suma();

    (<HTMLInputElement>document.getElementById('titulo')).innerText =
      'Liquidaciones:: ' + arrayDeCadenas[0] + '(' + this.sum.toLocaleString('es-PE') + ')';
    }

  suma() {
    this.sum = this.resultadoV
      .map((a: { venta_declarada: any }) => a.venta_declarada)
      .reduce(function (a: any, b: any) {
        return a + b;
      }).toFixed(2);

    console.log(this.sum);
  }


  totalfiltro = 0;
  cambiarPagina(event: number) {
    if (this.totalfiltro != this.totalFacturas) {
    this.http.get<any[]>('http://backdynamo.indratools.com/wsconsultaSupport/api/util/GetQuery?id=4').subscribe((result: any[]) => {
      this.resultadoV = result;
    })
  }
      this.page = event;
  }
}
