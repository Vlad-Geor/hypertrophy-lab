(self["webpackChunk_ikigaidev_source"] = self["webpackChunk_ikigaidev_source"] || []).push([["src-lib-carousel-carousel-component-stories"],{

/***/ "./libs/shared/ui/carousel/src/lib/carousel/carousel.component.css?ngResource":
/*!************************************************************************************!*\
  !*** ./libs/shared/ui/carousel/src/lib/carousel/carousel.component.css?ngResource ***!
  \************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../../../../node_modules/@angular-devkit/build-angular/node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/@angular-devkit/build-angular/node_modules/css-loader/dist/runtime/noSourceMaps.js");
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../../../node_modules/@angular-devkit/build-angular/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/@angular-devkit/build-angular/node_modules/css-loader/dist/runtime/api.js");
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ "./libs/shared/ui/carousel/src/lib/carousel/carousel.component.ts":
/*!************************************************************************!*\
  !*** ./libs/shared/ui/carousel/src/lib/carousel/carousel.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CarouselComponent: () => (/* binding */ CarouselComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _carousel_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./carousel.component.html?ngResource */ "./libs/shared/ui/carousel/src/lib/carousel/carousel.component.html?ngResource");
/* harmony import */ var _carousel_component_css_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./carousel.component.css?ngResource */ "./libs/shared/ui/carousel/src/lib/carousel/carousel.component.css?ngResource");
/* harmony import */ var _carousel_component_css_ngResource__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_carousel_component_css_ngResource__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2022/core.mjs");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2022/common.mjs");





let CarouselComponent = class CarouselComponent {};
CarouselComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'lib-carousel',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule],
  template: _carousel_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
  styles: [(_carousel_component_css_ngResource__WEBPACK_IMPORTED_MODULE_1___default())]
})], CarouselComponent);


/***/ }),

/***/ "./libs/shared/ui/carousel/src/lib/carousel/carousel.component.stories.ts":
/*!********************************************************************************!*\
  !*** ./libs/shared/ui/carousel/src/lib/carousel/carousel.component.stories.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Heading: () => (/* binding */ Heading),
/* harmony export */   Primary: () => (/* binding */ Primary),
/* harmony export */   __namedExportsOrder: () => (/* binding */ __namedExportsOrder),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Users_vlad_Desktop_Workspace_Projects_ikigaidev_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _carousel_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./carousel.component */ "./libs/shared/ui/carousel/src/lib/carousel/carousel.component.ts");
/* harmony import */ var _storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @storybook/testing-library */ "./node_modules/@storybook/testing-library/dist/index.mjs");
/* harmony import */ var _storybook_jest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @storybook/jest */ "./node_modules/@storybook/jest/dist/index.mjs");




const meta = {
  component: _carousel_component__WEBPACK_IMPORTED_MODULE_0__.CarouselComponent,
  title: 'CarouselComponent'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (meta);
const Primary = {
  args: {}
};
const Heading = {
  args: {},
  play: function () {
    var _ref = (0,_Users_vlad_Desktop_Workspace_Projects_ikigaidev_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(function* ({
      canvasElement
    }) {
      const canvas = (0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.within)(canvasElement);
      (0,_storybook_jest__WEBPACK_IMPORTED_MODULE_3__.expect)(canvas.getByText(/carousel works!/gi)).toBeTruthy();
    });
    return function play(_x) {
      return _ref.apply(this, arguments);
    };
  }()
};
;
const __namedExportsOrder = ["Primary", "Heading"];
Primary.parameters = {
  ...Primary.parameters,
  docs: {
    ...Primary.parameters?.docs,
    source: {
      originalSource: "{\n  args: {}\n}",
      ...Primary.parameters?.docs?.source
    }
  }
};
Heading.parameters = {
  ...Heading.parameters,
  docs: {
    ...Heading.parameters?.docs,
    source: {
      originalSource: "{\n  args: {},\n  play: async ({\n    canvasElement\n  }) => {\n    const canvas = within(canvasElement);\n    expect(canvas.getByText(/carousel works!/gi)).toBeTruthy();\n  }\n}",
      ...Heading.parameters?.docs?.source
    }
  }
};

/***/ }),

/***/ "./libs/shared/ui/carousel/src/lib/carousel/carousel.component.html?ngResource":
/*!*************************************************************************************!*\
  !*** ./libs/shared/ui/carousel/src/lib/carousel/carousel.component.html?ngResource ***!
  \*************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<div class=\"h-14 bg-red-500\">\n    Carousel Works!\n</div>";

/***/ }),

/***/ "?4f7e":
/*!********************************!*\
  !*** ./util.inspect (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ })

}]);
//# sourceMappingURL=src-lib-carousel-carousel-component-stories.iframe.bundle.js.map