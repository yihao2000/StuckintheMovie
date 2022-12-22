import { addDoc, collection, Timestamp } from "@firebase/firestore";
import { app, database } from "../database/firebaseconfig";
import { hashPassword } from "../utils/encryptor";
import { faker } from "@faker-js/faker";

const coll_employees = collection(database, "employees");
const coll_divisions = collection(database, "divisions");
const coll_departments = collection(database, "departments");
const coll_workingTime = collection(database, "workingtime");
const coll_workingTimeDetail = collection(database, "workingtimedetail");

export const seedWorkingTime = () => {
  addDoc(coll_workingTime, {
    id: "1",
    workingday: 1,
    starthour: 7,
    startminute: 20,
    endhour: 18,
    endminute: 20,
  });

  addDoc(coll_workingTime, {
    id: "2",
    workingday: 1,
    starthour: 9,
    startminute: 20,
    endhour: 19,
    endminute: 20,
  });
  addDoc(coll_workingTime, {
    id: "3",
    workingday: 2,
    starthour: 7,
    startminute: 20,
    endhour: 18,
    endminute: 20,
  });
  addDoc(coll_workingTime, {
    id: "4",
    workingday: 2,
    starthour: 7,
    startminute: 20,
    endhour: 19,
    endminute: 20,
  });
  addDoc(coll_workingTime, {
    id: "5",
    workingday: 3,
    starthour: 7,
    startminute: 20,
    endhour: 18,
    endminute: 20,
  });
  addDoc(coll_workingTime, {
    id: "6",
    workingday: 3,
    starthour: 7,
    startminute: 20,
    endhour: 19,
    endminute: 20,
  });
  addDoc(coll_workingTime, {
    id: "7",
    workingday: 4,
    starthour: 7,
    startminute: 20,
    endhour: 18,
    endminute: 20,
  });
  addDoc(coll_workingTime, {
    id: "8",
    workingday: 4,
    starthour: 9,
    startminute: 20,
    endhour: 19,
    endminute: 20,
  });
  addDoc(coll_workingTime, {
    id: "9",
    workingday: 5,
    starthour: 7,
    startminute: 20,
    endhour: 18,
    endminute: 20,
  });
  addDoc(coll_workingTime, {
    id: "10",
    workingday: 5,
    starthour: 7,
    startminute: 20,
    endhour: 19,
    endminute: 20,
  });
  addDoc(coll_workingTime, {
    id: "11",
    workingday: 6,
    starthour: 8,
    startminute: 20,
    endhour: 15,
    endminute: 20,
  });
  addDoc(coll_workingTime, {
    id: "12",
    workingday: 6,
    starthour: 10,
    startminute: 20,
    endhour: 17,
    endminute: 20,
  });
};

export const seedDivisions = () => {
  addDoc(coll_divisions, {
    id: "1",
    name: "Schedule Division",
  });

  addDoc(coll_divisions, {
    id: "2",
    name: "Front Office Division",
  });

  addDoc(coll_divisions, {
    id: "3",
    name: "Operation Division",
  });

  addDoc(coll_divisions, {
    id: "4",
    name: "Kitchen Division",
  });
};

export const seedDepartments = () => {
  addDoc(coll_departments, {
    id: "1",
    name: "Manager",
  });

  addDoc(coll_departments, {
    id: "2",
    name: "Human Resource Department",
  });

  addDoc(coll_departments, {
    id: "3",
    name: "Accounting & Finance Deparment",
  });

  addDoc(coll_departments, {
    id: "4",
    name: "Storage Department",
  });

  addDoc(coll_departments, {
    id: "5",
    name: "External Department",
  });

  addDoc(coll_departments, {
    id: "6",
    name: "Promotion and Event Department",
  });

  addDoc(coll_departments, {
    id: "7",
    name: "Movie Department",
  });

  addDoc(coll_departments, {
    id: "8",
    name: "Cafe Department",
  });

  addDoc(coll_departments, {
    id: "9",
    name: "Administrator Department",
  });
};

