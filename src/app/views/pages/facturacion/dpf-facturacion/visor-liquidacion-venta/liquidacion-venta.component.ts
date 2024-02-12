import { Component, OnInit } from '@angular/core';
import { VisorService } from 'src/app/core/services/visor.service';

@Component({
  selector: 'app-liquidacion-venta',
  templateUrl: './liquidacion-venta.component.html',
  styleUrls: ['./liquidacion-venta.component.scss'],
})
export class LiquidacionVentaComponent implements OnInit {
  resultado  : any[] = [];
  resultadoV : any[] = [];
  totalColum : any;
  resultadoVF: any;
  caspru : any;
  casprux: any;
  closeResult: string = '';

  constructor(private visorServices: VisorService,) {}

  ngOnInit() {
    this.getLiquidacionVenta();
  }

  public dataSource: any[] = [];
  public displayedColumns: string[] = [];
  getLiquidacionVenta(){
    this.visorServices.getLiquidacionVenta().subscribe((resp: any[]) => {
      this.dataSource = resp;
      this.totalColum = resp;
      console.log('LIQ-VEN', this.dataSource);

      this.displayedColumns = ["periodo","proyecto","actas","avance","importe","venta_declarada","certificado","facturado",]

    }, (error) => console.error(error)
    )
  }

  getDataLiquidacionVenta() {
    this.visorServices.getLiquidacionVenta().subscribe((result: any[]) => {
      this.resultado = result;
      // this.resultadoV = result;
      this.dataSource = result;
      console.log('LIQ_VENTA', this.dataSource);

      // this.suma();

        // function groupBy(objectArray: any[], property: string) {
        //   return objectArray.reduce(function (acc, obj) {
        //     var key = obj[property];

        //     if (!acc[key]) {
        //       acc[key] = [];
        //     }
        //     acc[key].push(obj);
        //     return acc;
        //   }, {});
        // }

        // const groupedData = groupBy(this.resultadoV, 'proyecto');
        // const reducedData = [];

        // for (let key in groupedData) {
        //   let initialValue = 0;
        //   let sum = groupedData[key].reduce((accumulator: any, currentValue: any) => {
        //     return accumulator + (currentValue.grupo == "EyP" ? 1 : 0);
        //   }, initialValue);

        //   let sumd = groupedData[key].reduce((accumulator: any, currentValue: any) => {
        //     return accumulator + (currentValue.grupo == "Controller" ? 1 : 0);
        //   }, initialValue);

        //   let sumf = groupedData[key].reduce((accumulator: any, currentValue: any) => {
        //     return (
        //       accumulator + (currentValue.grupo == "Facturación" ? 1 : 0)
        //     );
        //   }, initialValue);

        //   reducedData.push({
        //     Derivados: sumd,
        //     Planificados: sum,
        //     Facturar: sumf,
        //     fecha: key,
        //   });
        // }

        // this.barChartData = [
        //   { label: "EyP",
        //     data: reducedData.sort((a, b) => a.fecha > b.fecha ? 1 : b.fecha > a.fecha ? -1 : 0)
        //       .map((x) => x["Planificados"]),
        //   },
        //   { label: "Controller",
        //     data: reducedData.sort((a, b) => a.fecha > b.fecha ? 1 : b.fecha > a.fecha ? -1 : 0)
        //       .map((x) => x["Derivados"]),
        //   },
        //   { label: "Facturación",
        //     data: reducedData.sort((a, b) => a.fecha > b.fecha ? 1 : b.fecha > a.fecha ? -1 : 0)
        //       .map((x) => x["Facturar"]),
        //   },
        // ];

        // this.barChartLabels = reducedData
        //   .sort((a, b) => (a.fecha > b.fecha ? 1 : b.fecha > a.fecha ? -1 : 0))
        //   .map((x) => x['fecha']);

        // console.log('DATA_FAC_FIL', res);

        // var res0 = [];

        // res0 = this.resultadoV.reduce(
        //   (p: { [x: string]: number }, n: { periodo: string | number }) => {
        //     if (p[n.periodo]) {
        //       p[n.periodo] += 1;
        //     } else {
        //       p[n.periodo] = 1;
        //     }
        //     return p;
        //   },
        //   []
        // );

        // var res = [];
        // for (var x in res0) {
        //   res0.hasOwnProperty(x) && res.push(res0[x]);
        // }
        // this.pieChartData = res;

        // var res = [];
        // for (var x in res0) {
        //   res0.hasOwnProperty(x) && res.push(x);
        // }
        // this.pieChartLabels = res;
      },(error) => console.error(error));
  }



  open(content: any, proy: any, periodo: any, origen: any) {
    // this.caspru = null;
    // this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" })
    //   .result.then((result: any) => {this.closeResult = `Closed with: ${result}`;},
    //     (reason: any) => {this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;}
    //   );

    // if (origen == "LI") {
    //   (<HTMLSpanElement>document.getElementById("headertxt")).innerText = "Liquidaciones - " + proy;
    //   this.caspru = this.resultado;
    //   this.caspru = this.caspru.filter((task: any) => task.proyecto == proy);
    // } else {
    //   (<HTMLSpanElement>document.getElementById("headertxt")).innerText =
    //     (origen == "VD"? "Venta Declarada - "
    //       : origen == "CR"? "Certificado - "
    //       : "Facturado - ") + proy;
    //   this.caspru = this.resultadoVF;
    //   this.caspru = this.caspru.filter(
    //     (task: any) => task.proyecto == proy && task.tipo == origen
    //   );
    // }

    // var groups = this.caspru.reduce(function (obj, item) {
    //   obj[item.gestor] = obj[item.gestor] || [];
    //   obj[item.gestor].push(item);
    //   return obj;
    // }, {});
    // var myArray = Object.keys(groups).map(function (key) {
    //   return { torneo: key, requerimientos: groups[key] };
    // });
    // this.casprux = myArray;
    // console.log(this.casprux);

    // return false;
  }

  public total(item: number) {
    return item == 1
      ? this.totalColum.reduce((acumulador:any, valorActual:any) => acumulador + valorActual.importe,     0): item == 3
      ? this.totalColum.reduce((acumulador:any, valorActual:any) => acumulador + valorActual.facturado,   0): item == 4
      ? this.totalColum.reduce((acumulador:any, valorActual:any) => acumulador + valorActual.certificado, 0)
      : this.totalColum.reduce((acumulador:any, valorActual:any) => acumulador + valorActual.venta_declarada, 0 );
  }

}


// OJO:
// https://localhost:7197/api/visor/getDataModalLiqVentaVD
// https://localhost:7197/api/visor/getDataModalLiqVentaFacturados
