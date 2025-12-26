import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { SavingService } from '../../service/saving-service';
import { EmployeeService } from '../../service/employee-service';
import { SavingAndLoanRepayment } from '../model/saving';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Auth } from '../../auth/auth';
import { SharedService } from '../../core/sharedService/shared-service';


@Component({
  selector: 'app-saving-crud-componenets',
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
    NzStatisticModule,
    NzListModule,
    NzPaginationModule,
    NzIconModule
  ],

  templateUrl: './saving-crud-componenets.html',
  styleUrl: './saving-crud-componenets.css',
})
export class SavingCrudComponenets extends BaseComponent<SavingAndLoanRepayment> implements OnInit {

  saving: SavingAndLoanRepayment[] = [];
  searchControl = new FormControl('search');
  savingForm !: FormGroup;
  updateForm: boolean = false;
  updateId!: number;
  totalSaving: number = 0;
  searchTerm: any;
  employeeId: string = ''
  uploading: unknown;
  employeeOutstanding: number = 0;

  constructor(private savingService: SavingService,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    protected auth: Auth,
    private modalRef: NzModalRef,
    private sharedService: SharedService,
    modal: NzModalService,
    @Inject(NZ_MODAL_DATA) protected id: any
  ) {
    super(savingService, modal);
  }
  ngOnInit(): void {

    this.loadSavings();
    this.savingForm = this.fb.group({
      employee: this.fb.group({
        employeeId: [
          0,
          [
            Validators.required,
            // Validators.pattern('^[0-9]+$')
          ]
        ],
      }),
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      craSaving: [0, [Validators.required, Validators.min(0)]],
    });


  }




  loadSavings() {
    this.employeeId = this.id.id;
    this.getTotalSaving();
    this.getEmployeeOutstanding();
    this.savingService.getsavingByEmployeeId(this.id.id, this.pageIndex, this.pageSize).subscribe({

      next: (data) => {
        this.sharedService.setSavingByEmployeeId(data);
        this.saving = data.content;
        this.pageIndex = data.number;
        this.total = data.totalElements;
        this.pageSize = data.size;
        console.log("saving data loaded successfully", data)
      },
      error: (error) => {
        console.log("failed to load saving data", error)
      }
    });
  }

  updateSaving(update: boolean, id: number) {
    this.updateForm = update;
    this.id.status = 'update';
    this.updateId = id;
    this.savingService.getById(id).subscribe({
      next: (data) => {
        this.savingForm.addControl('id', new FormControl(data.id));
        this.savingForm.patchValue({
          employeeId: data.employee.id,
          fullName: data.fullName,
          craSaving: data.craSaving,
        });
        console.log("saving record loaded for update", data)
      },
      error: (error) => {
        console.log("failed to load saving record for update", error)
      }
    });

  }

  submitForm() {

    if (this.savingForm.valid && this.id.status === 'create') {
      this.savingService.create(this.savingForm.value).subscribe({
        next: (data) => {
          console.log("saving record created successfully", data)

          this.msg.success('Saving record created successfully.', data);
          this.modalRef.destroy();
        },
        error: (error) => {
          this.msg.error('Failed to create saving record. Error: ' + error);
        }
      })


    } else if (this.id.status === 'update' && this.savingForm.valid) {
      this.savingService.update(this.updateId, this.savingForm.value).subscribe({
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
    this.loadSavings();
  }
  onPageSizeChange($event: number) {

    this.pageSize = $event;
    this.loadSavings();
  }



  deleteAll() {

    this.modal.confirm({
      nzOkText: 'are you sure ?',
      nzOnOk: () => {






        this.savingService.deleteByEmployeeId(this.id.id).subscribe({
          next: (data) => {
            console.log("all saving records deleted successfully", data)
            this.modal.success({
              nzTitle: 'Success',
              nzContent: 'All saving records for employee ID ' + this.id.id + ' deleted successfully.'
            });
            this.loadSavings();
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
    })

  }

  deletebyId(id: number) {
    this.modal.confirm({
      nzOkText: 'are you sure ?',
      nzOnOk: () => {

        this.savingService.delete(id).subscribe({
          next: (data) => {
            console.log("saving record deleted successfully", data)
            this.modal.success({
              nzTitle: 'Success',
              nzContent: 'Saving record with id ' + id + ' deleted successfully.'
            });
            this.loadSavings();
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



  async getTotalSaving() {
    this.totalSaving = 0;
    this.savingService.findTotalByEmployeeId(this.employeeId).subscribe({
      next: (data: any) => {
        console.log("this total  data ", data)
        return this.totalSaving = data;
      }
    });


  }

  getEmployeeOutstanding() {
    this.employeeService.getById(Number(this.employeeId)).subscribe({
      next: (data: any) => {
        this.employeeOutstanding = data.outStanding;
      },
      error: (error) => {
        console.error("Failed to fetch employee outstanding", error);
      }
    });
  }




  trackByFn(index: number, item: any): number {
    return item.id;
  }



  cancelForm(): void {

    this.savingForm.reset();

  }



  haveRole(roleName: string) {

    const roles = this.auth.getUserRoles().map((role: any) => role.roleTypes.role);
    return roles.includes(roleName);
  }


}
