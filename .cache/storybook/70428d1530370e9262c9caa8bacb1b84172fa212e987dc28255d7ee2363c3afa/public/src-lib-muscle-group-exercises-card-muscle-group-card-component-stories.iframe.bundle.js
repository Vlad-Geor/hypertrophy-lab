(self["webpackChunk_ikigaidev_source"] = self["webpackChunk_ikigaidev_source"] || []).push([["src-lib-muscle-group-exercises-card-muscle-group-card-component-stories"],{

/***/ "./libs/hypertrophy-lab/ui/muscle-group-card/src/lib/muscle-group-exercises-card/muscle-group-card.component.ts":
/*!**********************************************************************************************************************!*\
  !*** ./libs/hypertrophy-lab/ui/muscle-group-card/src/lib/muscle-group-exercises-card/muscle-group-card.component.ts ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MuscleGroupCardComponent: () => (/* binding */ MuscleGroupCardComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _muscle_group_card_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./muscle-group-card.component.html?ngResource */ "./libs/hypertrophy-lab/ui/muscle-group-card/src/lib/muscle-group-exercises-card/muscle-group-card.component.html?ngResource");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2022/common.mjs");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2022/core.mjs");





let MuscleGroupCardComponent = class MuscleGroupCardComponent {
  muscleGroupExercises = _angular_core__WEBPACK_IMPORTED_MODULE_1__.input.required();
  static propDecorators = {
    muscleGroupExercises: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Input,
      args: [{
        isSignal: true,
        alias: "muscleGroupExercises",
        required: true,
        transform: undefined
      }]
    }]
  };
};
MuscleGroupCardComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Component)({
  selector: 'lib-muscle-group-card',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.TitleCasePipe],
  template: _muscle_group_card_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__
})], MuscleGroupCardComponent);


/***/ }),

/***/ "./libs/hypertrophy-lab/ui/muscle-group-card/src/lib/muscle-group-exercises-card/muscle-group-card.component.stories.ts":
/*!******************************************************************************************************************************!*\
  !*** ./libs/hypertrophy-lab/ui/muscle-group-card/src/lib/muscle-group-exercises-card/muscle-group-card.component.stories.ts ***!
  \******************************************************************************************************************************/
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
/* harmony import */ var _muscle_group_card_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./muscle-group-card.component */ "./libs/hypertrophy-lab/ui/muscle-group-card/src/lib/muscle-group-exercises-card/muscle-group-card.component.ts");
/* harmony import */ var _storybook_jest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @storybook/jest */ "./node_modules/@storybook/jest/dist/index.mjs");
/* harmony import */ var _storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @storybook/testing-library */ "./node_modules/@storybook/testing-library/dist/index.mjs");




const meta = {
  component: _muscle_group_card_component__WEBPACK_IMPORTED_MODULE_0__.MuscleGroupCardComponent,
  title: 'MuscleGroupCardComponent'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (meta);
const Primary = {
  args: {
    muscleGroupExercises: [{
      targetMuscle: 'biceps',
      sets: 3,
      equipment: 'dumbell',
      targetSubMuscle: 'long head',
      movement: 'curl',
      reps: 8,
      weight: 15,
      weightUnits: 'kg'
    }]
  }
};
const Heading = {
  args: {},
  play: function () {
    var _ref = (0,_Users_vlad_Desktop_Workspace_Projects_ikigaidev_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(function* ({
      canvasElement
    }) {
      const canvas = (0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.within)(canvasElement);
      (0,_storybook_jest__WEBPACK_IMPORTED_MODULE_3__.expect)(canvas.getByText(/muscle-group-card works!/gi)).toBeTruthy();
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
      originalSource: "{\n  args: {\n    muscleGroupExercises: [{\n      targetMuscle: 'biceps',\n      sets: 3,\n      equipment: 'dumbell',\n      targetSubMuscle: 'long head',\n      movement: 'curl',\n      reps: 8,\n      weight: 15,\n      weightUnits: 'kg'\n    }]\n  }\n}",
      ...Primary.parameters?.docs?.source
    }
  }
};
Heading.parameters = {
  ...Heading.parameters,
  docs: {
    ...Heading.parameters?.docs,
    source: {
      originalSource: "{\n  args: {},\n  play: async ({\n    canvasElement\n  }) => {\n    const canvas = within(canvasElement);\n    expect(canvas.getByText(/muscle-group-card works!/gi)).toBeTruthy();\n  }\n}",
      ...Heading.parameters?.docs?.source
    }
  }
};

/***/ }),

/***/ "./libs/hypertrophy-lab/ui/muscle-group-card/src/lib/muscle-group-exercises-card/muscle-group-card.component.html?ngResource":
/*!***********************************************************************************************************************************!*\
  !*** ./libs/hypertrophy-lab/ui/muscle-group-card/src/lib/muscle-group-exercises-card/muscle-group-card.component.html?ngResource ***!
  \***********************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "@let groupedExercises = muscleGroupExercises(); @let muscleGroupedExercise =\ngroupedExercises[0];\n\n<div class=\"w-[200px] px-2 py-2 rounded-2xl text-white relative\">\n  <!-- Add wrapping div to apply relavite + z-index on all children -->\n  <div class=\"relative z-20\">\n    <h2 class=\"font-heading text-xl mb-2\">\n      {{ muscleGroupedExercise?.targetMuscle | titlecase }}\n    </h2>\n    @for (exercise of groupedExercises; track $index) { @if ($index < 2) {\n    <h3 class=\"font-heading text-secondary-light text-sm\">\n      {{ exercise.sets + ' Sets' }}\n    </h3>\n    <div class=\"flex justify-between text-xs font-medium mb-3\">\n      <p class=\"truncate w-3/4\">\n        {{\n          exercise.equipment +\n            ' ' +\n            exercise.targetSubMuscle +\n            ' ' +\n            exercise.movement | titlecase\n        }}\n      </p>\n      @if (exercise.weight && exercise.weightUnits) {\n      <p class=\"text-secondary-light\">\n        {{ exercise.weight + (exercise.weightUnits || 'kg') }}\n      </p>\n      } @else if (exercise.equipment === 'bodyweight') {\n      <p class=\"text-secondary-light\">\n        BW{{ exercise.weight ? '/' + exercise.weight + 'kg' : '' }}\n      </p>\n      }\n    </div>\n    } }\n    <!-- @if (groupedExercises.length >2) {\n    <p\n      class=\"text-secondary-light font-heading text-xs absolute bottom-0 right-0\"\n    >\n      + {{ groupedExercises.length - 2 }} More\n    </p>\n    } -->\n  </div>\n  <img\n    class=\"absolute top-0 left-0 right-0 bottom-0 h-full w-full object-fill rounded-2xl\"\n    src=\"https://i.ytimg.com/vi/in7PaeYlhrM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBc5PpCXomvXx1M8fszowi5zdlXhA\"\n    alt=\"Picture of athele performing a bicep curl\"\n  />\n  <div\n    class=\"absolute top-0 left-0 right-0 bottom-0 bg-black-text opacity-80 rounded-2xl z-10\"\n  ></div>\n</div>\n";

/***/ }),

/***/ "?4f7e":
/*!********************************!*\
  !*** ./util.inspect (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ })

}]);
//# sourceMappingURL=src-lib-muscle-group-exercises-card-muscle-group-card-component-stories.iframe.bundle.js.map