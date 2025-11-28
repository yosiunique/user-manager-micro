import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../service/employee-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { Employee } from '../saving/model/saving';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzDrawerModule,
    NzFormModule,
    NzTagModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
    NzIconModule,
    NzInputNumberModule,
    
  ],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css']
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];
  drawerVisible = false;
  isEditMode = false;
  currentId?: number;

  employeeForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private message: NzMessageService
  ) {
    
    }

  ngOnInit(): void {
    this.initForm();
    ///this.loadEmployees();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      employeeFullName: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      outStanding: [0, Validators.required],
      emi: [0, Validators.required],
      loanId: ['', Validators.required],
      annualInterest: [0, Validators.required],
      period: [1, Validators.required],
      firstOutStanding: [0, Validators.required]
    });
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAll(1, 10).subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load employees');
        this.loading = false;
      }
    });
  }

  openDrawer(employee?: Employee): void {
    this.drawerVisible = true;
 this.initForm();
    if (employee) {
      this.isEditMode = true;
      this.currentId = employee.id;

      this.employeeForm.patchValue({
        ...employee,
        effectiveDate: employee.effectiveDate ? new Date(employee.effectiveDate) : null
      });

    } else {
      this.isEditMode = false;
      this.currentId = undefined;
      this.employeeForm.reset({
        status: 'ACTIVE',
        period: 1,
        outStanding: 0,
        firstOutStanding: 0
      });
    }
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  submitForm(): void {
    if (this.employeeForm.invalid) {
      this.message.error("Please fill all required fields");
      return;
    }

    const formValue: Employee = {
      ...this.employeeForm.value,
      effectiveDate: this.employeeForm.value.effectiveDate
        ? new Date(this.employeeForm.value.effectiveDate)
        : null
    };

    const request = this.isEditMode && this.currentId
      ? this.employeeService.update(this.currentId, formValue)
      : this.employeeService.create(formValue);

    request.subscribe({
      next: () => {
        this.message.success(this.isEditMode ? "Updated successfully" : "Created successfully");

        this.drawerVisible = false;
        this.loadEmployees();
      },
      error: () => {
        this.message.error("Failed to save employee");
      }
    });
  }

  deleteEmployee(id: number): void {
    this.employeeService.delete(id).subscribe({
      next: () => {
        this.message.success('Employee deleted');
        this.loadEmployees();
      },
      error: () => {
        this.message.error('Delete failed');
      }
    });
  }
}
