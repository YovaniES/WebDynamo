import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import chartDataLabels from 'chartjs-plugin-datalabels';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { VisorService } from 'src/app/core/services/visor.service';

@Component({
  selector: 'app-visor-actbyproy',
  templateUrl: './visor-actbyproy.component.html',
  styleUrls: ['./visor-actbyproy.component.scss']
})
export class VisorActByProyComponent implements OnInit {
  resultado  : any[] = [];
  resultadoV : any[] = [];
  resultadoR : any[] = [];
  resultadoVF: any[] = [];
  resultadoNV: any;
  sum!: number;

  caspru: any[] | null = [];
  casprux: { torneo: string; requerimientos: any[]; }[] = [];
  closeResult!: string;

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

  pieChartLabels: Label[] = ['Loading.', 'Loading..', 'Loading...', 'Loading...', 'Loading...', 'Loading...'];
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
                display: (context: any) => context.dataset.data[context.dataIndex] > 0,
            }
        }
    };

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [chartDataLabels];
  barChartData: ChartDataSets[] = [{ data: [], label: '' }];

  displayedColumns: string[] = [];
  dataSource: any[] = [];

  constructor(private modalService: NgbModal,
              private visorService: VisorService
      ) {}

  ngOnInit() {
    this.getListLiqByProy();
  }

  getListLiqByProy(){
    this.visorService.getLiqActPeriodo().subscribe((resp: any[]) => {

      this.resultado = resp;
      this.resultadoV = resp;
      console.log('VISOR-LIQ-PROY', this.resultadoV);

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


      const groupedData = groupBy(this.resultadoV, 'proyecto');
      const reducedData = [];

      for (let key in groupedData) {
          let initialValue = 0;
          let sum = groupedData[key].reduce((accumulator: any, currentValue: any) => {
              return accumulator + (currentValue.grupo == "EyP" ? 1 : 0);
          }, initialValue)

          let sumd = groupedData[key].reduce((accumulator: number, currentValue: any) => {
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
        { label: 'EyP',
          data: reducedData.sort((a, b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["Planificados"])},

        { label: 'Controller',
          data: reducedData.sort((a, b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["Derivados"])},

        { label: 'Facturación',
          data: reducedData.sort((a, b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["Facturar"])}
      ]

      this.barChartLabels = reducedData.sort((a, b) => (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0)).map(x => x["fecha"]);
      console.log('SUM_BAR', res);

      var res0 = [];

      res0 = this.resultadoV.reduce((p: { [x: string]: number; }, n: { estado: string | number; }) => {
          if (p[n.estado]) { p[n.estado] += 1; }
          else { p[n.estado] = 1; }
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

    this.visorService.getLiqByProyecto().subscribe((resp: any[]) => {

        this.resultadoR = resp;

        this.displayedColumns = ['periodo', 'proyecto','actas','avance', 'importe', 'venta_declarada','certificado','facturado'];
        this.dataSource = resp;
        console.log('LIQ_BY_PROY', resp);
    }, error => console.error(error));

     this.visorService.getLiqByProyCertificado().subscribe((resp: any[]) => {

       this.resultadoVF = resp;

     }, error => console.error(error));
  }

  // Abrir modal de porcengt
  open(content: any, proy: string, periodo: any, origen: string) {
    this.caspru = null;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    if (origen=="LI")
    {
      (<HTMLSpanElement>document.getElementById('headertxt')).innerText =  "Liquidaciones - " + proy;
      this.caspru = this.resultado;
      this.caspru = this.caspru.filter((task: { proyecto: any; }) => task.proyecto == proy);
    }
    else
    {
      (<HTMLSpanElement>document.getElementById('headertxt')).innerText = (origen=="VD"?  "Venta Declarada - ":origen=="CR"?  "Certificado - ":"Facturado - " ) + proy;
      this.caspru = this.resultadoVF;
      this.caspru = this.caspru.filter((task: { proyecto: any; tipo: any; }) => task.proyecto == proy && task.tipo == origen);
    }

    var groups = this.caspru.reduce(function (obj: { [x: string]: any[]; }, item: { gestor: string | number; }) {
      obj[item.gestor] = obj[item.gestor] || [];
      obj[item.gestor].push(item);
      return obj;
    }, {});

    var myArray = Object.keys(groups).map(function (key) {
      return { torneo: key, requerimientos: groups[key] };
    });

    this.casprux = myArray;
      console.log(this.casprux);
    //document.getElementById('titulo').innerText = document.getElementById('titulo').innerText + "(" + this.sum + ")";
      return false;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // events
  // chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  //     console.log(event, active);
  //     alert("hola");
  // }

  // chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  //     console.log(event, active);
  //     alert("hola");
  // }

  // Titulo del modal
  filtrar(flt: any) {
      var inputValue = (<HTMLInputElement>document.getElementById('ckh2h')).value;
      var arrayDeCadenas = inputValue.split("|");

      this.resultadoV = this.resultado;
      if (arrayDeCadenas[1] == "e") {
          this.resultadoV = this.resultadoV.filter((task: { estado: string; }) => task.estado == arrayDeCadenas[0]);
      }else {
          this.resultadoV = this.resultadoV.filter((task: { proyecto: string; }) => task.proyecto == arrayDeCadenas[0]);
      }
      this.suma();

      (<HTMLInputElement>document.getElementById('titulo')).innerText = "Liquidaciones:: " + arrayDeCadenas[0] + "(" + this.sum.toLocaleString('es-PE') + ")";
  }

  suma(){
    this.sum = this.resultadoV.map((a: { importe: any; }) => a.importe).reduce(function(a: any, b: any)
    {
    return a + b;
    }).toFixed(2);
    console.log(this.sum);
  }

  total(vrv: number){
    return vrv==1? this.resultadoR.reduce((accum: any, curr: { importe: any; }) => accum + curr.importe, 0) : vrv==3? this.resultadoR.reduce((accum: any, curr: { facturado: any; }) => accum + curr.facturado, 0) : vrv==4? this.resultadoR.reduce((accum: any, curr: { certificado: any; }) => accum + curr.certificado, 0) : this.resultadoR.reduce((accum: any, curr: { venta_declarada: any; }) => accum + curr.venta_declarada, 0);
  }
}
