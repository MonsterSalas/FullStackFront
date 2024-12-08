import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AdminComponent } from './admin.component';
import Swal from 'sweetalert2';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let router: Router;

  beforeEach(async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    await TestBed.configureTestingModule({
      imports: [
        AdminComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with products array', () => {
      expect(component.productos.length).toBe(2);
      expect(component.productos[0].nombre).toBe('ASUS Prime H510M-E');
    });

    it('should initialize with null selected product index', () => {
      expect(component.productoSeleccionadoIndex).toBeNull();
    });

    it('should initialize form with empty values', () => {
      expect(component.editProductForm.value).toEqual({
        nombre: '',
        descripcion: '',
        precio: null
      });
    });
  });

  describe('abrirModalEditar', () => {
    it('should set selected product index', () => {
      component.abrirModalEditar(0);
      expect(component.productoSeleccionadoIndex).toBe(0);
    });

    it('should populate form with product data', () => {
      component.abrirModalEditar(0);
      expect(component.editProductForm.value).toEqual({
        nombre: 'ASUS Prime H510M-E',
        descripcion: 'Placa Madre ASUS Prime H510M-E',
        precio: 100
      });
    });
  });

  describe('guardarCambios', () => {
    beforeEach(() => {
      component.abrirModalEditar(0);
      component.editProductForm.patchValue({
        nombre: 'Nuevo Nombre',
        descripcion: 'Nueva Descripción',
        precio: 150
      });
    });

    it('should update product data', fakeAsync(() => {
      component.guardarCambios();
      tick();
      
      expect(component.productos[0].nombre).toBe('Nuevo Nombre');
      expect(component.productos[0].descripcion).toBe('Nueva Descripción');
      expect(component.productos[0].precio).toBe(150);
    }));

    it('should maintain original image', fakeAsync(() => {
      const originalImage = component.productos[0].imagen;
      component.guardarCambios();
      tick();
      
      expect(component.productos[0].imagen).toBe(originalImage);
    }));

    it('should reset selected index', fakeAsync(() => {
      component.guardarCambios();
      tick();
      
      expect(component.productoSeleccionadoIndex).toBeNull();
    }));

    it('should show success message and navigate', fakeAsync(() => {
      component.guardarCambios();
      tick();
      
      expect(Swal.fire).toHaveBeenCalled();
      tick(1000);
      expect(router.navigate).toHaveBeenCalledWith(['/admin']);
    }));

    it('should not update if no product selected', fakeAsync(() => {
      component.productoSeleccionadoIndex = null;
      component.guardarCambios();
      tick();
      
      expect(Swal.fire).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    }));
  });
});