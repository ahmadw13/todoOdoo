# -*- coding: utf-8 -*-
{
    'name': "Todos",
    'category': "base",
    'version': "1.0.0",
    'author': '',
    'depends': ['base','web'],
    'data': [
        'views/index.xml',
    ],
    'assets': {
        'todos.assets_task': [
            # bootstrap
            ('include', 'web._assets_helpers'),
            'web/static/src/scss/pre_variables.scss',
            'web/static/lib/bootstrap/scss/_variables.scss',
            ('include', 'web.assetsbootstrap'),

            'web/static/src/libs/fontawesome/css/font-awesome.css', # required for fa icons
            'web/static/src/legacy/js/promise_extension.js', # required by boot.js
            'web/static/src/boot.js', # odoo module system
            'web/static/src/env.js', # required for services
            'web/static/src/session.js', # expose __session_info containing server information
            'web/static/lib/owl/owl.js', # owl library
            'web/static/lib/owl/odoo_module.js', # to be able to import "@odoo/owl"
            'web/static/src/core/utils/functions.js',
            'web/static/src/core/browser/browser.js',
            'web/static/src/core/registry.js',
            'web/static/src/core/assets.js',
            'web/static/src/core/network/rpc_service.js',
            'web/static/src/core/utils/hooks.js',
            'todos/static/src/**/*'
        ]
    },
    'installable': True,
    'application': True
}