export const insertWorkingTimeForEmployee = (employeeid: string) => {
  const mondayShift = Math.floor(Math.random() * 2) + 1 + "";
  const tuesdayShift = Math.floor(Math.random() * 2) + 3 + "";
  const wednesdayShift = Math.floor(Math.random() * 2) + 5 + "";
  const thursdayShift = Math.floor(Math.random() * 2) + 7 + "";
  const fridayShift = Math.floor(Math.random() * 2) + 9 + "";
  const saturdayShift = Math.floor(Math.random() * 2) + 11 + "";

  addDoc(coll_workingTimeDetail, {
    employeeid: employeeid,
    workingtimeid: mondayShift,
  });
  addDoc(coll_workingTimeDetail, {
    employeeid: employeeid,
    workingtimeid: tuesdayShift,
  });
  addDoc(coll_workingTimeDetail, {
    employeeid: employeeid,
    workingtimeid: wednesdayShift,
  });
  addDoc(coll_workingTimeDetail, {
    employeeid: employeeid,
    workingtimeid: thursdayShift,
  });
  addDoc(coll_workingTimeDetail, {
    employeeid: employeeid,
    workingtimeid: fridayShift,
  });
  addDoc(coll_workingTimeDetail, {
    employeeid: employeeid,
    workingtimeid: saturdayShift,
  });
};

export const seedEmployee = () => {
  addDoc(coll_employees, {
    id: "200803",
    name: "Andrew Giovanni",
    dob: faker.date.birthdate({ min: 17, max: 45, mode: "age" }),
    address: "ASDSADAS",
    email: "ASdsadsa",
    password: hashPassword("andrew"),
    phone: "12312",
    salary: 203222,
    department: "2",
    division: "None",
  });
  // addDoc(coll_employees, {
  //   id: "200803",
  //   name: "Andrew",
  //   dob: Timestamp.fromDate(new Date("20 August 2003")),
  //   address: "Test Address 123",
  //   email: "andrew@andrew.com",
  //   password: hashPassword("andrew"),
  //   phone: "081317210326",
  //   salary: 2500000,
  //   department: "2",
  // }).then((v) => console.log(v));

  for (var i = 0; i < 10; i++) {
    addDoc(coll_employees, createRandomEmployee(i));
  }
};

function pad(num) {
  let s = num + "";
  while (s.length < 3) s = "0" + s;
  return s;
}
function createRandomEmployee(i: number) {
  const department = Math.floor(Math.random() * 9) + 1 + "";
  var division = "None";
  if (department == "7") {
    division = Math.floor(Math.random() * 3) + 1 + "";
  } else if (department == "8") {
    division = Math.floor(Math.random() * 2) + 1 + "";
  }

  var id;
  if (division != "None") {
    id = Number(department) + Number(division) * 100 + "" + "-" + pad(i);
  } else {
    id = Number(department) + 5 * 100 + "" + "-" + pad(i);
    console.log("MASUk");
  }

  const sex = faker.name.sexType();
  const firstName = faker.name.firstName(sex);
  const lastName = faker.name.lastName();
  const name = firstName + " " + lastName;

  const email = faker.internet.email(firstName, lastName, "sitm.com");
  const dob = faker.date.birthdate({ min: 17, max: 45, mode: "age" });
  const address =
    faker.address.secondaryAddress() +
    faker.address.streetAddress() +
    faker.address.cityName();
  const password = firstName + "!";
  const salary = Math.floor(Math.random() * 2000) + 500;
  const phoneNumber = faker.phone.number("501-###-###");

  insertWorkingTimeForEmployee(id);

  return {
    id: id,
    name: name,
    dob: dob,
    address: address,
    email: email,
    password: hashPassword(password),
    phone: phoneNumber,
    salary: salary,
    department: department,
    division: division,
  };
}
