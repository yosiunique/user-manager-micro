import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { LoanRepayment } from '../model/loan-repaymenet';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SavingService } from '../../service/saving-service';
import { LoanRepaymentService } from '../../service/loan-repayment-service';
import { SharedService } from '../../core/sharedService/shared-service';
import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-loan-repayments-crud-componenets',
  standalone: true,
  imports: [
    NzTableModule, NzSwitchModule,
    CommonModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzUploadModule,
    NzProgressModule,
    NzDividerModule,
    NzFormModule,
    NzTagModule,
    FormsModule,
    NzTypographyModule,
    NzCardModule,
    NzListModule,
    NzPaginationModule,
    NzIconModule
  ],
  templateUrl: './loan-repayments-crud-componenets.html',
  styleUrl: './loan-repayments-crud-componenets.css',
})
export class LoanRepaymentsCrudComponenets extends BaseComponent<LoanRepayment> implements OnInit {
  loan: LoanRepayment[] = [];
  searchControl = new FormControl('search');
  loanForm !: FormGroup;
  updateForm: boolean = false;
  updateId!: number;
  employeeId: string = '';
  totalRepayments: number = 0;

  constructor(private loanRepaymentService: LoanRepaymentService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private modalRef: NzModalRef,
    private dataService: SharedService,
    protected auth: Auth,
    modal: NzModalService,
    @Inject(NZ_MODAL_DATA) protected id: any
  ) {
    super(loanRepaymentService, modal);
  }
  ngOnInit(): void {

    this.loadLoanRepayments();
    this.loanForm = this.fb.group({
      employeeId: ['', [Validators.required, Validators.maxLength(10)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      crassLoanRepayment: [0, [Validators.required, Validators.min(0)]],
    });


  }




  loadLoanRepayments() {
    this.employeeId = this.id.id;
    this.getTotalTotalRepaymets();
    this.loanRepaymentService.getLoanRepaymentByEmployeeId(this.id.id, this.pageIndex, this.pageSize).subscribe({

      next: (data) => {
        this.dataService.setLoanRepayById(data);
        this.loan = data.content;
        this.pageIndex = data.number;
        this.total = data.totalElements;
        this.pageSize = data.size;
        console.log("saving data loaded successfully", data)
      },
      error: (error) => {
        console.log("failed to load loan data", error)
      }
    });
  }

  updateLoansRepayments(update: boolean, id: number) {
    this.updateForm = update;
    this.id.status = 'update';
    this.updateId = id;
    this.loanRepaymentService.getById(id).subscribe({
      next: (data) => {
        this.loanForm.addControl('id', new FormControl(data.id));
        this.loanForm.patchValue({
          employeeId: data.employee.employeeId,
          fullName: data.fullName,
          crassLoanRepayment: data.crassLoanRepayment,
        });
        console.log("saving record loaded for update", data)
      },
      error: (error) => {
        console.log("failed to load saving record for update", error)
      }
    });

  }

  submitForm() {

    if (this.loanForm.valid && this.id.status === 'create') {
      this.loanRepaymentService.create(this.loanForm.value).subscribe({
        next: (data) => {
          console.log("loan record created successfully", data)

          this.msg.success('loan record created successfully.', data);
          this.modalRef.destroy();
        },
        error: (error) => {
          this.msg.error('Failed to create loan record. Error: ' + error);
        }
      })


    } else if (this.id.status === 'update' && this.loanForm.valid) {
      this.loanRepaymentService.update(this.updateId, this.loanForm.value).subscribe({
        next: (data) => {
          console.log("saving record updated successfully", data)
          this.msg.success('Saving record updated successfully.', data);
          this.modalRef.destroy();
        }
        ,
        error: (error) => {
          this.msg.error('Failed to update saving record. Error: ' + error);
        }
      })

    }



  }


  clear() {

  }

  onPageChange($event: number) {
    this.pageIndex = $event - 1;
    this.loadLoanRepayments();
  }
  onPageSizeChange($event: number) {

    this.pageSize = $event;
    this.loadLoanRepayments();
  }



  deleteAll() {
    this.modal.confirm({
      nzOkText: 'are you sure ?',
      nzOnOk: () => {

        this.loanRepaymentService.deleteByEmployeeId(this.id.id).subscribe({
          next: (data) => {
            console.log("all saving records deleted successfully", data)
            this.modal.success({
              nzTitle: 'Success',
              nzContent: 'All saving records for employee ID ' + this.id.id + ' deleted successfully.'
            });
            this.loadLoanRepayments();
            this.modalRef.destroy();
          },
          error: (error) => {
            console.log("failed to delete saving records", error)
            this.modal.error({
              nzTitle: 'Error',
              nzContent: 'Failed to delete saving records for employee ID ' + this.id.id + '. Error: ' + error
            });

          }
        });
      }
    });
  }

  deletebyId(id: number) {
    this.modal.confirm({
      nzOkText: 'are you sure ?',
      nzOnOk: () => {

        this.loanRepaymentService.delete(id).subscribe({
          next: (data) => {
            console.log("saving record deleted successfully", data)
            this.modal.success({
              nzTitle: 'Success',
              nzContent: 'Saving record with id ' + id + ' deleted successfully.'
            });
            this.loadLoanRepayments();
          },
          error: (error) => {
            console.log("failed to delete saving record", error)
            this.modal.error({
              nzTitle: 'Error',
              nzContent: 'Failed to delete saving record with id ' + id + '. Error: ' + error
            });

          }
        });
      }
    });

  }



  async getTotalTotalRepaymets() {


    this.loanRepaymentService.findTotalByEmployeeId(this.employeeId).subscribe({
      next: (data: any) => {
        this.totalRepayments = data;
      }
    });
    return this.totalRepayments;
  }




  ssumSaving(sum: number): number {


    return sum = sum + sum;
  }


  haveRole(roleName: string) {

    const roles = this.auth.getUserRoles().map((role: any) => role.roleTypes.role);
    return roles.includes(roleName);
  }


}
