import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { FooterComponent } from '../../components/ui/footer/footer.component';
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
  imports: [NavbarComponent,
    FooterComponent,
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
  homologueYear: string = "";

  filterDefault: Filter = {
    indicator: "Consultas Marcadas e não Realizadas",
    activity: "Psiquiatria Infância e Adolescência",
    month: "1", /* new Date().getMonth().toString(), */
    year: (new Date().getFullYear() - 1).toString()
  }

  graphData: Array<graphData>[] = [];

  constructor(private dataService: DataService) {};

  ngOnInit(): void {
    console.log(this.data)
    this.dataService.getAccumulatedIndicatorData().subscribe(
      (response) => {
        this.requestedData = response;
        this.data = this.filterData(this.filterDefault);
        this.homologData = this.filterData(this.getHomologueFilter(this.filterDefault))

        this.year = this.filterDefault.year;
        this.homologueYear = this.getHomologueFilter(this.filterDefault).year;
        console.log("HOMOLOG FILTER", this.getHomologueFilter(this.filterDefault))

/*         console.log(`All data:` + this.data) */
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  handleFilterData(event: Filter) {

  
    this.data = this.filterData(event);
    this.homologData = this.filterData(this.getHomologueFilter(event))
    this.year = event.year;
    this.homologueYear = this.getHomologueFilter(event).year;

    console.log("NORMAL FILTER", event)
    console.log("HOMOLOG FILTER", this.getHomologueFilter(event))
  }

  filterData(filter: Filter): Array<graphData>{
    let data: Array<graphData> = [];

    console.log('FILTRO USADO', filter);

    this.filteredData = [...this.requestedData];
    console.log("DADOS PARA FILTRAR", this.filteredData)


    this.filteredData = this.filteredData.filter((item: AccumulatedData) => {
/*       console.log("teste", filter.month == item.month); */


      const shouldInclude = (
        (!filter.indicator || filter.indicator === item.nome_do_indicador) &&
        (!filter.activity || filter.activity === item.nome_da_atividade) &&
        (!filter.month || filter.month == item.month) &&
        (!filter.year || filter.year == item.year)
      ) ;
      console.log(shouldInclude)
      return shouldInclude;
    });

    this.filteredData.forEach((item: AccumulatedData) => {

      data = this.filteredData.map((item: any) => ({
        activity: item.nome_da_atividade,
        indicator: item.nome_do_indicador,
        value: parseFloat(item.valor_mensal),
        month: item.month,
      }));
    });

    return data;
    console.log('DADOS PARA APRESENTAR:',this.data)
  }

  resetDataLists(){

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
