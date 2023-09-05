import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import chartDataLabels from 'chartjs-plugin-datalabels';
import * as XLSX from 'xlsx';
import { VisorService } from 'src/app/core/services/visor.service';
import { removeDuplicateObjects } from 'src/app/core/util/util';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';

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
              public datepipe: DatePipe,
              private spinner: NgxSpinnerService,
              private fb: FormBuilder,
    ){}

  ngOnInit(){
    this.newFilfroForm()
    // this.cargarOBuscarListVD()
    this.getListDPF();
    // this.fechaX(5);
    // console.log('M0', this.fechaX(0));
    // console.log('M1', this.fechaX(1));
    // console.log('M2', this.fechaX(2));
    // console.log('M3', this.fechaX(3));
    // console.log('M4', this.fechaX(4));
    // console.log('M5', this.fechaX(5));
    // console.log('M6', this.fechaX(6));
    // console.log('M7', this.fechaX(7));
    // console.log('Mx', this.fechaX(10));
    // console.log('My', this.fechaX(14));
    // console.log('Mz', this.fechaX(54));

    // // PERIODOS VALIDOS - OJO *******************************
    // console.log('TOTAL-CORR',this.modificarMes(-1)); //2023-07
    // console.log('[1-30]'  , this.modificarMes(-2)); //2023-06
    // console.log('[31-60]' , this.modificarMes(-3)); //2023-07
    // console.log('[61-90]' , this.modificarMes(-4)); //2023-04
    // console.log('[91-120]', this.modificarMes(-5));//2023-03
    // console.log('[121-150]',this.modificarMes(-6));//2023-02
    // console.log('[151-180]',this.modificarMes(-7));//2023-01
    // console.log('[181-210]',this.modificarMes(-8));//2022-12
    // console.log('[211-240]',this.modificarMes(-9));//2022-11
    // console.log('[241-270]',this.modificarMes(-10));//2022-10
    // console.log('[271-300]',this.modificarMes(-11));//2022-09
    // console.log('[301-340]',this.modificarMes(-12));//2022-08
    // console.log('[301-340]',this.modificarMes(-13));//2022-07
    // console.log('[301-340]',this.modificarMes(-14));//2022-06
    // console.log('[301-340]',this.modificarMes(-15));//2022-05
    // console.log('[301-340]',this.modificarMes(-16));//2022-04
    // console.log('[301-340]',this.modificarMes(-17));//2022-03
    // console.log('[301-340]',this.modificarMes(-18));//2022-02
    // console.log('[301-340]',this.modificarMes(-19));//2022-01
    // console.log('[301-340]',this.modificarMes(-20));//2021-12
  }

  filtroForm!: FormGroup;
  newFilfroForm(){
    this.filtroForm = this.fb.group({
      f_periodo          : ['']
    })
  };

  listaVd: any[] = [];
  cargarOBuscarListVD(){
    this.blockUI.start("Cargando liquidaciones...");
    // let parametro: any[] = [{
    //   "queryId": 118,
    //   "mapValue": {
    //       f_periodo: this.filtroForm.value.f_periodo,
    //       // f_periodo         : this.datepipe.transform(this.filtroForm.value.f_periodo,"yyyy/MM/dd"),
    //   }
    // }];
    this.visorService.getVentaDeclarada().subscribe((resp: any[]) => {
      this.blockUI.stop();

      // f_periodo: this.filtroForm.value.f_periodo,

      console.log('FIL-PER', this.filtroForm.value.f_periodo);//2023-0x

      console.log('Lista-VD', resp, resp.length);
       this.listaVd = [];
      //  this.listaVd = resp .map(x => x.periodo == '2023-07');
       this.listaVd = resp.map(x => x.periodo == this.filtroForm.value.f_periodo);

       this.spinner.hide();
    });
  }

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})
    this.newFilfroForm()

    // this.cargarOBuscarListVD();
  }

  fechaX(M2: number){
    var e = new Date('2023/08/27') //31/08/2023
    e.setMonth(e.getMonth() -M2)
    const dateM = e.getFullYear() +"-"+ (e.getMonth()+1) +"-"+ e.getDate();

    return dateM;
  }

  modificarMes(mes: any) {
    // var date = new Date();
    var date = new Date('2023/08/1');
    /* Javascript recalculará la fecha si el mes es menor de 0 (enero) o mayor de 11 (diciembre) */
    date.setMonth(date.getMonth() + mes);

    /* Obtenemos la fecha en formato YYYY-mm */
    return date.toISOString().substring(0, 7);
  }

  modificarMesII(meses: number){
    const fecha = new Date('2023/08/30'); //OJO: Fecha actual 2023/08/31
    const mes = fecha.getMonth(); // Rpta:7 Mes actual

    fecha.setMonth(fecha.getMonth() + meses);
    while (fecha.getMonth() == mes) {
      fecha.setDate(fecha.getDate() - 1);
    }

    return  fecha.toISOString().substring(0, 7); //28/02/2022
  }

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
    var sumaDpfVencidos:any = 0;
      for (let i = 2; i < 54; i++) { //Suma de DPF vencidos desde [1-30] a [>365]
        if (this.dataDPF(proy, -i) > 0) {
          sumaDpfVencidos = sumaDpfVencidos +  this.dataDPF(proy, -i)  // 12,11,10,9,8,7 dataDpf022JAS
            // console.log('DPF-SUM', sumaDpfVencidos);
        }
    }
      // console.log('DPF_VENC', sumaDpfVencidos);
      return (sumaDpfVencidos > 5 )? sumaDpfVencidos: '';
  }

  aloVencidos(proy:string){
    var sumaDpfVencidos:any = 0;
      for (let i = 2; i < 54; i++) { //Suma de DPF vencidos desde [1-30] a [>365]
        if (this.dataDPF(proy, -i)<0) {
          sumaDpfVencidos = sumaDpfVencidos +  (this.dataDPF(proy, -i) ) // 12,11,10,9,8,7 dataDpf022JAS
        }
      }

      return (sumaDpfVencidos < -5)? sumaDpfVencidos: '';
      // return (sumaDpfVencidos > 5 || sumaDpfVencidos < -5)? sumaDpfVencidos: '';
  }

  dpf91_180II(proy:string){
    let sumaDpf = 0;
      for (let i = 4; i < 7; i++) { //i=4 : (E,F,M:4,5,6) | 2023(E,F,M): -6,-5,-4   | (J,Jn,M, A):7,6,5,4
      sumaDpf = sumaDpf +  this.dataDPF(proy, -i)
      // console.log('E-F-M', sumaDpf);
      }
    return sumaDpf? sumaDpf: 0 ;
  }

  dpf91_180(proy:string){
    let sumaDpf = 0;
      for (let i = 4; i < 7; i++) { //i=4 : (E,F,M:4,5,6) | 2023(E,F,M): -6,-5,-4   | (J,Jn,M, A):7,6,5,4
        if (this.dataDPF(proy, -i)>0) {
          sumaDpf = sumaDpf +  this.dataDPF(proy, -i)
        // console.log('E-F-M', sumaDpf);
        }
      }
    return sumaDpf? sumaDpf: 0 ;
  }

  alo91_180(proy:string){
    let sumaAlo = 0;
      for (let i = 4; i < 7; i++) { //i=4 : (E,F,M:4,5,6) | 2023(E,F,M): -6,-5,-4   | (J,Jn,M, A):7,6,5,4
        if (this.dataDPF(proy, -i)<0) {
          sumaAlo = sumaAlo +  this.dataDPF(proy, -i)
        // console.log('E-F-M', sumaAlo);
        }
      }
    return sumaAlo? sumaAlo: 0 ;
  }

  dpf181_365II(proy:string){
    var suma181_365:any = 0;
      for (let i = 7; i < 13; i++) { //i=7,8,9,10,11,12: D,N,O,S,A,J (2022) : -7,-8,-9,-10,-11,-12

        if (this.dataDPF(proy, -i) > 0) {

        }
      suma181_365 = suma181_365 +  this.dataDPF(proy, -i) // 12,11,10,9,8,7 dataDpf022JAS
      }
      return (suma181_365 == 0)? 0 : suma181_365;
  }

  dpf181_365(proy:string){
    var suma181_365:any = 0;
      for (let i = 7; i < 13; i++) { //i=7,8,9,10,11,12: D,N,O,S,A,J (2022) : -7,-8,-9,-10,-11,-12

        if (this.dataDPF(proy, -i) > 0) {
          suma181_365 = suma181_365 +  this.dataDPF(proy, -i) // 12,11,10,9,8,7 dataDpf022JAS
        }
      }
      return (suma181_365 == 0)? 0 : suma181_365;
  }

  alo181_365(proy:string){
    var suma181_365:any = 0;
      for (let i = 7; i < 13; i++) { //i=7,8,9,10,11,12: D,N,O,S,A,J (2022) : -7,-8,-9,-10,-11,-12

        if (this.dataDPF(proy, -i) < 0) {
          suma181_365 = suma181_365 +  this.dataDPF(proy, -i) // 12,11,10,9,8,7 dataDpf022JAS
        }
      }
      return (suma181_365 == 0)? 0 : suma181_365;
  }

  dpfMayor365(proy:string){
    var sumaDpfx = 0;
      for (let i = 13; i < 54; i++) { //i=13,14,15,16,17,18: (2022)Jn,M,A,M,F,E | (2021)D,N,O,S,A,J,Jn,M,A,M,F,E | 12(2020) | 12(2019)
                                                                               // (2021)19,20,21,22,23,24,25,26,27,28,29,30 |(2020)[31->42] | (2019)[43->54] 31+12=43
        if (this.dataDPF(proy, -i) > 0) {
          sumaDpfx = sumaDpfx +  this.dataDPF(proy, -i)
        }
      // console.log('>365', sumaDpfx);
      }
      return (sumaDpfx > 5 || sumaDpfx <= -5)? sumaDpfx: 0
    // return sumaDpfx? sumaDpfx : 0;

  }

  aloMayor365(proy:string){
    var sumaDpfx = 0;
      for (let i = 13; i < 54; i++) { //i=13,14,15,16,17,18: (2022)Jn,M,A,M,F,E | (2021)D,N,O,S,A,J,Jn,M,A,M,F,E | 12(2020) | 12(2019)
                                                                               // (2021)19,20,21,22,23,24,25,26,27,28,29,30 |(2020)[31->42] | (2019)[43->54] 31+12=43
        if (this.dataDPF(proy, -i) < 0) {
          sumaDpfx = sumaDpfx +  this.dataDPF(proy, -i)
        }
      // console.log('>365', sumaDpfx);
      }
      return (sumaDpfx > 5 || sumaDpfx <= -5)? sumaDpfx: 0
  }

  dataDpfTOTAL(proy:string){
    var totalDpfVencidos:any = 0;
      for (let i = 1; i < 54; i++) { //Suma de DPF vencidos desde [1-30] a [>365]
        if (this.dataDPF(proy, -i)>0) {
          totalDpfVencidos = totalDpfVencidos +  this.dataDPF(proy, -i) // 12,11,10,9,8,7 dataDpf022JAS
        }
      }

      return (totalDpfVencidos > 5 || totalDpfVencidos < -5)? totalDpfVencidos: '';
  }

  dataAloTOTAL(proy:string){
    var totalDpfVencidos:any = 0;
      for (let i = 1; i < 54; i++) { //Suma de DPF vencidos desde [1-30] a [>365]
        if (this.dataDPF(proy, -i)<0) {
          totalDpfVencidos = totalDpfVencidos +  this.dataDPF(proy, -i) // 12,11,10,9,8,7 dataDpf022JAS
        }
      }

      return (totalDpfVencidos > 5 || totalDpfVencidos < -5)? totalDpfVencidos: '';
  }



  dataTOTALII(proy: string){
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
    this.blockUI.start("Cargando listado DPF...");

    this.visorService.getListDpf().subscribe((resp: any[]) => {
      this.blockUI.stop();

      this.resultado = resp; //Almacenamos toda la lista de dpf que viene desde la BD

      this.listDPF = removeDuplicateObjects(resp, 'proyecto');
      console.log('DPF',this.listDPF, );
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
}
