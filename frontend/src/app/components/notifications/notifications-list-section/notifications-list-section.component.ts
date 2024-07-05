import { Component, OnInit, HostListener,  ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';


// export interface Notificacao {
//   nome: string;
//   assunto: string;
//   mensagem: string;
//   data: string;
//   respondido: boolean;
// }

// const ELEMENT_DATA: Notificacao[] = [
//   { nome: 'João', assunto: 'Assunto 1', mensagem: 'Mensagem de exemplo', data: '04/07/2024', respondido: false },
// ];


// @Component({
//   selector: 'app-notifications-list-section',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatSidenavModule,
//     MatIconModule,
//     MatListModule,
//     MatInputModule,
//     MatButtonModule,
//     MatTableModule,
//     MatCheckboxModule,
//     MatFormFieldModule],
//   templateUrl: './notifications-list-section.component.html',
//   styleUrl: './notifications-list-section.component.scss'
// })

// export class NotificationsListSectionComponent {
//   displayedColumns: string[] = ['nome', 'assunto', 'mensagem', 'data', 'respondido'];
//   dataSource = ELEMENT_DATA;
// }



interface TimelineItem {
  title: string;
  detail: string; 
}
 
@Component({
  selector: 'app-notifications-list-section',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule],
  templateUrl: './notifications-list-section.component.html',
  styleUrls: ['./notifications-list-section.component.scss']
})
export class NotificationsListSectionComponent implements OnInit, AfterViewInit {
  @ViewChild('timeline', { static: false }) timeline: ElementRef | undefined;

  timelineItems: TimelineItem[] = [
    { title: '1934', detail: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium' },
    { title: '1937', detail: 'Proin quam velit, efficitur vel neque vitae, rhoncus commodo mi.' },
    { title: '1940', detail: 'Proin iaculis, nibh eget efficitur varius, libero tellus porta dolor.' },
    { title: '1943', detail: 'In mattis elit vitae odio posuere, nec maximus massa varius.' },
    { title: '1946', detail: 'In mattis elit vitae odio posuere, nec maximus massa varius.' },
    { title: '1956', detail: 'In mattis elit vitae odio posuere, nec maximus massa varius.' },
    { title: '1957', detail: 'In mattis elit vitae odio posuere, nec maximus massa varius.' },
    { title: '1967', detail: 'Aenean condimentum odio a bibendum rhoncus.' },
    { title: '1977', detail: 'Vestibulum porttitor lorem sed pharetra dignissim.' },
    { title: '1985', detail: 'In mattis elit vitae odio posuere, nec maximus massa varius.' },
    { title: '2000', detail: 'In mattis elit vitae odio posuere, nec maximus massa varius.' },
    { title: '2005', detail: 'In mattis elit vitae odio posuere, nec maximus massa varius.' }
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.checkElementsInView(); // Chama a verificação após a inicialização da view
    this.cdr.detectChanges(); // Detecta mudanças explicitamente
  }
  

  ngOnInit() {
    //this.checkElementsInView(); // Chama a verificação após a inicialização da view
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.checkElementsInView(); // Reavalia a visibilidade dos elementos ao rolar a página
  }

  private checkElementsInView() {
    if (!this.timeline) return; // Retorna se a referência para a timeline não estiver definida

    const timelineItems = this.timeline.nativeElement.querySelectorAll('.timeline ul li');
    timelineItems.forEach((item: HTMLElement) => {
      const bounding = item.getBoundingClientRect();
      if (
        bounding.top >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      ) {
        item.classList.add('in-view');
      } else {
        item.classList.remove('in-view');
      }
    });
  }

  isElementInView(item: TimelineItem): boolean {
    const elements = document.querySelectorAll('.timeline ul li div');
    let elementInView = false;

    elements.forEach((element) => {
      if (element.textContent?.includes(item.title)) {
        const bounding = element.getBoundingClientRect();
        if (
          bounding.top >= 0 &&
          bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        ) {
          elementInView = true;
        }
      }
    });

    return elementInView;
  }
}
