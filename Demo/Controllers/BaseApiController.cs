using Demo.Helpers;
using Microsoft.AspNetCore.Mvc;

//namespace Demo;
namespace Demo.Controllers;


[ServiceFilter(typeof(LogUserActivity))]
[ApiController]
[Route("[controller]")]

public class BaseApiController : ControllerBase
{

}
