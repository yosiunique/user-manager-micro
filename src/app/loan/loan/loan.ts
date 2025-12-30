import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { Loan } from '../../saving/model/saving';
import { LoanService } from '../../service/loan-service';
import { NzListModule } from "ng-zorro-antd/list";
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Auth } from '../../auth/auth';
import { Uploadingfile } from '../../uploadfile/uploadingfile/uploadingfile';

@Component({
  selector: 'app-loan',
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
    NzListModule,
    NzCardModule,
    NzPaginationModule,
    NzAvatarModule
  ],
  templateUrl: './loan.html',
  styleUrls: ['./loan.css'],
})
export class LoanComponent extends BaseComponent<Loan> implements OnInit {

  loans: Loan[] = [];
  drawerVisible = false;
  id?: number;
  myLoan?: Loan;
  loanForm!: FormGroup;
  searchTerm: string = '';
  searchSubject = new Subject<string>();
  destroy$ = new Subject<void>();
  avatarTemplate: TemplateRef<void> | null | undefined;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    protected override modal: NzModalService,
    protected auth: Auth,
    private message: NzMessageService,
    private route: ActivatedRoute
  ) {
    super(loanService, modal);
  }

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe(params => {
      const employeeId = params['employeeId'];
      if (employeeId) {
        this.getByEmployeeId(employeeId)
      } else {
        this.loadLoans();
      }
    });
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(value: string): void {
    if (!value || value.trim() === '') {
      this.loadLoans();
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
        return this.loanService.search(term);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data: any) => {
        this.loans = data.content;
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

  initForm(): void {
    this.loanForm = this.fb.group({
      loanId: ['', Validators.required],
      employee: this.fb.group({
        employeeId: ['', Validators.required]
      }),
      effectiveDate: [null, Validators.required],
      outStanding: [0, Validators.required],
      status: ['ACTIVE', Validators.required],
      emi: [0, Validators.required],
      annualInterest: [0, Validators.required],
      period: [0, Validators.required],
      firstOutStanding: [0, Validators.required]
    });
  }

  loadLoans(): void {
    this.loading = true;
    this.loanService.getAll(this.pageIndex, this.pageSize).subscribe({
      next: (data) => {
        this.loans = data.content;
        this.total = data.totalElements;
        this.pageSize = data.size;
        this.pageIndex = data.number;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load loans');
        this.loading = false;
      }
    });
  }

  onPageChange(index: number): void {
    this.pageIndex = index - 1;
    this.loadLoans();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 0;
    this.loadLoans();
  }

  openDrawer(loan?: Loan): void {
    this.drawerVisible = true;
    if (loan) {
      this.isEditMode = true;
      this.id = loan.id;
      this.loanForm.patchValue(loan);
    } else {
      this.isEditMode = false;
      this.id = undefined;
      this.loanForm.reset({
        status: 'ACTIVE',
        outStanding: 0,
        emi: 0,
        annualInterest: 0,
        period: 0,
        firstOutStanding: 0
      });
    }
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  submitForm(): void {
    if (this.loanForm.invalid) {
      this.message.error("Please fill all required fields");
      return;
    }

    const formValue: Loan = { ...this.loanForm.value };

    // Convert ID for delete logic if needed, but Loan ID is string
    const request = this.isEditMode && this.id
      ? this.loanService.update(this.id, formValue)
      : this.loanService.create(formValue);

    request.subscribe({
      next: () => {
        this.message.success(this.isEditMode ? "Loan updated" : "Loan created");
        this.drawerVisible = false;
        this.loadLoans();
      },
      error: (err) => {
        this.message.error(err.error?.message || "Operation failed");
      }
    });
  }

  deleteLoan(id: number): void {
    this.loanService.delete(id).subscribe({
      next: () => {
        this.message.success('Loan deleted');
        this.loadLoans();
      },
      error: () => {
        this.message.error('Delete failed');
      }
    });
  }

  getByEmployeeId(employeeId: string) {
    this.loanService.getById(employeeId).subscribe({
      next: (response) => {
        this.myLoan = response;
      },
      error: (err) => {
        this.message.error(err.error?.message || "Operation failed");
      }
    });
  }

  haveRole(roleName: string) {
    return this.auth.getUserRoles().some((role: any) => role.roleTypes.role === roleName);
  }

  uploadFileLoan() {
    this.modal.create({
      nzTitle: 'Uploading Loan File',
      nzContent: Uploadingfile,
      nzData: 'loan',
      nzOkText: null,
      nzCancelText: null
    });

    this.modal._afterAllClosed.subscribe({
      next: () => {
        this.loadLoans();
      }
    });
  }

}
