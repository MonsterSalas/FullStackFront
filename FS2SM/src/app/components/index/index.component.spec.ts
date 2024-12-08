import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { IndexComponent } from './index.component';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interface/producto.interface';
import Swal from 'sweetalert2';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  let productoService: jasmine.SpyObj<ProductoService>;
  let mockProductos: Producto[] = [
    { 
      nombre: 'Producto1', 
      precio: 100, 
      stock: 5, 
      descripcion: 'Descripción 1',
      categoria: 'Categoría 1'
    },
    { 
      nombre: 'Producto2', 
      precio: 200, 
      stock: 3,
      descripcion: 'Descripción 2',
      categoria: 'Categoría 2'
    }
  ];
  let localStorageMock: { [key: string]: string } = {};

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductoService', ['getAllProductos']);
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    spyOn(localStorage, 'getItem').and.callFake(key => localStorageMock[key]);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => {
      localStorageMock[key] = value;
    });

    await TestBed.configureTestingModule({
      imports: [IndexComponent],
      providers: [
        { provide: ProductoService, useValue: spy }
      ]
    }).compileComponents();

    productoService = TestBed.inject(ProductoService) as jasmine.SpyObj<ProductoService>;
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cargarProductos', () => {
    it('should load products successfully', fakeAsync(() => {
      productoService.getAllProductos.and.returnValue(of(mockProductos));
      component.ngOnInit();
      tick();
      expect(component.productos).toEqual(mockProductos);
    }));

    it('should handle error loading products', fakeAsync(() => {
      productoService.getAllProductos.and.returnValue(throwError(() => new Error()));
      spyOn(console, 'error');
      component.ngOnInit();
      tick();
      expect(Swal.fire).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    }));
  });

  describe('comprar', () => {
    beforeEach(() => {
      component.productos = mockProductos;
    });

    it('should add new product to cart', () => {
      component.comprar(mockProductos[0]);
      expect(component.carrito[mockProductos[0].nombre].cantidad).toBe(1);
      expect(Swal.fire).toHaveBeenCalled();
    });

    it('should increment existing product in cart', () => {
      component.comprar(mockProductos[0]);
      component.comprar(mockProductos[0]);
      expect(component.carrito[mockProductos[0].nombre].cantidad).toBe(2);
    });

    it('should not exceed stock limit', () => {
      for(let i = 0; i <= mockProductos[0].stock + 1; i++) {
        component.comprar(mockProductos[0]);
      }
      expect(component.carrito[mockProductos[0].nombre].cantidad).toBe(mockProductos[0].stock);
    });
  });

  describe('Cart Operations', () => {
    beforeEach(() => {
      component.carrito = {
        'Producto1': { producto: mockProductos[0], cantidad: 2 }
      };
    });

    it('should increment product quantity', () => {
      component.incrementarProducto('Producto1');
      expect(component.carrito['Producto1'].cantidad).toBe(3);
    });

    it('should not increment beyond stock', () => {
      for(let i = 0; i < 5; i++) {
        component.incrementarProducto('Producto1');
      }
      expect(component.carrito['Producto1'].cantidad).toBeLessThanOrEqual(mockProductos[0].stock);
    });

    it('should decrement product quantity', () => {
      component.disminuirProducto('Producto1');
      expect(component.carrito['Producto1'].cantidad).toBe(1);
    });

    it('should remove product when quantity reaches zero', () => {
      component.disminuirProducto('Producto1');
      component.disminuirProducto('Producto1');
      expect(component.carrito['Producto1']).toBeUndefined();
    });
  });

  describe('obtenerTotal', () => {
    it('should calculate correct total', () => {
      component.carrito = {
        'Producto1': { producto: mockProductos[0], cantidad: 2 },
        'Producto2': { producto: mockProductos[1], cantidad: 1 }
      };
      const expectedTotal = (mockProductos[0].precio * 2) + (mockProductos[1].precio * 1);
      expect(component.obtenerTotal()).toBe(expectedTotal);
    });

    it('should return zero for empty cart', () => {
      component.carrito = {};
      expect(component.obtenerTotal()).toBe(0);
    });
  });

  describe('actualizarCarrito', () => {
    it('should load cart from localStorage', () => {
      const mockCart = {
        'Producto1': { producto: mockProductos[0], cantidad: 1 }
      };
      localStorageMock['carrito'] = JSON.stringify(mockCart);
      component.actualizarCarrito();
      expect(component.carrito).toEqual(mockCart);
    });
  });
});