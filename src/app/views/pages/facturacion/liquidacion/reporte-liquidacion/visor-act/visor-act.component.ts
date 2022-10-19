import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-visor-act',
  templateUrl: './visor-act.component.html',
  styleUrls: ['./visor-act.component.scss']
})
export class VisorActComponent implements OnInit {
  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  resultado!: any[];
  resultadoV: any[] = [];
  resultadoNV: any;
  sum!: number;

  pieChartOptions: ChartOptions = {
      responsive: true,

      // onClick: function (e: any) {
      //     var element = this.getElementAtEvent(e);
      //     if (element.length) {
      //         (<HTMLInputElement>document.getElementById('ckh2h')).value = element[0]._view.label + '|e';
      //         document.getElementById('ckh2h').click();
      //         console.log(element[0]._view.label)
      //     }
      // },

  };
  public pieChartLabels: Label[] = ['Loading.', 'Loading..', 'Loading...', 'Loading...', 'Loading...', 'Loading...'];
  public pieChartData: SingleDataSet = [1, 2, 3, 4, 5, 6];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  public barChartOptions: ChartOptions = {
      responsive: true,

      // onClick: function (e: any) {
      //     var element = this.getElementAtEvent(e);
      //     if (element.length) {

      //         (<HTMLInputElement>document.getElementById('ckh2h')).value = element[0]._view.label + '|f';
      //         document.getElementById('ckh2h').click();
      //         console.log(element[0]._view.label)

      //     }
      // },

      // We use these empty structures as placeholders for dynamic theming.

      scales: {
          xAxes: [{ stacked: true }], yAxes: [{
              stacked: true
          }]
      },
      plugins: {
          datalabels: {
              anchor: 'center',
              align: 'center',
            //   display: function (context: { dataset: { data: { [x: string]: number; }; }; dataIndex: string | number; }) {
            //       return context.dataset.data[context.dataIndex] > 0;
            //   },
          }
      }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [
      { data: [], label: '' }
  ];

  name = 'dwdALODPF.xlsx';
  exportToExcel(): void {
      let element = document.getElementById('tbRes');
      const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

      XLSX.writeFile(book, this.name);
    }

  constructor(private http: HttpClient,
      ) {


  }

  ngOnInit() {
    this.getDataReport();
  }


  getDataReport(){
    this.http.get<any[]>('http://backdynamo.indratools.com/wsconsultaSupport/api/util/GetQuery?id=3').subscribe((result: any[]) => {

          this.resultado = result;
          this.resultadoV = result;
          console.log('DATA_REPORTE', this.resultadoV.length);

          this.suma();

          function groupBy(objectArray: any[], property: string) {
              return objectArray.reduce(function (acc: { [x: string]: any[]; }, obj: { [x: string]: any; }) {
                  var key = obj[property];
                  if (!acc[key]) {
                      acc[key] = [];
                  }
                  acc[key].push(obj);
                  return acc;
                  //return [].slice.call(acc).sort((a,b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0));
              }, {});
          }


          const groupedData = groupBy(this.resultadoV, 'periodo');

          const reducedData = [];

          for (let key in groupedData) {
              let initialValue = 0;
              let sum = groupedData[key].reduce((accumulator: any | number, currentValue: { estado_proyecto: string; }) => {
                return accumulator + (currentValue.estado_proyecto!="Derivado"?1:0);
            },initialValue)

            let sumd = groupedData[key].reduce((accumulator: any | number, currentValue: { estado_proyecto: string; }) => {
              return accumulator + (currentValue.estado_proyecto=="Derivado"?1:0);
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
        //  {
        //     label: 'Derivado',
        //     data: reducedData.sort((a,b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["Derivados"])
        //  }
        ]


          this.barChartLabels = reducedData.sort((a, b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["fecha"]);
          console.log(res);

          var res0 = [];

          res0 = this.resultadoV.reduce((p: { [x: string]: number; }, n: { lider: string | number; }) => {
              if (p[n.lider]) { p[n.lider] += 1; }
              else { p[n.lider] = 1; }
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
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
      alert("hola");
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
      alert("hola");
  }

  public filtrar(flt: any) {
      // Only Change 3 values

      var inputValue = (<HTMLInputElement>document.getElementById('ckh2h')).value;
      var arrayDeCadenas = inputValue.split("|");

      this.resultadoV = this.resultado;
      if (arrayDeCadenas[1] == "e") {
          this.resultadoV = this.resultadoV.filter((task: { lider: string; }) => task.lider == arrayDeCadenas[0]);
      }
      else {
          this.resultadoV = this.resultadoV.filter((task: { periodo: string; }) => task.periodo == arrayDeCadenas[0]);
      }
      this.suma();

      // document.getElementById('titulo').innerText = "Pendiente de Facturar:: " + arrayDeCadenas[0] + "(" + this.sum.toLocaleString('es-PE') + ")";




      //document.getElementById('titulo').innerText = document.getElementById('titulo').innerText + "(" + this.sum + ")";
  }

  public suma()
  {
      this.sum = this.resultadoV.map((a: { importe: number; monto_facturado: number; }) => a.importe - a.monto_facturado).reduce(function(a: any, b: any)
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
    this.http.get<any[]>('http://backdynamo.indratools.com/wsconsultaSupport/api/util/GetQuery?id=3').subscribe((result: any[]) => {
      this.resultadoV = result;
    })
  } else {
      // this.spinner.hide();
    }
      this.page = event;
  }

}
