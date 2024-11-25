"use strict";
self["webpackHotUpdate_ikigaidev_source"]("src-lib-muscle-group-exercises-card-muscle-group-card-stories",{

/***/ "./libs/hypertrophy-lab/ui/muscle-group-card/src/lib/muscle-group-exercises-card/muscle-group-card.stories.ts":
/*!********************************************************************************************************************!*\
  !*** ./libs/hypertrophy-lab/ui/muscle-group-card/src/lib/muscle-group-exercises-card/muscle-group-card.stories.ts ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Default: () => (/* binding */ Default),
/* harmony export */   MultipleExercises: () => (/* binding */ MultipleExercises),
/* harmony export */   __namedExportsOrder: () => (/* binding */ __namedExportsOrder),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _muscle_group_card_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./muscle-group-card.component */ "./libs/hypertrophy-lab/ui/muscle-group-card/src/lib/muscle-group-exercises-card/muscle-group-card.component.ts");

const meta = {
  title: 'MuscleGroupCard',
  component: _muscle_group_card_component__WEBPACK_IMPORTED_MODULE_0__.MuscleGroupCardComponent,
  tags: ['autodocs'],
  argTypes: {
    muscleGroupExercises: {
      control: 'object'
    }
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (meta);
const Default = {
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
const MultipleExercises = {
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
    }, {
      targetMuscle: 'abs',
      sets: 3,
      equipment: 'machine',
      targetSubMuscle: 'lower chest',
      movement: 'crunch',
      reps: 8,
      weight: 15,
      weightUnits: 'kg'
    }, {
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
Default.parameters = {
  layout: 'centered',
  docs: {
    description: {
      story: 'This component displays a muscle group and its associated exercises.'
    }
  }
};
;
const __namedExportsOrder = ["Default", "MultipleExercises"];
Default.parameters = {
  ...Default.parameters,
  docs: {
    ...Default.parameters?.docs,
    source: {
      originalSource: "{\n  args: {\n    muscleGroupExercises: [{\n      targetMuscle: 'biceps',\n      sets: 3,\n      equipment: 'dumbell',\n      targetSubMuscle: 'long head',\n      movement: 'curl',\n      reps: 8,\n      weight: 15,\n      weightUnits: 'kg'\n    }]\n  }\n}",
      ...Default.parameters?.docs?.source
    }
  }
};
MultipleExercises.parameters = {
  ...MultipleExercises.parameters,
  docs: {
    ...MultipleExercises.parameters?.docs,
    source: {
      originalSource: "{\n  args: {\n    muscleGroupExercises: [{\n      targetMuscle: 'biceps',\n      sets: 3,\n      equipment: 'dumbell',\n      targetSubMuscle: 'long head',\n      movement: 'curl',\n      reps: 8,\n      weight: 15,\n      weightUnits: 'kg'\n    }, {\n      targetMuscle: 'abs',\n      sets: 3,\n      equipment: 'machine',\n      targetSubMuscle: 'lower chest',\n      movement: 'crunch',\n      reps: 8,\n      weight: 15,\n      weightUnits: 'kg'\n    }, {\n      targetMuscle: 'biceps',\n      sets: 3,\n      equipment: 'dumbell',\n      targetSubMuscle: 'long head',\n      movement: 'curl',\n      reps: 8,\n      weight: 15,\n      weightUnits: 'kg'\n    }]\n  }\n}",
      ...MultipleExercises.parameters?.docs?.source
    }
  }
};

/***/ })

});
//# sourceMappingURL=src-lib-muscle-group-exercises-card-muscle-group-card-stories.8eecede73a3773eccd16.hot-update.js.map