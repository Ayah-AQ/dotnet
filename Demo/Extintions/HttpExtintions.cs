using Demo.Helpers;
using System.Text.Json;

namespace Demo.Extintions
{
    public static   class HttpExtintions
    {
        public static void AddPaginationHeader<T>(this HttpResponse response, pagedList<T> data )
        {
            var paginationHeader = new PaginationHeader(data.CurrentPage, data.PageSize, data.TotalCount, data.TotalPages);

            var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            response.Headers.Append("Pagination", JsonSerializer.Serialize(paginationHeader, jsonOptions));
            response.Headers.Append("Access-Control-Expose-Headers", "Pagination");// بدونها الكود ما بقرأ السطر اللي فوق (pagination can't read whats coming from the server)

        }
    }
}
