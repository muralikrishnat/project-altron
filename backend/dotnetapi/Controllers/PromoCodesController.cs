using dotnetapi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using dotnetapi.Services;

namespace dotnetapi.Controllers
{
    [ApiController]
    [Route("api/promo-codes")]
    public class PromoCodesController: ControllerBase
    {
         private readonly PromocodeService _promocodeService;

        public PromoCodesController(PromocodeService promocodeService)
        {
            _promocodeService = promocodeService;
        }

        [HttpGet]
        public ActionResult<List<PromoCodes>> Get() => _promocodeService.Get();
        
        [HttpGet("{id:length(24)}", Name = "GetPromocode")]
        public ActionResult<PromoCodes> Get(string id)
        {
            var book = _promocodeService.Get(id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        [HttpPost]
        public ActionResult<List<PromoCodes>> Create(PromoCodes book)
        {
            _promocodeService.Create(book);
            return  _promocodeService.Get();
        }

        [HttpPost("{id:length(24)}")]
        public ActionResult<List<PromoCodes>> Update(string id, PromoCodes bookIn)
        {
            var book = _promocodeService.Get(id);

            if (book == null)
            {
                return NotFound();
            }

            _promocodeService.Update(id, bookIn);
            return  _promocodeService.Get();
        }

        [HttpDelete("{id:length(24)}")]
        public ActionResult<List<PromoCodes>> Delete(string id)
        {
            var book = _promocodeService.Get(id);

            if (book == null)
            {
                return NotFound();
            }

            _promocodeService.Remove(book.Id);

            return  _promocodeService.Get();
        }

    }
}