import { Component, inject } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SavingService } from '../../service/saving-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { LoanRepaymentService } from '../../service/loan-repayment-service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { EmployeeService } from '../../service/employee-service';
import { ShareService } from '../../service/share-service';
import { LoanService } from '../../service/loan-service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-uploadingfile',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
    FormsModule,
    NzIconModule,
    NzUploadModule
  ],
  templateUrl: './uploadingfile.html',
  styleUrls: ['./uploadingfile.scss'],
})
export class Uploadingfile {

  private modal = inject(NzModalService);
  private savingService = inject(SavingService);
  private msg = inject(NzMessageService);
  private loanRepaymentService = inject(LoanRepaymentService);
  private modalRef = inject(NzModalRef);
  protected data: string = inject(NZ_MODAL_DATA);
  protected shareService = inject(ShareService);
  protected employeeService = inject(EmployeeService);
  protected loanService = inject(LoanService);

  selectedFile: File | null = null;
  uploading: boolean = false;
  forMonth: Date | null = new Date(); // Default to current month for convenience

  getTitle(): string {
    switch (this.data) {
      case 'saving': return 'Saving Data Upload';
      case 'loan-repayment': return 'Loan Repayments Upload';
      case 'employee': return 'Employee Data Import';
      case 'share': return 'Share Data Upload';
      case 'loan': return 'Loan Data Upload';
      default: return 'File Upload';
    }
  }

  getIcon(): string {
    switch (this.data) {
      case 'saving': return 'bank';
      case 'loan-repayment': return 'transaction';
      case 'employee': return 'team';
      case 'share': return 'pie-chart';
      case 'loan': return 'audit';
      default: return 'upload';
    }
  }

  canUpload(): boolean {
    if (!this.selectedFile || this.uploading) return false;
    if ((this.data === 'saving' || this.data === 'loan-repayment') && !this.forMonth) return false;
    return true;
  }
  beforeUpload = (file: NzUploadFile): boolean => {
    this.selectedFile = file as any;
    return false; // Prevent automatic upload
  };

  // For template compatibility with existing code
  handleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  // Handle successful file upload
  private handleUploadSuccess(res: any): void {
    this.msg.success('File uploaded successfully');
    this.selectedFile = null;
    this.forMonth = null;
    this.modalRef.close(true);
  }

  // Handle upload errors
  private handleUploadError(err: any): void {
    console.error('Upload error', err);
    this.modal.error({
      nzTitle: 'Upload Failed',
      nzContent: err.error?.message || 'There was an error while processing the CSV file. Please ensure the file format is correct.',
    });
  }

  // Unified upload router
  handleUpload(): void {
    if (!this.selectedFile) {
      this.msg.error('Please select a CSV file first');
      return;
    }

    const needsMonth = this.data === 'saving' || this.data === 'loan-repayment';
    if (needsMonth && !this.forMonth) {
      this.msg.error('Please select the month for this upload');
      return;
    }

    switch (this.data) {
      case 'saving':
        this.uploadFile();
        break;
      case 'loan-repayment':
        this.uploadFileLoan();
        break;
      case 'employee':
        this.uploadFileEmployee();
        break;
      case 'share':
        this.uploadFileShare();
        break;
      case 'loan':
        this.uploadFileLoanActual();
        break;
      default:
        this.msg.error('Unknown upload type');
    }
  }

  uploadFile(): void {
    this.uploading = true;
    this.savingService.importCsv(this.selectedFile!, this.forMonth!)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (res: any) => this.handleUploadSuccess(res),
        error: (err: any) => this.handleUploadError(err)
      });
  }

  uploadFileLoan(): void {
    this.uploading = true;
    this.loanRepaymentService.importCsv(this.selectedFile!, this.forMonth!)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (res: any) => this.handleUploadSuccess(res),
        error: (err: any) => this.handleUploadError(err)
      });
  }

  uploadFileEmployee(): void {
    this.uploading = true;
    this.employeeService.importCsv(this.selectedFile!)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (res: any) => this.handleUploadSuccess(res),
        error: (err: any) => this.handleUploadError(err)
      });
  }

  uploadFileShare() {
    this.uploading = true;
    this.shareService.importCsv(this.selectedFile!)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (res: any) => this.handleUploadSuccess(res),
        error: (err: any) => this.handleUploadError(err)
      });
  }

  uploadFileLoanActual() {
    this.uploading = true;
    this.loanService.importCsv(this.selectedFile!)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (res: any) => this.handleUploadSuccess(res),
        error: (err: any) => this.handleUploadError(err)
      });
  }

  reloadPage(): void {
    this.modalRef.close();
  }
}
