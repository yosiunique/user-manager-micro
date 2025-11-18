import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Role, RoleTypes, RoleTypesDto, User, Roles} from '../model/user';
import { Userservice } from '../../service/userservice';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { filter, first, forkJoin, switchMap } from 'rxjs';
import { RoleService } from '../../service/role-service';
import { UserRoleService } from '../../service/user-role-service';
import { NzTableModule } from "ng-zorro-antd/table";
import { Auth } from '../../auth/auth';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

 interface types{
  id:number ;
  status:'isUpdate'|'isCreate'|'isRole'|'isReset'|null
}

@Component({
  selector: 'app-crete-update-user',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    NzButtonModule,
    NzCardModule,
    NzTableModule,
    NzTabsModule

],
  templateUrl: './crete-update-user.html',
  styleUrl: './crete-update-user.css',
})

export class CreteUpdateUser extends BaseComponent<User> implements OnInit {
haveRole(arg0: string): any {
throw new Error('Method not implemented.');
}

addNewUser() {
throw new Error('Method not implemented.');
}
onStatusChange($event: Event,_t242: any) {
throw new Error('Method not implemented.');
}
deleteUser(arg0: any) {
throw new Error('Method not implemented.');
}
updateUser(arg0: any) {
throw new Error('Method not implemented.');
}


  validateForm!: FormGroup;
  resetFromPassword !:FormGroup;
  roleForm !:FormGroup;
  roles:Role[]=[];
  users: any;
  allRoles:RoleTypesDto[]=[];

  constructor(private fb: FormBuilder
    ,
    protected  userService:Userservice,
     modal:NzModalService ,
     protected auth:Auth,
     protected userRole:UserRoleService ,
     protected role:RoleService ,
     private modalref:NzModalRef,
      @Inject(NZ_MODAL_DATA) protected operation: types,
  ) {
    super(userService ,modal);
  }

  ngOnInit(): void {    this.validateForm = this.fb.group({
      firstName:['',[Validators.required,Validators.minLength(1)]],
      lastName:['',[Validators.required,Validators.minLength(1)]],
      userName: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      attribute: ['', [Validators.required]],
    });
    this.resetFromPassword =this.fb.group({
id:''   ,   
password:[Validators.required,Validators.minLength(1)],
reenter:[Validators.required,Validators.minLength(1)],
reset:true,
 userName:[],
fisrtName:[],
lastName:[],
email:[],
attribute:[],   
role:[],
enable:[]


});

this.roleForm = this.fb.group({
  role:['', Validators.minLength(1)]
});   
   
   this.operation.status==='isUpdate'? this.updateForm(this.operation.id):this.operation.status==='isCreate';
   if(this.operation.status==='isReset'){
    this.resetFormBuilder()
   }
   if(this.operation.status==='isRole'){
    this.roles=[];
    this.getRoles(this.operation.id);
   this.loadRoles();
  }
}


  resetFormBuilder(){
  this.userService.getById(this.operation.id).subscribe({
    next:(data)=>{
     this.resetFromPassword.patchValue({  
      id:data.id,
      userName:data.userName,
      fisrtName:data.firstName,
      lastName:data.lastName,
      email:data.email,
      attribute:data.attribute,   
      reset:true,
     });
    },
    error:(error)=>{
      console.log("this error happen due to this root cause ..",error)
    }
  })
  }
  updateForm(id:number){
    this.userService.getById(id).subscribe({
      next:(response)=>{ 

        this.validateForm.patchValue({
          id:response.id,
          firstName:response.firstName,
          lastName:response.lastName,
          userName:response.userName,
          attribute:response.attribute,
          email:response.email,
          reset:true,
        });
        this.validateForm.get('userName')?.disable();
         this.validateForm.removeControl('password');
         
      },
      error:(error)=>{
        this.modal.error({
          nzTitle:'Error...',
          nzContent:'the root cause for this error is ' + error
        })
      }
    })
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('Form Submitted Successfully!', this.validateForm.value);
            const newUser: User = this.validateForm.value;

   if(this.operation.status==='isCreate') {
    this.userService.create(newUser).subscribe({
              next:(data)=>{
                this.modal.confirm({
                  nzContent: data
                })

              },
              error:(error)=>{
                this.modal.error({
                  nzContent:'alrady exist' +error
                })
              }
            });
          }
if(this.operation.status==='isUpdate'){
  this.userService.update(this.operation.id,newUser).subscribe({
     next:(data)=>{
                this.modal.confirm({
                  nzContent: data,
                })
              },
              error:(error)=>{
                this.modal.error({
                  nzContent:'alrady exist' +error
                })
              }
  });
  this.modalref.destroy();
}


    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      console.log('Form is invalid. Cannot submit.');
    }
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }


  resetPassword(){
    if(this.resetFromPassword.get('password')?.value !== this.resetFromPassword.get('reenter')?.value){
 this.resetFromPassword.get('password')?.setValue('');
 this.resetFromPassword.get('reenter')?.setValue('');
     this.modal.error({
      nzContent:'password and re-entered password do not match'
     });
     return;

    }
    const user:User= this.resetFromPassword.value;
           console.log("updated users  ",user);
this.userService.resetPassword(user).subscribe({
  next:(data:any)=>{
    this.modal.confirm({ 
      nzContent:data
    });
    this.modalref.destroy();        
  },
  error:(error)=>{
    this.modal.error({
      nzContent:'failed to reset password due to this root cause ' + error
    })
  }});

}


