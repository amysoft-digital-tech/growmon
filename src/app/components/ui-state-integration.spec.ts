import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoadingSpinnerComponent } from './loading-states/loading-spinner.component';
import { ErrorDisplayComponent, ErrorState } from './error-ui/error-display.component';
import { SkeletonLoaderComponent } from './skeleton-loading/skeleton-loader.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';

// Test host component that integrates all UI state components
@Component({
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner
      [message]="loadingMessage"
      [spinnerType]="'dots'"
      [color]="'primary'"
      [size]="'medium'"
      (loadingStateChange)="onLoadingChange($event)">
    </app-loading-spinner>

    <!-- Error Display -->
    <app-error-display
      [retryable]="true"
      [dismissible]="true"
      [showDetails]="true"
      (retryAction)="onRetry()"
      (dismissError)="onDismissError()"
      (errorStateChange)="onErrorChange($event)">
    </app-error-display>

    <!-- Skeleton Loader -->
    <app-skeleton-loader
      [type]="'list'"
      [animated]="true"
      [repeat]="3"
      width="100%"
      (loadingStateChange)="onSkeletonChange($event)">
    </app-skeleton-loader>

    <!-- Empty State -->
    <app-empty-state
      [title]="'No Plants Found'"
      [message]="'Start by adding your first plant to begin tracking'"
      [icon]="'leaf-outline'"
      [actionText]="'Add Plant'"
      [type]="'default'"
      (actionClick)="onAddPlant()"
      (emptyStateChange)="onEmptyChange($event)">
    </app-empty-state>
  `,
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    ErrorDisplayComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    IonicModule
  ]
})
class TestHostComponent {
  loadingMessage = 'Loading plants...';
  
  // Event handlers
  onLoadingChange(loading: boolean) {}
  onRetry() {}
  onDismissError() {}
  onErrorChange(error: ErrorState | null) {}
  onSkeletonChange(loading: boolean) {}
  onAddPlant() {}
  onEmptyChange(empty: boolean) {}
}

describe('UI State Components Integration', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Integration', () => {
    it('should create host component with all UI state components', () => {
      expect(component).toBeTruthy();
    });

    it('should render loading spinner component', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-loading-spinner')).toBeTruthy();
    });

    it('should render error display component', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-error-display')).toBeTruthy();
    });

    it('should render skeleton loader component', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-skeleton-loader')).toBeTruthy();
    });

    it('should render empty state component', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-empty-state')).toBeTruthy();
    });
  });

  describe('UI State Management Flow', () => {
    it('should simulate complete data loading flow', () => {
      // 1. Start with loading state
      const loadingSpinner = fixture.debugElement.query(sel => 
        sel.nativeElement.tagName === 'APP-LOADING-SPINNER'
      ).componentInstance;
      
      expect(loadingSpinner.loading()).toBe(true);

      // 2. Simulate loading completion
      loadingSpinner.setLoading(false);
      fixture.detectChanges();
      
      expect(loadingSpinner.loading()).toBe(false);
    });

    it('should simulate error state handling', () => {
      const errorDisplay = fixture.debugElement.query(sel => 
        sel.nativeElement.tagName === 'APP-ERROR-DISPLAY'
      ).componentInstance;

      // Set error state
      const testError: ErrorState = {
        message: 'Failed to load plants',
        type: 'network',
        code: 'NETWORK_ERROR'
      };
      
      errorDisplay.setError(testError);
      fixture.detectChanges();
      
      expect(errorDisplay.error()).toEqual(testError);
    });

    it('should simulate empty state display', () => {
      const emptyState = fixture.debugElement.query(sel => 
        sel.nativeElement.tagName === 'APP-EMPTY-STATE'
      ).componentInstance;

      // Set empty state
      emptyState.setEmpty(true);
      fixture.detectChanges();
      
      expect(emptyState.isEmpty()).toBe(true);
    });

    it('should simulate skeleton loading transition', () => {
      const skeletonLoader = fixture.debugElement.query(sel => 
        sel.nativeElement.tagName === 'APP-SKELETON-LOADER'
      ).componentInstance;

      // Start with skeleton loading
      expect(skeletonLoader.loading()).toBe(true);

      // Transition to content loaded
      skeletonLoader.setLoading(false);
      fixture.detectChanges();
      
      expect(skeletonLoader.loading()).toBe(false);
    });
  });

  describe('User Interaction Flows', () => {
    it('should handle retry action from error state', () => {
      spyOn(component, 'onRetry');
      
      const errorDisplay = fixture.debugElement.query(sel => 
        sel.nativeElement.tagName === 'APP-ERROR-DISPLAY'
      ).componentInstance;

      // Set error to show retry button
      errorDisplay.setError({ message: 'Test error' });
      fixture.detectChanges();

      // Trigger retry
      errorDisplay.onRetry();
      
      expect(component.onRetry).toHaveBeenCalled();
    });

    it('should handle add action from empty state', () => {
      spyOn(component, 'onAddPlant');
      
      const emptyState = fixture.debugElement.query(sel => 
        sel.nativeElement.tagName === 'APP-EMPTY-STATE'
      ).componentInstance;

      // Set empty state to show action button
      emptyState.setEmpty(true);
      fixture.detectChanges();

      // Trigger action
      emptyState.onActionClick();
      
      expect(component.onAddPlant).toHaveBeenCalled();
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have proper ARIA attributes on all components', () => {
      const compiled = fixture.nativeElement;
      
      // Check loading spinner accessibility
      const loadingElement = compiled.querySelector('[role="status"]');
      expect(loadingElement).toBeTruthy();
      
      // Check error display accessibility
      const errorElement = compiled.querySelector('[role="alert"]');
      expect(errorElement).toBeTruthy();
    });

    it('should provide screen reader support', () => {
      const compiled = fixture.nativeElement;
      const srElements = compiled.querySelectorAll('.sr-only');
      
      // Should have screen reader text for each component
      expect(srElements.length).toBeGreaterThan(0);
    });
  });

  describe('Angular Signals Integration', () => {
    it('should properly integrate with Angular Signals pattern', () => {
      // Test that all components use Angular Signals for state management
      const loadingSpinner = fixture.debugElement.query(sel => 
        sel.nativeElement.tagName === 'APP-LOADING-SPINNER'
      ).componentInstance;
      
      const errorDisplay = fixture.debugElement.query(sel => 
        sel.nativeElement.tagName === 'APP-ERROR-DISPLAY'
      ).componentInstance;
      
      const skeletonLoader = fixture.debugElement.query(sel => 
        sel.nativeElement.tagName === 'APP-SKELETON-LOADER'
      ).componentInstance;
      
      const emptyState = fixture.debugElement.query(sel => 
        sel.nativeElement.tagName === 'APP-EMPTY-STATE'
      ).componentInstance;

      // Verify all components have signal-based state
      expect(typeof loadingSpinner.loading).toBe('function'); // Signal
      expect(typeof errorDisplay.error).toBe('function'); // Signal
      expect(typeof skeletonLoader.loading).toBe('function'); // Signal
      expect(typeof emptyState.isEmpty).toBe('function'); // Signal
    });
  });

  describe('Performance Optimization', () => {
    it('should improve perceived performance with skeleton loading', () => {
      const skeletonLoader = fixture.debugElement.query(sel => 
        sel.nativeElement.tagName === 'APP-SKELETON-LOADER'
      ).componentInstance;

      // Skeleton should be visible immediately
      expect(skeletonLoader.loading()).toBe(true);
      
      // Should provide immediate visual feedback
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.skeleton-container')).toBeTruthy();
    });

    it('should provide smooth transitions between states', () => {
      // Test CSS animations and transitions are applied
      const compiled = fixture.nativeElement;
      const containers = compiled.querySelectorAll('.skeleton-fade, .loading-container, .error-container');
      
      expect(containers.length).toBeGreaterThan(0);
    });
  });
});

describe('Real-world Usage Scenarios', () => {
  // Test component that simulates a real plant management page
  @Component({
    template: `
      <div class="plant-management-page">
        <!-- Loading State -->
        <app-loading-spinner
          *ngIf="pageState() === 'loading'"
          message="Loading your plants..."
          spinnerType="dots"
          color="primary">
        </app-loading-spinner>

        <!-- Skeleton Loading -->
        <app-skeleton-loader
          *ngIf="pageState() === 'skeleton'"
          type="list"
          [repeat]="5"
          [animated]="true">
        </app-skeleton-loader>

        <!-- Error State -->
        <app-error-display
          *ngIf="pageState() === 'error'"
          [retryable]="true"
          (retryAction)="loadPlants()">
        </app-error-display>

        <!-- Empty State -->
        <app-empty-state
          *ngIf="pageState() === 'empty'"
          title="No Plants Yet"
          message="Start your growing journey by adding your first plant"
          icon="leaf-outline"
          actionText="Add Your First Plant"
          (actionClick)="addPlant()">
        </app-empty-state>

        <!-- Content State (simulated) -->
        <div *ngIf="pageState() === 'content'" class="plant-list">
          <p>Plant content would go here...</p>
        </div>
      </div>
    `,
    standalone: true,
    imports: [
      LoadingSpinnerComponent,
      ErrorDisplayComponent,
      SkeletonLoaderComponent,
      EmptyStateComponent,
      IonicModule
    ]
  })
  class PlantManagementPageComponent {
    pageState = signal<'loading' | 'skeleton' | 'error' | 'empty' | 'content'>('loading');

    loadPlants() {
      this.pageState.set('loading');
      // Simulate API call
      setTimeout(() => {
        this.pageState.set('empty'); // Simulate empty result
      }, 1000);
    }

    addPlant() {
      console.log('Navigate to add plant page');
    }
  }

  let component: PlantManagementPageComponent;
  let fixture: ComponentFixture<PlantManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantManagementPageComponent, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlantManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should handle complete page state flow', () => {
    expect(component).toBeTruthy();
    expect(component.pageState()).toBe('loading');
  });

  it('should transition between different UI states', () => {
    // Start in loading state
    expect(component.pageState()).toBe('loading');
    
    // Transition to skeleton
    component.pageState.set('skeleton');
    fixture.detectChanges();
    expect(component.pageState()).toBe('skeleton');
    
    // Transition to error
    component.pageState.set('error');
    fixture.detectChanges();
    expect(component.pageState()).toBe('error');
    
    // Transition to empty
    component.pageState.set('empty');
    fixture.detectChanges();
    expect(component.pageState()).toBe('empty');
    
    // Transition to content
    component.pageState.set('content');
    fixture.detectChanges();
    expect(component.pageState()).toBe('content');
  });
});