from odoo import http
from odoo.http import request
class Todos(http.Controller):
    @http.route(['/todo'], type='http', auth='public') 
    def todo_list(self):
     return request.render("todos.home")
    