import pkg_resources

#__version__ = pkg_resources.require("empinken")[0].version
#version_info = pkg_resources.parse_version(__version__)

def _jupyter_nbextension_paths():
    return [dict(section="notebook",
                 src="static",
                 dest="empinken",
                 require="empinken/main")]

def load_jupyter_server_extension(nbapp):
    nbapp.log.info("empinken enabled!")