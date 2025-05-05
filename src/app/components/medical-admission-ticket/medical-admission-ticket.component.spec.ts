import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalAdmissionTicketComponent } from './medical-admission-ticket.component';

describe('MedicalAdmissionTicketComponent', () => {
  let component: MedicalAdmissionTicketComponent;
  let fixture: ComponentFixture<MedicalAdmissionTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalAdmissionTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalAdmissionTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
