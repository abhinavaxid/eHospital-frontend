import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalTicketListComponent } from './medical-ticket-list.component';

describe('MedicalTicketListComponent', () => {
  let component: MedicalTicketListComponent;
  let fixture: ComponentFixture<MedicalTicketListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalTicketListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalTicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
