import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not render when not empty', () => {
      component.isEmpty.set(false);
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.empty-state-container')).toBeFalsy();
    });

    it('should render when empty', () => {
      component.isEmpty.set(true);
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.empty-state-container')).toBeTruthy();
    });
  });

  describe('Content Display', () => {
    beforeEach(() => {
      component.isEmpty.set(true);
      component.title = 'No Plants Found';
      component.message = 'Start by adding your first plant';
      component.actionText = 'Add Plant';
      fixture.detectChanges();
    });

    it('should display title', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('No Plants Found');
    });

    it('should display message', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Start by adding your first plant');
    });

    it('should display action button', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Add Plant');
    });

    it('should display icon when provided', () => {
      component.icon = 'leaf-outline';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('ion-icon[name="leaf-outline"]')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      component.isEmpty.set(true);
      component.actionText = 'Add Plant';
      fixture.detectChanges();
    });

    it('should emit action event when action button clicked', () => {
      spyOn(component.actionClick, 'emit');
      
      const actionButton = fixture.nativeElement.querySelector('.empty-action-button');
      actionButton.click();
      
      expect(component.actionClick.emit).toHaveBeenCalled();
    });

    it('should hide action button when no action text', () => {
      component.actionText = '';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.empty-action-button')).toBeFalsy();
    });
  });

  describe('Empty State Types', () => {
    beforeEach(() => {
      component.isEmpty.set(true);
      fixture.detectChanges();
    });

    it('should apply default styling', () => {
      const container = fixture.nativeElement.querySelector('.empty-state-container');
      expect(container.classList.contains('empty-default')).toBe(true);
    });

    it('should apply search empty styling', () => {
      component.type = 'search';
      fixture.detectChanges();
      
      const container = fixture.nativeElement.querySelector('.empty-state-container');
      expect(container.classList.contains('empty-search')).toBe(true);
    });

    it('should apply error empty styling', () => {
      component.type = 'error';
      fixture.detectChanges();
      
      const container = fixture.nativeElement.querySelector('.empty-state-container');
      expect(container.classList.contains('empty-error')).toBe(true);
    });
  });

  describe('Angular Signals Integration', () => {
    it('should work with isEmpty signal', () => {
      const emptySignal = component.isEmpty;
      expect(emptySignal()).toBe(false);
      
      component.setEmpty(true);
      expect(emptySignal()).toBe(true);
    });

    it('should emit empty state changes', () => {
      spyOn(component.emptyStateChange, 'emit');
      
      component.setEmpty(true);
      expect(component.emptyStateChange.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.isEmpty.set(true);
      fixture.detectChanges();
    });

    it('should have proper ARIA attributes', () => {
      const container = fixture.nativeElement.querySelector('.empty-state-container');
      expect(container.getAttribute('role')).toBe('status');
      expect(container.getAttribute('aria-live')).toBe('polite');
    });

    it('should have screen reader text', () => {
      const srText = fixture.nativeElement.querySelector('.sr-only');
      expect(srText).toBeTruthy();
      expect(srText.textContent).toContain('No content available');
    });
  });

  describe('Call-to-Action Guidance', () => {
    it('should guide users with appropriate actions', () => {
      component.isEmpty.set(true);
      component.title = 'No Plants Yet';
      component.message = 'Get started by adding your first plant to track its growth';
      component.actionText = 'Add Your First Plant';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Get started by adding');
      expect(compiled.textContent).toContain('Add Your First Plant');
    });

    it('should provide different guidance for search results', () => {
      component.isEmpty.set(true);
      component.type = 'search';
      component.title = 'No Results Found';
      component.message = 'Try adjusting your search criteria';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('No Results Found');
      expect(compiled.textContent).toContain('adjusting your search');
    });
  });
});