import { insertNewEmployee } from "../database/query";
import { insertWorkingTimeForEmployee } from "../seeder/seeder";

export default class Employee {
  id: string;
  department: string;
  address: string;
  division: string;
  dob: Date;
  email: string;
  name: string;
  phone: string;
  salary: number;
  status: string;

  constructor() {
    this.status = "Active";
  }

  public setId(id: string) {
    this.id = id;
  }
  public setDepartment(department: string) {
    this.department = department;
  }
  public setAddress(address: string) {
    this.address = address;
  }
  public setDivision(division: string) {
    this.division = division;
  }
  public setDob(dob: Date) {
    this.dob = dob;
  }
  public setEmail(email: string) {
    this.email = email;
  }
  public setName(name: string) {
    this.name = name;
  }
  public setPhone(phone: string) {
    this.phone = phone;
  }
  public setSalary(salary: number) {
    this.salary = salary;
  }
  public setStatus(status: string) {
    this.status = status;
  }

  public async insert() {
    await insertNewEmployee(this);
    insertWorkingTimeForEmployee(this.id);
  }
}
