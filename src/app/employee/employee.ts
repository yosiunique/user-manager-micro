import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeeService } from '../service/employee-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
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
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzContentComponent } from 'ng-zorro-antd/layout';
import { BaseComponent } from '../core/basecomponenet/basecomponenet';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    FormsModule,
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
    NzCardModule,
    NzListModule,
    NzGridModule,
    NzAvatarModule,
    NzPaginationModule,
    NzDividerModule,
    NzSkeletonModule
  ],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css']
})
export class EmployeeComponent extends BaseComponent<Employee> implements OnInit {

  employees: Employee[] = [];
  drawerVisible = false;
  currentId?: number;

  employeeForm!: FormGroup;
  searchTerm: string = '';
  searchSubject = new Subject<string>();
  destroy$ = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    protected override modal: NzModalService,
    private message: NzMessageService,
    private route: ActivatedRoute
  ) {
    super(employeeService, modal)
  }

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe(params => {
      const employeeId = params['employeeId'];
      if (employeeId) {
        this.searchTerm = employeeId;
        this.searchSubject.next(employeeId);
      } else {
        this.loadEmployees();
      }
    });
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.employeeService.getAll(this.pageIndex, this.pageSize).subscribe({
      next: (data) => {
        this.employees = data.content;
        this.total = data.totalElements;
        this.pageSize = data.size;
        this.pageIndex = data.number;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load employees');
        this.loading = false;
      }
    });
  }

  onPageChange(index: number): void {
    this.pageIndex = index - 1;
    this.loadEmployees();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 0;
    this.loadEmployees();
  }

  onSearchChange(value: string): void {
    if (!value || value.trim() === '') {
      this.loadEmployees();
      return;
    }
    this.searchSubject.next(value);
  }

  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading = true;
        this.pageIndex = 0;
        // Using the generic search from BaseService
        return this.employeeService.search(term);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data: any) => {
        this.employees = data.content;
        this.total = data.totalElements;
        this.pageSize = data.size;
        this.pageIndex = data.number;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error during search:', err);
        this.loading = false;
      }
    });
  }

  openDrawer(employee?: Employee): void {
    this.drawerVisible = true;
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
      next: (response) => {
        this.message.success(this.isEditMode ? "Updated successfully" + response : "Created successfully" + response);

        this.drawerVisible = false;
        this.loadEmployees();
      },
      error: (err) => {
        this.message.error("Error", err.error.message);
        console.log("this is message ...", err.error.message)
        this.drawerVisible = false;
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