addNewRole(){
 const newRole:RoleTypes= this.roleForm.value;
 console.log("new role to be created  ",newRole);
this.role.create(newRole).subscribe({
  next:(data)=>{
    this.modal.confirm({    
      nzContent:data  

    });
  },
  error:(error)=>{
    this.modal.error({
      nzContent:'failed to create role due to this root cause ' + error
    })
  } 
});  

}

removeRole(){

}



assignRole(id: number) {
  forkJoin({
    user: this.userService.getById(this.operation.id).pipe(first()),
    role: this.role.getById(id).pipe(first())
  }).subscribe({
    next: ({ user, role }) => {
      console.log("user to be assigned: ", user);
      console.log("role to be assigned: ", role);

      const save :Roles= {
        user: user,
        roleTypes: role
      };

      console.log("data tets  to be saved ", save);

      this.userRole.create(save).subscribe({
        next: (data) => {
          this.modal.success({
            nzTitle: 'Success',
            nzContent: 'Role assigned successfully ✅'
          });
          console.log("Role assignment response: ", data);
          this.modalref.destroy();
        },
        error: (error) => {
          this.modal.error({
            nzTitle: 'Error',
            nzContent: 'Failed to assign role: ' + error.message
          });
          console.error("Error saving role assignment: ", error);
        }
      });
    },
    error: (error) => {
      this.modal.error({
        nzTitle: 'Error loading data',
        nzContent: 'Failed to load user or role: ' + error.message
      });
      console.error("Error fetching user/role data: ", error);
    }
  });
}

deleteRole(id:number){
this.userRole.delete(id).subscribe({
  next:(data)=>{
    this.modal.confirm({
      nzContent:data
    })
    this.modalref.destroy();
  },
  error:(error)=>{
    this.modal.error({
      nzContent:'error '+ error
    })
  }
})

}


getRoles(id: number) {
  this.userService.getById(id).pipe(
    first(),
    switchMap((user: User) => {
      console.log('User data:', user);
      const currentUserRoles: string[] = user.role.map(
        (r: any) => r.roleTypes.role
      );

      return this.userRole.getAll(this.pageIndex, this.pageSize).pipe(
        first(),
        switchMap((data: any) => {
          const filteredRoles = data.content.filter((role: any) =>
            currentUserRoles.includes(role.roleTypes.role)
          );
          return [filteredRoles];
        })
      );
    })
  ).subscribe({
    next: (filteredRoles: Role[]) => {
      this.roles = filteredRoles;
      
    },
    error: (err) => {
      console.error('the root cause is ', err);
    }
  });
}


loadRoles(){
   this.role.getAll(this.pageIndex,this.pageSize).subscribe({
      next:(data:any)=>{  
        this.allRoles=data.content;
        this.total=data.totalElements;
        this.pageSize=data.size;
        this.pageIndex=data.number;
        console.log("all roles ",this.allRoles);
      }
    })
   }



  onPageChange($event: number) {
 this.pageIndex=$event-1;
  this.loadRoles();
}
onPageSizeChange($event: number) {

  this.pageSize=$event;
  if(this.operation.status==='isRole'){
    this.loadRoles();
  }
  

}



}
