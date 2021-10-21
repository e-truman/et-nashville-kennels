import React, { useState, useRef, useEffect } from "react"
import { useParams, useHistory } from 'react-router-dom'
import { addEmployee } from "./EmployeeManager"
import { getLocations } from "../location/LocationManager"
import { getAnimals } from "../animal/AnimalManager"
import "./Employees.css"

export const EmployeeForm = () => {
    const name = useRef(null)
    const location = useRef(null)
    const animal = useRef(null)
    const { employeeId } = useParams()
    const history = useHistory()
    const [employee, setEmployee] = useState({})
    const [employees, setEmployees] = useState({})
    const [animals, setAnimals] = useState([])
    const [locations, setLocations] = useState([])


    const editMode = employeeId ? true : false  // true or false

    const handleControlledInputChange = (event) => {
        /*
            When changing a state object or array, always create a new one
            and change state instead of modifying current one
        */
        const newEmployee = Object.assign({}, employee)          // Create copy
        newEmployee[event.target.name] = event.target.value    // Modify copy
        setEmployee(newEmployee)                                 // Set copy as new state
    }

    /*
        Get animal state and location state on initialization.
    */
        useEffect(() => {
            if (editMode) {
                getEmployeeById(employeeId).then((res) => {
                    setEmployee(res)
                })
            }
            getLocations().then(locationsData => setLocations(locationsData))
        }, [])



    const constructNewEmployee = () => {
            // debugger
            const locationId = parseInt(employee.locationId)
    
            if (locationId === 0) {
                window.alert("Please select a location")
            } else {
                if (editMode) {
                    // PUT
                    updateEmployee({
                        id: employee.id,
                        name: employee.name,
                        address: employee.address,
                        location_id: employee.location_id
                    })
                        .then(() => history.push("/employees"))
                } else {
                    // POST
                    addEmployee({
                        id: employee.id,
                        name: employee.name,
                        address: employee.address,
                        location_id: employee.location_id
                    })
                        .then(() => history.push("/employees"))
                }
            }
        }
        
    

    return (
        <form className="employeeForm">
            <h2 className="employeeForm__title">New Employee</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="employeeName">Employee name: </label>
                    <input type="text" id="employeeName" ref={name} required autoFocus className="form-control" placeholder="Employee name" defaultValue={employee.name}
                        onChange={handleControlledInputChange}/>
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="employeeName">Employee address: </label>
                    <input type="text" id="employeeAddress" ref={name} required autoFocus className="form-control" placeholder="Employee address" defaultValue={employee.address}
                        onChange={handleControlledInputChange}/>
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="location">Assign to location: </label>
                    <select  value={employee.location_id} name="location" ref={location} id="employeeLocation" className="form-control" onChange={handleControlledInputChange}>
                        <option value="0">Select a location</option>
                        {locations.map(e => (
                            <option key={e.id} value={e.id}>
                                {e.name}
                            </option>
                        ))}
                    </select>
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="location">Caretaker for: </label>
                    <select defaultValue="" name="animal" ref={animal} id="employeeAnimal" className="form-control" >
                        <option value="0">Select an animal</option>
                        {animals.map(e => (
                            <option key={e.id} value={e.id}>
                                {e.name}
                            </option>
                        ))}
                    </select>
                </div>
            </fieldset>
            <button type="submit"
                onClick={evt => {
                    evt.preventDefault() // Prevent browser from submitting the form
                    constructNewEmployee()
                }}
                className="btn btn-primary">
                Save Employee
            </button>
        </form>
    )
}
