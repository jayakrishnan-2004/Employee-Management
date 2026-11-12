
using Microsoft.AspNetCore.Mvc;
using EmployeeManagement.Api.Models;
using System.Text.Json;

namespace EmployeeManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly string filePath;

        public EmployeesController(IWebHostEnvironment environment)
        {
            string dataFolder = Path.Combine(
                environment.ContentRootPath, "Data"
            );

            Directory.CreateDirectory(dataFolder);

            filePath = Path.Combine(dataFolder, "employees.json");

            if (!System.IO.File.Exists(filePath))
            {
                System.IO.File.WriteAllText(filePath, "[]");
            }
        }

        private async Task<List<Employee>> ReadEmployees()
        {
            string json = await System.IO.File.ReadAllTextAsync(filePath);

            return JsonSerializer.Deserialize<List<Employee>>(json)
                   ?? new List<Employee>();
        }

        private async Task SaveEmployees(List<Employee> employees)
        {
            string json = JsonSerializer.Serialize(
                employees,
                new JsonSerializerOptions { WriteIndented = true }
            );

            await System.IO.File.WriteAllTextAsync(filePath, json);
        }

        // GET: api/employees
        [HttpGet]
        public async Task<IActionResult> GetEmployees()
        {
            var employees = await ReadEmployees();
            return Ok(employees);
        }

        // POST: api/employees
        [HttpPost]
        public async Task<IActionResult> AddEmployee(Employee employee)
        {
            var employees = await ReadEmployees();

            employee.Id = employees.Count > 0
                ? employees.Max(e => e.Id) + 1
                : 1;

            employees.Add(employee);

            await SaveEmployees(employees);

            return Ok(employee);
        }

        // PUT: api/employees/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(
            int id, Employee updatedEmployee)
        {
            var employees = await ReadEmployees();

            var employee = employees.FirstOrDefault(e => e.Id == id);

            if (employee == null)
            {
                return NotFound("Employee not found");
            }

            employee.Name = updatedEmployee.Name;
            employee.Age = updatedEmployee.Age;
            employee.Phone = updatedEmployee.Phone;
            employee.Email = updatedEmployee.Email;
            employee.Post = updatedEmployee.Post;
            employee.Salary = updatedEmployee.Salary;

            await SaveEmployees(employees);

            return Ok(employee);
        }

        // DELETE: api/employees/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employees = await ReadEmployees();

            var employee = employees.FirstOrDefault(e => e.Id == id);

            if (employee == null)
            {
                return NotFound("Employee not found");
            }

            employees.Remove(employee);

            await SaveEmployees(employees);

            return Ok("Employee deleted successfully");
        }
    }
}
