import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets } from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';
import { SingleDataSet, Label } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { VisorService } from 'src/app/core/services/visor.service';

@Component({
  selector: 'app-visor-declarada',
  templateUrl: './visor-declarada.component.html',
  styleUrls: ['./visor-declarada.component.scss'],
})
export class VisorDeclaradaComponent implements OnInit {
  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  resultado     : any[] = [];
  listVentaDecl : any[] = [];
  resultadoNV   : any;
  sum!: number;

  constructor( private visorServices: VisorService,
               private http: HttpClient, ){}

  pieChartOptions: any = {
    responsive: true,

    onClick: function (e: any) {
      var element = this.getElementAtEvent(e);
      if (element.length) {
          (<HTMLInputElement>document.getElementById('ckh2h')).value = element[0]._view.label + '|e';
          (<HTMLInputElement>document.getElementById('ckh2h')).click();
          console.log(element[0]._view.label)
        }
      },
    };

  pieChartLabels: Label[] = ['Loading.','Loading..','Loading...','Loading...','Loading...','Loading...',];
  pieChartData: SingleDataSet = [1, 2, 3, 4, 5, 6];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
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
    },

    scales: {
      xAxes: [{ stacked: true }], yAxes: [{
          stacked: true
      }]
  },
  plugins: {
      datalabels: {
          anchor: 'center',
          align: 'center',
          display: function (context: any) {
              return context.dataset.data[context.dataIndex] > 0;
          },
      }
  }

   };

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [chartDataLabels];
  barChartData: ChartDataSets[] = [{ data: [], label: '' }];

  // constructor(private http: HttpClient,
  //   private facturacionService: FacturacionService) { }

  ngOnInit() {
    this.getDataVentaDeclarada();
    // this.cargarOBuscarLiquidacion();
  }

  // listaLiquidacion: any[] = [];
  // cargarOBuscarLiquidacion(){
  //   let parametro: any[] = [{
  //     "queryId": 150,
  //     // "mapValue": {
  //     //     cod_fact       : this.filtroForm.value.codFact,
  //     //     id_proy        : this.filtroForm.value.id_proy,
  //     //     id_liquidacion : this.filtroForm.value.id_liquidacion,
  //     //     id_estado      : this.filtroForm.value.id_estado,
  //     //     id_gestor      : this.filtroForm.value.id_gestor,
  //     //     importe        : this.filtroForm.value.importe,
  //     //     subservicio    : this.filtroForm.value.subservicio,
  //     //     inicio         : this.datepipe.transform(this.filtroForm.value.fechaRegistroInicio,"yyyy/MM/dd"),
  //     //     fin            : this.datepipe.transform(this.filtroForm.value.fechaRegistroFin,"yyyy/MM/dd"),
  //     // }
  //   }];
  //   this.facturacionService.cargarOBuscarVentaDeclada(parametro[0]).subscribe((resp: any) => {

  //     console.log('VD-SUP', resp);

  //   //  console.log('Lista-Liquidaciones', resp.list, resp.list.length);
  //     this.listaLiquidacion = [];
  //     this.listaLiquidacion = resp.list;

  //   });
  // }

  getDataVentaDeclarada(){
    this.visorServices.getVentaDeclarada().subscribe((resp) => {
          this.resultado = resp.VentasModel;
          this.listVentaDecl = resp.VentasModel;
          console.log('LIST-VD', this.listVentaDecl);

          this.suma();

          function groupBy(objectArray: any[], property: string) {
            return objectArray.reduce(function (acc, obj) {
              var key = obj[property];

              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(obj);
              return acc;
              //return [].slice.call(acc).sort((a,b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0));
            }, {});
          }

          const groupedData = groupBy(this.listVentaDecl, 'proyecto');
          const reducedData = [];

          for (let key in groupedData) {
            let initialValue = 0;
            let sum = groupedData[key].reduce((accumulator: any, currentValue: any) => {
                return accumulator + (currentValue.grupo == "EyP" ? 1 : 0);
            }, initialValue)

            let sumd = groupedData[key].reduce((accumulator: any, currentValue: any) => {
                return accumulator + (currentValue.grupo == "Controller" ? 1 : 0);
            }, initialValue)

            let sumf = groupedData[key].reduce((accumulator: any, currentValue: any) => {
                return accumulator + (currentValue.grupo == "Facturación" ? 1 : 0);
            }, initialValue)

            reducedData.push({
                Derivados   : sumd,
                Planificados: sum,
                Facturar    : sumf,
                fecha       : key
            });
          }

          this.barChartData = [
            {   label: 'EyP',
                data: reducedData.sort((a, b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["Planificados"])
            },
            {   label: 'Controller',
                data: reducedData.sort((a, b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["Derivados"])
            }
            ,
            {   label: 'Facturación',
                data: reducedData.sort((a, b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["Facturar"])
            }]

            this.barChartLabels = reducedData.sort((a, b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["fecha"]);

            console.log('DATA_DECL', res);

            var res0 = [];

          res0 = this.listVentaDecl.reduce((p: { [x: string]: number }, n: { estado: string | number }) => {
              if (p[n.estado]) {p[n.estado] += 1;
              } else {
                p[n.estado] = 1;
              }
              return p;
            },[] );

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


  filtrar(flt: any) {
    var inputValue = (<HTMLInputElement>document.getElementById('ckh2h')).value;
    var arrayDeCadenas = inputValue.split('|');

    this.listVentaDecl = this.resultado;
    if (arrayDeCadenas[1] == 'e') {
      this.listVentaDecl = this.listVentaDecl.filter((task) => task.estado == arrayDeCadenas[0]);
    } else {
      this.listVentaDecl = this.listVentaDecl.filter((task) => task.proyecto == arrayDeCadenas[0]);
    }

    this.suma();

    (<HTMLInputElement>document.getElementById('titulo')).innerText = 'Liquidaciones:: ' + arrayDeCadenas[0] + '(' + this.sum.toLocaleString('es-PE') + ')';
    }

    public suma(){
      this.sum = this.listVentaDecl.map(a => a.venta_Declarada).reduce(function(a, b)
      {
        return a + b;
      }).toFixed(2);
      console.log('SUMA', this.sum);
  }



  totalfiltro = 0;
  cambiarPagina(event: number) {
    if (this.totalfiltro != this.totalFacturas) {
    this.visorServices.getVentaDeclarada().subscribe((result: any[]) => {
      this.listVentaDecl = result;
    })
  }
      this.page = event;
  }
}






  // events
  // chartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
  //   console.log(event, active);
  //   alert('hola');
  // }

  // chartHovered({ event, active }: { event: MouseEvent; active: {}[] }): void {
  //   console.log(event, active);
  //   alert('hola');
  // }
