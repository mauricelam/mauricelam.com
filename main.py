import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template

class MainPage(webapp.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/html'

		template_values = {
			'hi':'hi'
		}

		path = os.path.join(os.path.dirname(__file__), 'site.html')
		self.response.out.write(template.render(path, template_values))

application = webapp.WSGIApplication([('/', MainPage)], debug=True)

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()