import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearBucketRow } from './gear-bucket-row';

describe('GearBucketRow', () => {
  let component: GearBucketRow;
  let fixture: ComponentFixture<GearBucketRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GearBucketRow],
    }).compileComponents();

    fixture = TestBed.createComponent(GearBucketRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
