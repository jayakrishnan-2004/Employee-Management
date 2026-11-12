
namespace EmployeeManagement.Api.Models
{
    public class Employee
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public int Age { get; set; }

        public string Phone { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Post { get; set; } = string.Empty;

        public decimal Salary { get; set; }
    }
}
