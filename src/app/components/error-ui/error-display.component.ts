import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export interface ErrorState {
  message: string;
  type?: 'network' | 'validation' | 'server' | 'unknown';
  code?: string;
  details?: string;
  timestamp?: Date;
}

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ErrorDisplayComponent {
  @Input() retryable: boolean = true;
  @Input() dismissible: boolean = true;
  @Input() showDetails: boolean = false;
  
  @Output() retryAction = new EventEmitter<void>();
  @Output() dismissError = new EventEmitter<void>();
  @Output() errorStateChange = new EventEmitter<ErrorState | null>();

  // Angular Signal for error state
  error = signal<ErrorState | null>(null);

  setError(errorState: ErrorState | null): void {
    this.error.set(errorState);
    this.errorStateChange.emit(errorState);
  }

  onRetry(): void {
    this.retryAction.emit();
  }

  onDismiss(): void {
    this.error.set(null);
    this.dismissError.emit();
  }

  get errorIcon(): string {
    const errorType = this.error()?.type;
    switch (errorType) {
      case 'network':
        return 'wifi-outline';
      case 'validation':
        return 'warning-outline';
      case 'server':
        return 'server-outline';
      default:
        return 'alert-circle-outline';
    }
  }

  get errorTypeClass(): string {
    const errorType = this.error()?.type || 'unknown';
    return `error-${errorType}`;
  }

  get containerClass(): string {
    return ['error-container', this.errorTypeClass].join(' ');
  }
}