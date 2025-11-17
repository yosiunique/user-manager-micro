import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { SavingService } from '../../service/saving-service';
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

@Component({
  selector: 'app-saving-crud-componenets',
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
    NzStatisticModule
],  
  templateUrl: './saving-crud-componenets.html',
  styleUrl: './saving-crud-componenets.css',
})
export class SavingCrudComponenets  extends BaseComponent<SavingAndLoanRepayment> implements OnInit {
calculateAverageSavings(): string|number {
throw new Error('Method not implemented.');
}
calculateTotalSavings(): string|number {
throw new Error('Method not implemented.');
}
createSaving() {
throw new Error('Method not implemented.');
}
onSearchChange($event: any) {
throw new Error('Method not implemented.');
}
handleChange($event: NzUploadChangeParam) {
throw new Error('Method not implemented.');
}
uploadFile() {
throw new Error('Method not implemented.');
}
reloadPage() {
throw new Error('Method not implemented.');
}
saving:SavingAndLoanRepayment[]=[];
  searchControl=new FormControl('search');
  savingForm !:FormGroup ;
  updateForm:boolean=false;
  updateId!:number;
  totalSaving:number=0;
searchTerm: any;
employeeId:string=''
uploading: unknown;
  constructor( private  savingService:SavingService ,
    private fb:FormBuilder,
    private msg : NzMessageService,
    private modalRef:NzModalRef,
    modal:NzModalService,
     @Inject(NZ_MODAL_DATA) protected id:any 
  ) { 
    super(savingService,modal);
  }
  ngOnInit(): void {
    
   this.loadSavings();
      this.savingForm = this.fb.group({
      employeeId: ['', [Validators.required, Validators.maxLength(10)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      craSaving: [0, [Validators.required, Validators.min(0)]],
    });


  }




  loadSavings(){
    this.employeeId=this.id.id;
    this.getTotalSaving();
    this.savingService.getsavingByEmployeeId(this.id.id,this.pageIndex,this.pageSize).subscribe({
      
      next:(data)=>{
        this.saving=data.content;
        this.pageIndex=data.number;
        this.total=data.totalElements;
       this.pageSize=data.size; 
        console.log("saving data loaded successfully",data)
      },
      error:(error)=>{
        console.log("failed to load saving data",error)
      }
    }); 
  }

  updateSaving(update:boolean ,id:number){
    this.updateForm=update;
    this.id.status='update';
    this.updateId=id;
    this.savingService.getById(id).subscribe({  
      next:(data)=>{
        this.savingForm.addControl('id',new FormControl(data.id));
        this.savingForm.patchValue({
          employeeId: data.employeeId,
          fullName: data.fullName,
          craSaving: data.craSaving,
        });
        console.log("saving record loaded for update",data)
      },
      error:(error)=>{
        console.log("failed to load saving record for update",error)
      }
    }); 

  }

 submitForm(){

    if (this.savingForm.valid && this.id.status==='create') {
this.savingService.create(this.savingForm.value).subscribe({
  next:(data)=>{
    console.log("saving record created successfully",data)  

    this.msg.success('Saving record created successfully.',data);
    this.modalRef.destroy();  
  },
  error:(error)=>{
    this.msg.error('Failed to create saving record. Error: '+error);
  }
    })


    } else if(this.id.status==='update' && this.savingForm.valid){
      this.savingService.update(this.updateId,this.savingForm.value).subscribe({
        next:(data)=>{
          console.log("saving record updated successfully",data)
          this.msg.success('Saving record updated successfully.',data);
          this.modalRef.destroy();  
        }
        ,
        error:(error)=>{
          this.msg.error('Failed to update saving record. Error: '+error);
        }
      })  

    }



 }


clear(){

}

    onPageChange($event: number) {
 this.pageIndex=$event-1;
  this.loadSavings();
}
onPageSizeChange($event: number) {

  this.pageSize=$event;
  this.loadSavings();
}



deleteAll(){

  this.modal.confirm({
    nzOkText:'are you sure ?',
    nzOnOk:()=>{






  this.savingService.deleteByEmployeeId(this.id.id).subscribe({
    next:(data)=>{
      console.log("all saving records deleted successfully",data)
      this.modal.success({  
        nzTitle: 'Success',
        nzContent: 'All saving records for employee ID '+this.id.id+' deleted successfully.' 
      });
      this.loadSavings();
      this.modalRef.destroy();
    },
    error:(error)=>{
      console.log("failed to delete saving records",error)
      this.modal.error({  
        nzTitle: 'Error',
        nzContent: 'Failed to delete saving records for employee ID '+this.id.id+'. Error: '+error 
      });
        
    }
  });



    }
  })

}

deletebyId(id:number){
    this.modal.confirm({
    nzOkText:'are you sure ?',
    nzOnOk:()=>{

  this.savingService.delete(id).subscribe({
    next:(data)=>{
      console.log("saving record deleted successfully",data)
      this.modal.success({  
        nzTitle: 'Success',
        nzContent: 'Saving record with id '+id+' deleted successfully.' 
      });
      this.loadSavings();
    },
    error:(error)=>{
      console.log("failed to delete saving record",error)
      this.modal.error({  
        nzTitle: 'Error',
        nzContent: 'Failed to delete saving record with id '+id+'. Error: '+error 
      });   

    }
  });
    }
    });

}



async getTotalSaving(){
  this.totalSaving=0;
 this.savingService.findTotalByEmployeeId(this.employeeId).subscribe({
    next:(data:any)=>{
      console.log("this total  data ", data)
 return this.totalSaving=data;
    }
  });

 
}


// // Component methods
// getProgressCircleValue(): string {
//   const total = this.getTotalSaving();
//   const circumference = 2 * Math.PI * 52;
//   const progress = total > 0 ? (total / 100000) * 100 : 0; // Adjust divisor as needed
//   const dasharray = `${(progress / 100) * circumference} ${circumference}`;
//   return dasharray;
// }

// getAverageSaving(): number {
//   if (!this.saving || this.saving.length === 0) return 0;
//   const total = this.getTotalSaving();
//   return total / this.saving.length;
// }

trackByFn(index: number, item: any): number {
  return item.id;
}

// exportToExcel(): void {
//   // Implement Excel export functionality
//   console.log('Exporting to Excel...');
// }

cancelForm(): void {
  // Implement form cancellation
  this.savingForm.reset();
  // Additional cancellation logic
}


// ssumSaving(craSaving:number):number{
// return craSaving=craSaving+craSaving;
// }


}
