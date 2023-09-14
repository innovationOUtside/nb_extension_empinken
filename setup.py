import setuptools
from os import path

def get_long_description():
    with open(
        path.join(path.dirname(path.abspath(__file__)), "README.md"),
        encoding="utf8",
    ) as fp:
        return fp.read()

setuptools.setup(
    name="nb_extension_empinken",
    packages=['empinken'],
    #version=__version__, # Handled in setup.cfg and empinken/__init__.py
    author="Tony Hirst",
    author_email="tony.hirst@gmail.com",
    description="Empinken cell background colouring for class and nbclassic Jupyter notebooks.",
    long_description=get_long_description(),
    long_description_content_type="text/markdown",
    license='MIT',
    url='https://github.com/innovationOUtside/nb_extension_empinken',
    include_package_data=True,
    install_requires=[
        'notebook', 'jupyter_nbextensions_configurator'
    ],
    data_files=[
        # like `jupyter nbextension install --sys-prefix`
        ("share/jupyter/nbextensions/empinken", [
            "empinken/static/index.js", "empinken/static/empinken.yaml"
        ]),
        # like `jupyter nbextension enable --sys-prefix`
        ("etc/jupyter/nbconfig/notebook.d", [
            "jupyter-config/nbconfig/notebook.d/empinken.json"
        ])
    ],
    zip_safe=False
)
