import setuptools

setuptools.setup(
    name="nb_extension_empinken",
    packages=['empinken'],
    #version=__version__, # Handled in setup.cfg and empinken/__init__.py
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
