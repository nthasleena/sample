import React, { Component } from 'react'
import {Catergories, Manufacturers} from './../../models/constants';
import {Logic} from '././../../models/logic';
import DropDownComponent from './../reusablecoponents/dropdowncomponent';
class ProductFormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  
             ProductId: 0,
             ProductName: '',
             CategoryName: '',
             Manufacturer: '',
             Price:0,   
             categories: Catergories,
             manufacturers:Manufacturers,
             products:[],
             columnHeaders:[],
             IsProductIdValid: true,   
             IsPriceValid: true,  
             IsProductNameValid: true,
             IsFormValid: true,
             IsCategoryNameValid:true,
             IsManufacturerValid:true,
             summary:[]
             
        }
        this.logic = new  Logic();
    }

    // the lifecycle method of component that will be executed 
    // after the render() method is completing its 
    // execution
    componentDidMount=()=>{
         let prds = this.logic.getProducts();

         // read first record from array and read its schema
         var firstRecord = prds[0];
         var recProperties = Object.keys(firstRecord);
         // iterate over the properties and add in colunHeaders
          
         this.setState({columnHeaders: recProperties}, ()=> {
             
         });
         this.validateForm("manufacturers",this.state.Manufacturer);
         this.validateForm("categories",this.state.CategoryName);
         // async method will executes before
         // the product is completely excuted
         // to wait for products to update
         // add a callback to setState
         this.setState({products:prds}, ()=>{
              console.log(JSON.stringify(this.state.products)); 
         });
          
    }


    handleChanges=(evt)=>{
        this.setState({[evt.target.name]:evt.target.value},()=>{});
        this.validateForm(evt.target.name, evt.target.value);
        
    }
    validateForm(name, value){
        if(name === "ProductId") {
            if(!this.state.products.some(item => item.ProductId ===parseInt(value))) {
                this.setState({IsProductIdValid:true});
                this.setState({IsFormValid:true});     
                this.setState({summary:[]})      
            } else {
               this.setState({IsProductIdValid:false});
               this.setState({IsFormValid:false});  
               this.state.summary.push('ProductId must be unique');
               
               this.setState({summary:this.state.summary}) 

            }
        }
        if(name === "ProductName") {
            if( value !=="" && value[0] === value[0].toUpperCase()) {
                this.setState({IsProductNameValid:true});
                this.setState({IsFormValid:true});     
                this.setState({summary:[]})                  
            } else {
               this.setState({IsProductNameValid:false});
               this.setState({IsFormValid:false}); 
               if(this.state.summary.indexOf('Product Name must start from Upper Case Character')===-1)
                  this.state.summary.push('Product Name must start from Upper Case Character');
               this.setState({summary:this.state.summary})  
            }
        }
        if(name === "manufacturers") {
            if( value!=="" && value!=="Select Data" ) {
                this.setState({IsManufacturerValid:true});
                this.setState({IsFormValid:true});   
                this.setState({summary:[]})                    
            } else {
               this.setState({IsManufacturerValid:false});
               this.setState({IsFormValid:false}); 
               this.state.summary.push('The Manufacturer Name must be selected');
               this.setState({summary:this.state.summary})  
            }
        }
        if(name === "categories") {
            if( value!==''  && value!=="Select Data") {
                this.setState({IsCategoryNameValid:true});
                this.setState({IsFormValid:true});  
                this.setState({summary:[]})                     
            } else {
               this.setState({IsCategoryNameValid:false});
               this.setState({IsFormValid:false}); 
               this.state.summary.push('The Category Name must be selected')
               this.setState({summary:this.state.summary})  
            }
        }
        if(name === "Price") {
            if((this.state.CategoryName==="Electronics" && value >2000) || (this.state.CategoryName==="Electrical" && value >500) || (this.state.CategoryName==="Food" && value >5))
            {
                this.setState({IsPriceValid:true});
                this.setState({IsFormValid:true}); 
                this.setState({summary:[]})        
            }
            else
            {
                this.setState({IsPriceValid:false});
               this.setState({IsFormValid:false});  
               this.state.summary.push('Electronics, should not be less than 2000  or Electrical, should not be less than 50 or Food, should not be less than 5')
               this.setState({summary:this.state.summary}) 
            } 
        }

    }
    clear=()=>{
        this.setState({ProductId:0});
        this.setState({ProductName:''});
        this.setState({CategoryName:''});
        this.setState({Manufacturer:''});
        this.setState({BasePrice:0});
    }
    getSelectedCategory=(val)=> {
        this.setState({CategoryName: val}, ()=>{});
        this.validateForm("categories",val);
    }
    getSelectedManufacturer=(val)=> {
        console.log(val);
        this.setState({Manufacturer: val}, ()=>{});
        this.validateForm("manufacturers",val);
    }
    save=()=>{
        // to read product values and update it in products array
        var prd = {
             ProductId: this.state.ProductId,
             ProductName: this.state.ProductName,
             CategoryName: this.state.CategoryName,
             Manufacturer: this.state.Manufacturer,
            Price: this.state.Price   
        };
        let prds = this.logic.addProduct(prd);
        this.setState({products:prds}, ()=>{
            console.log(JSON.stringify(this.state.products)); 
       });
    }
    render() { 
        return (
            <div className="container">
             <form>
                <div className="form-group">
                    <label>Product Id : <span  hidden={this.state.IsProductIdValid} className="text-danger" >*</span></label>
                    <input type="text" value={this.state.ProductId} 
                    name="ProductId" 
                    className="form-control" onChange={this.handleChanges.bind(this)}/>
                    
                </div>
                <div className="form-group">
                    <label>Product Name: <span  hidden={this.state.IsProductNameValid} className="text-danger">*</span></label>
                    <input type="text" value={this.state.ProductName} 
                    name="ProductName"
                    className="form-control" onChange={this.handleChanges.bind(this)}/>
                   
                </div>
                <div className="form-group">
                    <label>Category Name: <span  hidden={this.state.IsCategoryNameValid} className="text-danger">*</span></label>
                    <DropDownComponent data={this.state.CategoryName} 
                    dataSource={this.state.categories}
                    selectedValue={this.getSelectedCategory.bind(this)}
                    ></DropDownComponent>
                   {/*  <select type="text" value={this.state.CategoryName} 
                    name="CategoryName"
                    className="form-control" onChange={this.handleChanges.bind(this)}>
                      {
                          this.state.categories.map((cat,idx)=> (
                              <option key={idx}>{cat}</option>
                          ))
                      }
                    </select>*/}
                </div>
                <div className="form-group">
                    <label>Manufacturer Name: <span  hidden={this.state.IsManufacturerValid} className="text-danger">*</span></label>
                    <DropDownComponent data={this.state.Manufacturer} 
                    dataSource={this.state.manufacturers}
                    selectedValue={this.getSelectedManufacturer.bind(this)} 
                    ></DropDownComponent>
                   {/* <select type="text" value={this.state.Manufacturer} 
                    name="Manufacturer"
                    className="form-control" onChange={this.handleChanges.bind(this)}>
                    {
                        this.state.manufacturers.map((man,idx)=> (
                            <option key={idx}>{man}</option>
                        ))
                    }
                </select> */}
                </div>
                <div className="form-group">
                    <label>Base Price: <span  hidden={this.state.IsPriceValid} className="text-danger">*</span></label>
                    <input type="text" value={this.state.Price}
                    name="Price"
                    className="form-control" onChange={this.handleChanges.bind(this)}/>
                </div>
                <div className="form-group">
                <input type="button" value="Clear" className="btn btn-warning"
                  onClick={this.clear.bind(this)}/>
                <input type="button" value="Save" className="btn btn-success" disabled={!this.state.IsFormValid}
                onClick={this.save.bind(this)}/>
                
              </div>
              </form>
              <br/>
              <table className="table table-bordered table-striped table-dark">
                   <thead>
                      <tr>
                        {
                            this.state.columnHeaders.map((col,idx)=> (
                                <th key={idx}>{col}</th>
                            ))
                        }
                      </tr>
                   </thead> 
                   <tbody>
                   {
                    this.state.products.map((prd,idx) => (
                       <tr key={idx}>
                          {
                              this.state.columnHeaders.map((col,i)=> (
                                  <td key={i}>{prd[col]}</td>
                              ))
                          } 
                       </tr> 
                    ))
                }
                   </tbody>
              </table>
           {/*   <table className="table table-bordered table-striped table-dark">
                 <thead>
                   <tr>
                     <th>
                       Product Id
                     </th>
                     <th>
                     Product Name
                   </th>
                   </tr>
                 </thead>
                 <tbody>
                 {
                     this.state.products.map((prd,idx) => (
                        <tr key={idx}>
                        <td>{prd.ProductId}</td>
                        <td>{prd.ProductName}</td>
                      </tr> 
                     ))
                 }
                   
                 </tbody>
              </table>*/}
             <div>
                  <ValidationSummary data={this.state.summary} hidden={this.state.IsFormValid}/>
              </div>

            </div>
        );
    }
}
 


class ValidationSummary extends Component {
    render() {
        return (
            <div>
              {this.props.data.join(",")} 
            </div>
        )
    }
}

export default ProductFormComponent;