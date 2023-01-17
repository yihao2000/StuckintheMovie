import Employee from "../employee";

export class EmployeeBuilder{
    employee: Employee;

    constructor() {
      this.employee = new Employee()
    }

    public setId(id: string) {
        this.employee.id = id;
        return this;
      }
      public setDepartment(department: string) {
        this.employee.department = department;
        return this;
      }
      public setAddress(address: string) {
        this.employee.address = address;
        return this;
      }
      public setDivision(division: string) {
        this.employee.division = division;
        return this;
      }
      public setDob(dob: Date) {
        this.employee.dob = dob;
        return this;
      }
      public setEmail(email: string) {
        this.employee.email = email;
        return this;
      }
      public setName(name: string) {
        this.employee.name = name;
        return this;
      }
      public setPhone(phone: string) {
        this.employee.phone = phone;
        return this;
      }
      public setSalary(salary: number) {
        this.employee.salary = salary;
        return this;
      }
      public setStatus(status: string) {
        this.employee.status = status;
        return this;
      }

      public build(){
        return this.employee;
      }


  }