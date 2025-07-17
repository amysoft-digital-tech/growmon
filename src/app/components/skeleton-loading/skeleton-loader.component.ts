import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export type SkeletonType = 'text' | 'card' | 'list' | 'avatar' | 'image' | 'custom';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class SkeletonLoaderComponent {
  @Input() type: SkeletonType = 'text';
  @Input() animated: boolean = true;
  @Input() repeat: number = 3;
  @Input() width: string = '100%';
  @Input() height: string = 'auto';
  
  @Output() loadingStateChange = new EventEmitter<boolean>();

  // Angular Signal for loading state
  loading = signal<boolean>(true);

  setLoading(isLoading: boolean): void {
    this.loading.set(isLoading);
    this.loadingStateChange.emit(isLoading);
  }

  get containerStyle(): any {
    return {
      width: this.width,
      height: this.height !== 'auto' ? this.height : null
    };
  }

  get skeletonClass(): string {
    return `skeleton-${this.type}`;
  }

  getRepeatArray(): number[] {
    return Array(this.repeat).fill(0).map((_, i) => i);
  }
}