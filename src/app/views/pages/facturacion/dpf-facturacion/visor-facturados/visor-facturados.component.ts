import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets } from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';
import { SingleDataSet, Label } from 'ng2-charts';
import { VisorService } from 'src/app/core/services/visor.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-visor-facturados',
  templateUrl: './visor-facturados.component.html',
  styleUrls: ['./visor-facturados.component.scss'],
})
export class VisorFacturadosComponent implements OnInit {
  page = 1;
  totalFacturas: number = 0;
  pageSize = 15;

  resultado: any[] = [];
  resultadoV: any[] = [];
  resultadoNV: any;
  sum!: number;

  constructor(private visorServices: VisorService) {}

  pieChartOptions: any = {responsive: true,

    onClick(e: any) {
      var element = this.getElementAtEvent(e);
      if (element.length) {
        (<HTMLInputElement>document.getElementById('ckh2h')).value =
          element[0]._view.label + '|e';
        (<HTMLInputElement>document.getElementById('ckh2h')).click();
        console.log(element[0]._view.label);
      }
    },
  };

  pieChartLabels: Label[] = ['Cargando.','Cargando..','Cargando...','Cargando...','Cargando...','Cargando...',];
  pieChartData: SingleDataSet = [1, 2, 3, 4, 5, 6];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [chartDataLabels];

  barChartOptions: any = {
    responsive: true,

    onClick(e: any) {
      var element = this.getElementAtEvent(e);

      if (element.length) {
        (<HTMLInputElement>document.getElementById('ckh2h')).value =
          element[0]._view.label + '|f';
        (<HTMLInputElement>document.getElementById('ckh2h')).click();
        console.log(element[0]._view.label);
      }
    },

    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{stacked: true,},],
    },
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center',
        display: function (context: any) {
          return context.dataset.data[context.dataIndex] > 0;
        },
      },
    },
  };

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend  = true;
  barChartPlugins = [chartDataLabels];
  barChartData: ChartDataSets[] = [{ data: [], label: '' }];

  name = 'Facturdos.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('tbRes');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Facturados');

    XLSX.writeFile(book, this.name);
  }

  ngOnInit() {
    this.getDataFacturados();
  }

  getDataFacturados() {
    this.visorServices.getFacturados().subscribe(
      (resp: any[]) => {
        this.resultado = resp;
          this.resultadoV = resp;
          console.log('LIST_FACTURADOS', this.resultadoV);

        this.suma();

        function groupBy(objectArray: any[], property: string) {
          return objectArray.reduce(function (acc, obj) {
            var key = obj[property];

            if (!acc[key]) {acc[key] = [];}
            acc[key].push(obj);
            return acc;
          }, {});
        }

        const groupedData = groupBy(this.resultadoV, "proyecto");
        const reducedData = [];

        for (let key in groupedData) {

          let initialValue = 0;
          let sum = groupedData[key].reduce((accumulator: any, currentValue: any) => {
            return (
              accumulator +
              (currentValue.estado_proyecto != "Derivado" ? 1 : 0)
            );
          },
            initialValue
          );

          let sumd = groupedData[key].reduce((accumulator: any, currentValue: any) => {
            return (
              accumulator + (currentValue.estado_proyecto == "Derivado" ? 1 : 0)
            )}, initialValue);


          reducedData.push({
            Derivados: sumd,
            Planificados: sum,
            fecha: key,
          });
        }

        this.barChartData = [
            {
              label: "Proyecto",
              data: reducedData.sort((a, b) => a.fecha > b.fecha ? 1 : b.fecha > a.fecha ? -1 : 0)
                    .map((x) => x["Planificados"]),
            },
        ];

        this.barChartLabels = reducedData.sort((a, b) => a.fecha > b.fecha ? 1 : b.fecha > a.fecha ? -1 : 0)
            .map((x) => x["fecha"]);

        console.log('DATA_FAC_FIL', res);

        var res0 = [];

        res0 = this.resultadoV.reduce((p, n) => {
          if (p[n.periodo]) {
            p[n.periodo] += 1;
          } else {
            p[n.periodo] = 1;
          }
          return p;
        }, []);

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

  public filtrar(flt: any) {
    var inputValue = (<HTMLInputElement>document.getElementById('ckh2h')).value;
    var arrayDeCadenas = inputValue.split('|');

    this.resultadoV = this.resultado;
    if (arrayDeCadenas[1] == 'e') {
      this.resultadoV = this.resultadoV.filter((task) => task.periodo == arrayDeCadenas[0]);
    } else {
      this.resultadoV = this.resultadoV.filter((task) => task.proyecto == arrayDeCadenas[0]);
    }
    this.suma();

    (<HTMLInputElement>document.getElementById('titulo')).innerText = 'Facturas:: ' + arrayDeCadenas[0] + '(' + this.sum.toLocaleString('es-PE') + ')';
  }

  public suma() {
    this.sum = this.resultadoV
      .map((a) => a.monto_facturado)
      .reduce((x, y) => {
        return x + y;
      }).toFixed(2);
    console.log('SUMA', this.sum);
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    if (this.totalfiltro != this.totalFacturas) {
      this.visorServices.getVentaDeclarada().subscribe((resp: any[]) => {
        this.resultadoV = resp;
      });
    }
    this.page = event;
  }
}
