import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { FooterComponent } from '../../components/ui/footer/footer.component';
import { ConsultDataFilterComponent } from '../../components/consult-data-filter/consult-data-filter.component'
import {DataGraphicComponent } from '../../components/data-graphic/data-graphic.component'
import { HttpClientModule } from '@angular/common/http'; 
import { DataService } from '../../services/data.service';
import { Indicator } from '../../models/indicator.model'
import { Filter } from '../../models/accumulatedDataFilter.model'



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

  filter: Filter = {
    indicator: "Consultas Marcadas e não Realizadas",
    month: "1", /* new Date().getMonth().toString(), */
    year: (new Date().getFullYear() - 1).toString()
  }

  data: any[] = [];

  constructor(private dataService: DataService) {};

  ngOnInit(): void {
    this.dataService.getAccumulatedIndicatorData().subscribe(
      (response) => {
        this.data = response;
        this.filterData(this.filter);

        console.log(`All data:` + this.data)
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  handleFilterData(event: Filter) {
    console.log('Received data from child:', event);
  
    this.filterData(event);
  }

  filterData(filter: Filter){
    this.filteredData = [...this.data];
        console.log(`indicatorFilter: ${filter.indicator}; yearFilter ${filter.year}; monthFilter ${filter.month}`)
    this.filteredData = this.filteredData.filter((item: Indicator) => {
/*       console.log(`Filter: ${filter.indicator}; item: ${item.nome_do_indicador}`) */
      const shouldInclude = (
        (!filter.indicator || filter.indicator === item.nome_do_indicador) &&
        (!filter.month || filter.month === item.month) &&
        (!filter.year || filter.year === item.year)
      );
      console.log(shouldInclude)
      return shouldInclude;
    });
  
   // console.log('Filtered data:', this.filteredData);
  }
}
