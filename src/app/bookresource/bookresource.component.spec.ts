import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookresourceComponent } from './bookresource.component';

describe('BookresourceComponent', () => {
  let component: BookresourceComponent;
  let fixture: ComponentFixture<BookresourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookresourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
