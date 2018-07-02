/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({

    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },

    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app_js',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/animations': 'npm:@angular/animations/bundles/common.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
      '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
      '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      // other libraries
      'rxjs': 'npm:rxjs',
      'rxjs-compat': 'npm:rxjs-compat',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      '@agm/core': 'npm:@agm/core/core.umd.js',
      '@ngui/map': 'npm:@ngui/map/bundles/ngui-map.umd.js',
      'moment': 'node_modules/moment',
      'ngx-bootstrap': 'npm:ngx-bootstrap',
      'ng2-pdf-viewer': 'npm:ng2-pdf-viewer',
      'pdfjs-dist': 'npm:pdfjs-dist',
      'angular-translator': 'npm:angular-translator/bundles/angular-translator.js',
      'ng2-responsive': 'npm:ng2-responsive',
      'typescript': 'npm:typescript/lib/typescript.js'

    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: { defaultExtension: 'js', },
      rxjs: { defaultExtension: 'js', main: "index.js" },
      "rxjs-compat": { defaultExtension: 'js', main: "index.js" },
      "rxjs/operators": { "main": "index.js", "defaultExtension": "js" },
      "rxjs/internal-compatibility": { "main": "index.js", "defaultExtension": "js" },
      "rxjs/testing": { "main": "index.js", "defaultExtension": "js" },
      'rxjs/ajax': { main: 'index.js', defaultExtension: 'js' },
      'rxjs/webSocket': { main: 'index.js', defaultExtension: 'js' },
      '@agm/core': { defaultExtension: 'js' },
      '@ngui/map': { defaultExtension: 'js' },
      'ng2-bootstrap': { format: 'cjs', main: 'bundles/ng2-bootstrap.umd.js', defaultExtension: 'js' },
      'ngx-bootstrap': { format: 'cjs', main: 'bundles/ngx-bootstrap.umd.js', defaultExtension: 'js' },
      'moment': { main: 'moment.js', defaultExtension: 'js' },
      'ng2-pdf-viewer': { main: 'dist/index.js', defaultExtension: 'js' },
      'pdfjs-dist': { defaultExtension: 'js' },
      'angular-translator': { defaultExtension: 'js' },
      'ng2-responsive': { main: 'index.js', defaultExtension: 'js' }
    }
  });
})(this);
