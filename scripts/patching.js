/* globals
libWrapper
*/

import { MODULE_ID } from "./module.js";
import { measureDistancesGridLayer } from "./segment.js";

export function registerManhattanRuler() {
  libWrapper.register(MODULE_ID, "GridLayer.prototype.measureDistances", measureDistancesGridLayer, libWrapper.WRAPPER);
}
