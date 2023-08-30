import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductCategory } from '../product-categories/product-category';

import { ProductService } from './product.service';
import { BehaviorSubject, EMPTY,  Subject,  catchError,  combineLatest,  map } from 'rxjs';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent{
  pageTitle = 'Product List';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

 private categorySelectedSubject = new BehaviorSubject<number>(0);
 categorySelectedAction$ = this.categorySelectedSubject.asObservable();


 products$ = combineLatest([
  this.productService.productWithAdd$,
  this.categorySelectedAction$
])
  .pipe(
    map(([products, selectedCategoryId]) =>
      products.filter(product =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

    categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );



  constructor(private productService: ProductService ,
              private productCategoryService: ProductCategoryService) { }


  onAdd(): void {
   this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
