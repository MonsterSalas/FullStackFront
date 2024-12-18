"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
// https://sonarsource.github.io/rspec/#/rspec/S1082/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const eslint_plugin_jsx_a11y_1 = require("eslint-plugin-jsx-a11y");
const meta_1 = require("./meta");
const mouseEventsHaveKeyEvents = eslint_plugin_jsx_a11y_1.rules['mouse-events-have-key-events'];
const clickEventsHaveKeyEvents = eslint_plugin_jsx_a11y_1.rules['click-events-have-key-events'];
exports.rule = {
    meta: (0, helpers_1.generateMeta)(meta_1.meta, {
        hasSuggestions: true,
        messages: {
            ...mouseEventsHaveKeyEvents.meta.messages,
            ...clickEventsHaveKeyEvents.meta.messages,
        },
    }),
    create(context) {
        const mouseEventsHaveKeyEventsListener = mouseEventsHaveKeyEvents.create(context);
        const clickEventsHaveKeyEventsListener = clickEventsHaveKeyEvents.create(context);
        return (0, helpers_1.mergeRules)(mouseEventsHaveKeyEventsListener, clickEventsHaveKeyEventsListener);
    },
};
//# sourceMappingURL=rule.js.map