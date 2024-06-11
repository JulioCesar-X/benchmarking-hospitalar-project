import { Component } from '@angular/core';
import { ConsultDataFilterComponent } from '../../components/consult-data-filter/consult-data-filter.component'
import {DataGraphicComponent } from '../../components/data-graphic/data-graphic.component'
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { AccumulatedData } from '../../models/AccumulatedData.model'
import { Filter } from '../../models/accumulatedDataFilter.model'
import {graphData} from '../../models/graphData.model'

@Component({
  selector: 'app-consult-data-page',
  standalone: true,
  imports: [
    ConsultDataFilterComponent,
    DataGraphicComponent,
    HttpClientModule,
  ],
  templateUrl: './consult-data-page.component.html',
  styleUrl: './consult-data-page.component.scss'
})

export class ConsultDataPageComponent {
  requestedData: any;
  filteredData: any;


  data: Array<graphData> = [];
  year: string = "";
  homologData: Array<graphData> = [];
  yearlyData: Array<graphData> = [];
  homologueYear: string = "";

  filter: Filter = {
    indicator: "Consultas Marcadas e não Realizadas",
    activity: "Psiquiatria Infância e Adolescência",
    service: "Hospital Dia",
    month: "1", /* new Date().getMonth().toString(), */
    year: (new Date().getFullYear() - 1).toString()
  }

  graphData: Array<graphData>[] = [];

  constructor(private dataService: DataService) {};

  ngOnInit(): void {
    this.dataService.getAccumulatedIndicatorData().subscribe(
      (response) => {
        this.requestedData = response;
        this.updateAllGraphData();
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  handleFilterData(event: Filter) {
    this.filter = event;
    this.updateAllGraphData();
  }

  updateAllGraphData(){
    this.data = this.filterData(this.filter, this.data, "month");
    this.homologData = this.filterData(this.getHomologueFilter(this.filter), this.homologData, "month");

    this.yearlyData = this.getYearlyData(this.filter);
    console.log("YEAR", this.yearlyData)


    this.year = this.filter.year;
    this.homologueYear = this.getHomologueFilter(this.filter).year;
    console.log("HOMOLOG FILTER", this.getHomologueFilter(this.filter));
  }


  filterData(filter: Filter, listData: Array<graphData>, chartType:string): Array<graphData>{
    let filteredData: Array<graphData> = [];

    // Convert the requested data to the format needed for graphing
    this.requestedData.forEach((item: any) => {

      filteredData.push({
        activity: item.nome_da_atividade,
        indicator: item.nome_do_indicador,
        value: chartType === "month" ? parseFloat(item.valor_mensal) : parseFloat(item.valor_acumulado_agregado),
        month: item.month,
        year: item.year,
      });
    });



/*     console.log("DADOS PARA FILTRAR", filteredData) */

    //filtrar lista para grafico
    filteredData = filteredData.filter((item: graphData) => {
      let shouldInclude: boolean;

      if (chartType === "month") {
        shouldInclude = (
          (!filter.indicator || filter.indicator === item.indicator) &&
          (!filter.activity || filter.activity === item.activity) &&
          (!filter.year || filter.year === item.year)
        );
      } else {
        shouldInclude = (
          (!filter.indicator || filter.indicator === item.indicator) &&
          (!filter.activity || filter.activity === item.activity) &&
          (!filter.month || filter.month === item.month) &&
          (!filter.year || filter.year === item.year)
        );
      }

      return shouldInclude;
    });



/*     this.filteredData.forEach((item: AccumulatedData) => {

      data = this.filteredData.map((item: any) => ({
        activity: item.nome_da_atividade,
        indicator: item.nome_do_indicador,
        value: parseFloat(item.valor_mensal),
        month: item.month,
      }));
    }); */

    console.log('DADOS PARA APRESENTAR:', filteredData);
    return filteredData;
  }


  getYearlyData(filter: Filter): any {
    let data: Array<graphData> = [];

    const filterYear = parseInt(filter.year);

    for (let i = 0; i < 5; i++) {
      filter = {
        ...filter,
        month : "12",
        year : (filterYear - i).toString(),
      }

      data.push(...this.filterData(filter, this.yearlyData, "year"));
    }

    return data;
}

  getHomologueFilter(filter: Filter): Filter {
    const currentYear = parseInt(filter.year, 10);
    const previousYear = (currentYear - 1).toString();
    return {
      ...filter,
      year: previousYear
    };
  }
}
