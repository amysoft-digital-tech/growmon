import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class LoadingSpinnerComponent {
  @Input() message: string = '';
  @Input() spinnerType: string = 'crescent';
  @Input() color: string = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() overlay: boolean = false;
  
  @Output() loadingStateChange = new EventEmitter<boolean>();

  // Angular Signal for loading state
  loading = signal<boolean>(true);

  setLoading(isLoading: boolean): void {
    this.loading.set(isLoading);
    this.loadingStateChange.emit(isLoading);
  }

  get sizeClass(): string {
    return `loading-${this.size}`;
  }

  get containerClass(): string {
    const classes = ['loading-container', this.sizeClass];
    if (this.overlay) {
      classes.push('loading-overlay');
    }
    return classes.join(' ');
  }
}