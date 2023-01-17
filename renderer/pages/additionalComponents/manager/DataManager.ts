import React from "react";
import { queryAgeRatings, queryCategories, queryDepartments, queryDivisions, queryGenres, queryTypes } from "../../database/query";
import { Department } from "../interfaces/interface";
export class DataManager{
    private static instance;
    private departmentList;
    private divisionList;
    private genreList;
    private ageRatingList;
    private categoryList;
    private typeList;

    
    

    private constructor(){
      this.departmentList = queryDepartments()
        
      this.divisionList = queryDivisions()

      this.genreList = queryGenres()

      this.ageRatingList = queryAgeRatings()

      this.categoryList = queryCategories()

      this.typeList = queryTypes()
    }

    public async queryTypes(){
      queryTypes().then(e => {
        return e
      })
    }

    public async queryCategories(){
      queryCategories().then(e => {
        return e;
      })
    }

    public async queryGenres(){
      queryGenres().then(e => {
        return e;
      })
    }

    public async queryAgeRatings(){
      queryAgeRatings().then(e => {
        return e;
      })
    }

    public async queryDivisions(){
      queryDivisions().then((e) => {
        return e;
      })
    }

    public async queryDepartment(){
      queryDepartments().then((e) => {
        return e;
      })
    }

    

    static getInstance() {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager();
        }
        return DataManager.instance;
      }

      public  getDepartmentList(){
        return this.departmentList;
      }

      public  getDivisionList(){
        return this.divisionList;
      }

      public  getGenreList(){
        return this.genreList;
      }

      public  getAgeRatingList(){
        return this.ageRatingList;
      }
      public  getTypeList(){
        return this.typeList;
      }

      public  getCategoryList(){
        return this.categoryList;
      }
      

}