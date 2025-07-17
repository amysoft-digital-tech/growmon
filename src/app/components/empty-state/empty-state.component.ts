import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export type EmptyStateType = 'default' | 'search' | 'error' | 'filter';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class EmptyStateComponent {
  @Input() title: string = 'No Data Available';
  @Input() message: string = 'There is currently no data to display';
  @Input() icon: string = '';
  @Input() actionText: string = '';
  @Input() type: EmptyStateType = 'default';
  
  @Output() actionClick = new EventEmitter<void>();
  @Output() emptyStateChange = new EventEmitter<boolean>();

  // Angular Signal for empty state
  isEmpty = signal<boolean>(false);

  setEmpty(empty: boolean): void {
    this.isEmpty.set(empty);
    this.emptyStateChange.emit(empty);
  }

  onActionClick(): void {
    this.actionClick.emit();
  }

  get defaultIcon(): string {
    if (this.icon) return this.icon;
    
    switch (this.type) {
      case 'search':
        return 'search-outline';
      case 'error':
        return 'alert-circle-outline';
      case 'filter':
        return 'funnel-outline';
      default:
        return 'document-outline';
    }
  }

  get containerClass(): string {
    return `empty-state-container empty-${this.type}`;
  }
}